from cerberus import Validator
from flask import request, jsonify, Response
from flask_restx import Resource

from app.api.extensions import bills_ns
from app.api.shared.models import ApprovalStatus
from .use_cases.change_status import ChangeBillStatusRequest, ChangeBillStatusUseCase
from .use_cases.change_status_multiple import ChangeBillStatusMultipleRequest, ChangeBillStatusMultipleUseCase
from .use_cases.get_by_id import GetBillByIdUseCase, GetBillByIdRequest
from .use_cases.list_bills import ListBillsRequest, ListBillsUseCase, BillType
from .use_cases.cancel_bill import CancelBillRequest, CancelBillUseCase
from ..shared.presenter import Presenter
from .models.dto import CancelBillDTO
from .validators import bill_statuses_schema, bill_id_schema, bill_cancellation_schema
from ...common import ValidationException

uc_list_bills = ListBillsUseCase()
uc_get_by_id = GetBillByIdUseCase()
uc_change_status = ChangeBillStatusUseCase()
uc_change_status_multiple = ChangeBillStatusMultipleUseCase()
uc_cancel_bill = CancelBillUseCase()

@bills_ns.route('/sentbills')
class SentBills(Resource):
    _presenter = Presenter()

    def get(self):
        data = request.args.to_dict(flat=False)
        uc_request = ListBillsRequest(
            bill_type=BillType.Sent,
            page_index=int(data.get('pageIndex')[0]),
            page_size=int(data.get('pageSize')[0]),
            search=data.get('search')[0] if data.get('search') else None,
            sort=data.get('sort', []),
            filter=data.get('filter', [])
        )
        response = uc_list_bills.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


@bills_ns.route('/receivedbills')
class ReceivedBills(Resource):
    _presenter = Presenter()

    def get(self):
        data = request.args.to_dict(flat=False)
        uc_request = ListBillsRequest(
            bill_type=BillType.Received,
            page_index=int(data.get('pageIndex')[0]),
            page_size=int(data.get('pageSize')[0]),
            search=data.get('search')[0] if data.get('search') else None,
            sort=data.get('sort', []),
            filter=data.get('filter', [])
        )
        response = uc_list_bills.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


@bills_ns.route('/exportbills')
class ExportedBills(Resource):
    _presenter = Presenter()

    def get(self):
        data = request.args.to_dict(flat=False)
        uc_request = ListBillsRequest(
            bill_type=BillType.Exported,
            page_index=int(data.get('pageIndex')[0]),
            page_size=int(data.get('pageSize')[0]),
            search=data.get('search')[0] if data.get('search') else None,
            sort=data.get('sort', []),
            filter=data.get('filter', [])
        )
        response = uc_list_bills.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


@bills_ns.route('/<int:id>')
class BillPaymentDetails(Resource):
    _presenter = Presenter()

    def get(self, id):
        uc_request = GetBillByIdRequest(id)
        response = uc_get_by_id.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


@bills_ns.route('/requests')
class BillRequests(Resource):
    _presenter = Presenter()

    def get(self):
        data = request.args.to_dict(flat=False)
        uc_request = ListBillsRequest(
            bill_type=BillType.Requests,
            page_index=int(data.get('pageIndex')[0]),
            page_size=int(data.get('pageSize')[0]),
            search=data.get('search')[0] if data.get('search') else None,
            sort=data.get('sort', []),
            filter=data.get('filter', [])
        )
        response = uc_list_bills.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


@bills_ns.route('/create/request')
class CreateBillRequest(Resource):
    _presenter = Presenter()

    def put(self):
        data = request.json
        v = Validator(bill_id_schema)
        if not v.validate(data):
            raise ValidationException(errors=v.errors)

        id = data.json['billId']
        uc_request = ChangeBillStatusRequest(
            bill_id=id,
            approval_status=ApprovalStatus.Pending
        )
        response = uc_change_status.execute(uc_request)
        self._presenter.handle(response)
        return Response(status=200)


@bills_ns.route('/markas')
class MarkBillAs(Resource):
    _presenter = Presenter()

    def put(self):
        data = request.json

        v = Validator(bill_statuses_schema)
        if not v.validate(data):
            raise ValidationException(errors=v.errors)

        uc_request = ChangeBillStatusMultipleRequest(
            bill_ids=data['bills'],
            approval_status=ApprovalStatus[data['status']]
        )
        response = uc_change_status_multiple.execute(uc_request)
        self._presenter.handle(response)
        return Response(status=200)


@bills_ns.route('/<int:id>/retrieve')
class Retrieve(Resource):
    _presenter = Presenter()

    def get(self, id):
        uc_request = GetBillByIdRequest(id, include_companies=False)
        response = uc_get_by_id.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


@bills_ns.route('/approve/<int:id>')
class ApproveBill(Resource):
    _presenter = Presenter()

    def put(self, id):
        uc_request = ChangeBillStatusRequest(
            bill_id=id,
            approval_status=ApprovalStatus.Approved
        )
        response = uc_change_status.execute(uc_request)
        self._presenter.handle(response)
        return Response(status=200)


@bills_ns.route('/decline/<int:id>')
class DeclineBill(Resource):
    _presenter = Presenter()

    def put(self, id):
        uc_request = ChangeBillStatusRequest(
            bill_id=id,
            approval_status=ApprovalStatus.RequiresUpdates
        )
        response = uc_change_status.execute(uc_request)
        self._presenter.handle(response)
        return Response(status=200)


@bills_ns.route('/cancel/')
class CancelBill(Resource):
    _presenter = Presenter()

    def put(self):
        data = request.json

        v = Validator(bill_cancellation_schema)
        if not v.validate(data):
            raise ValidationException(errors=v.errors)

        uc_request = CancelBillRequest(
            cancel_bill_dto=CancelBillDTO(**data)
        )
        response = uc_cancel_bill.execute(uc_request)
        self._presenter.handle(response)
        return Response(status=200)
