

import attr
from sqlalchemy import func, or_,and_
from sqlalchemy.orm import joinedload

from app.api.invoices.models import Invoice
from app.common import get_current_user
from app.common.external_api.administration_api import AdministrationApi
from app.core.port import UseCaseRequest, UseCaseResponse
from app.core.use_case import UseCase
from app.infra.db import db
from ..models import BillStatus, Bill, BillCancellation, BillMapper
from ..models.dto import BillDTO
from enum import Enum

from app.api.shared.models import ApprovalStatus


class BillType(Enum):
    Sent = 0
    Received = 1
    Exported = 2
    Requests = 3


class BillFilter:
    key: str
    value: str

    def __init__(self, filter_str: str):
        split = filter_str.split(' ')
        if len(split) < 3:
            raise Exception("Wrong filter format")
        self.key = split[0]
        self.value = split[2]


@attr.s(auto_attribs=True)
class ListBillsRequest(UseCaseRequest):
    bill_type: BillType
    page_index: int
    page_size: int
    search: str
    sort: list[str]
    filter: list[str]


@attr.s(auto_attribs=True)
class ListBillsResponse(UseCaseResponse):
    result: list[BillDTO] = None


class ListBillsUseCase(UseCase):
    def execute(self, uc_request: ListBillsRequest) -> ListBillsResponse:
        response = ListBillsResponse()
        current_user = get_current_user()
        query = db.select(Bill) \
            .options(joinedload(Bill.invoice).joinedload(Invoice.buyer),
                     joinedload(Bill.bill_cancellation).joinedload(BillCancellation.company))
        if uc_request.bill_type is (BillType.Sent or BillType.Exported):
            query = query.filter(Bill.invoice.has(seller_id=current_user.company_id))
        elif uc_request.bill_type is BillType.Received:
            query = query.filter(Bill.invoice.has(Invoice.buyer.has(ref_id=current_user.company_id)))
        elif uc_request.bill_type is BillType.Requests:
            query = query.filter(
                and_(
                    Bill.invoice.has(seller_id=current_user.company_id),
                    Bill.approval_status == ApprovalStatus.Pending
                )
               )
        bill_filters = [BillFilter(bill_filter) for bill_filter in uc_request.filter]
        status_filter = None
        for filter_obj in bill_filters:
            if filter_obj.key == 'status':
                status_filter = filter_obj
                break
        if status_filter is not None:
            query = query.filter(Bill.status == BillStatus[status_filter.value])
        if uc_request.search is not None:
            query = query.filter(
                or_(
                    func.lower(Bill.Invoice.Buyer.name).contains(uc_request.search.lower()),
                    func.lower("INV-" + Bill.Invoice.number).contains(uc_request.search.lower())
                )
            )

        bills = db.session.execute(query).scalars().all()
        start_index = uc_request.page_index * uc_request.page_size
        end_index = start_index + uc_request.page_size
        bills = bills[start_index:end_index]

        filter_company_id = list(set([item.invoice.buyer_id for item in bills]))

        administration_api = AdministrationApi(current_user)
        companies = administration_api.get_companies(filter_company_id)
        mapper = BillMapper(companies)
        dto = [mapper.to_dto(bill) for bill in bills]
        response.result = dto
        return response
