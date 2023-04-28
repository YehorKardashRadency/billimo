import base64
import decimal
from datetime import datetime
from typing import List, Any

from sqlalchemy import Enum

from app.api.shared.models import ApprovalStatus
from app.common.dotdict_util import DotDict
from app.core.mapper import ApiMapper, Entity
from app.infra.db import Column, Model, SurrogatePK, db, reference_col
from .currency import Currency
from .dto import InvoiceDTO, InvoiceItemDTO, InvoiceNumberDTO
from .dto.new_invoice_dto import NewInvoiceDTO
from .invoice_item import InvoiceItem
from .invoice_type import InvoiceType
from . import Metric


class Invoice(Model, SurrogatePK):
    __tablename__ = 'invoices'

    number = Column(db.BigInteger, nullable=False)
    created_date = Column(db.DateTime, nullable=False)
    due_date = Column(db.DateTime, nullable=False)
    notes = Column(db.String)
    total = Column(db.Numeric(precision=10, scale=2), nullable=False)
    is_regular = Column(db.Boolean, nullable=False)
    regular_invoice_date = Column(db.DateTime)
    template_preview = Column(db.LargeBinary)

    currency = Column(Enum(Currency))

    buyer_id = reference_col('companies', nullable=True)
    buyer = db.relationship('Company', back_populates='invoices_as_buyer', foreign_keys=[buyer_id])
    buyer_email = Column(db.String)

    seller_id = reference_col('companies')
    seller = db.relationship('Company', back_populates='invoices_as_seller', foreign_keys=[seller_id])

    type = Column(Enum(InvoiceType), nullable=False)
    approval_status = Column(Enum(ApprovalStatus), nullable=False)

    items = db.relationship('InvoiceItem', back_populates='invoice', cascade='all, delete-orphan')

    bill = db.relationship('Bill', uselist=False, back_populates='invoice')

    def __init__(self, number: int, due_date: datetime, currency: Currency, notes: str = '',
                 invoice_type: InvoiceType = InvoiceType.Current, items: List[InvoiceItem] = None,
                 seller_id: int = None, buyer_id: int = None, total: decimal = 0,
                 regular_invoice_date: datetime = None, is_regular: bool = False,
                 approval_status: ApprovalStatus = ApprovalStatus.Approved, buyer_email: str = None,
                 template_preview: str = None):
        self.number = number
        self.created_date = datetime.utcnow()
        self.due_date = due_date
        self.currency = currency
        self.notes = notes
        self.type = invoice_type
        self.items = items or []
        self.seller_id = seller_id
        self.buyer_id = buyer_id
        self.total = total
        self.regular_invoice_date = regular_invoice_date
        self.is_regular = is_regular
        self.approval_status = approval_status
        self.buyer_email = buyer_email,
        self.template_preview = template_preview


def map_items(item: InvoiceItem) -> InvoiceItemDTO:
    return InvoiceItemDTO(
        description=item.description,
        price=item.price,
        metric=item.metric.name,
        count=item.count,
        subtotal=item.subtotal
    )


class InvoiceItemMapper(ApiMapper):

    @staticmethod
    def _entity_to_dto(entity: InvoiceItem) -> InvoiceItemDTO:
        return InvoiceItemDTO(
            description=entity.description,
            price=entity.price,
            metric=entity.metric.name,
            count=entity.count,
            subtotal=entity.subtotal
        )

    @staticmethod
    def to_dto(entity: Any) -> InvoiceItemDTO:
        if not isinstance(entity, InvoiceItem):
            entity = InvoiceItemMapper.to_entity(entity)
        return InvoiceItemMapper._entity_to_dto(entity)

    @staticmethod
    def _dto_to_entity(payload: InvoiceItemDTO) -> InvoiceItem:
        return InvoiceItem(
            description=payload.description,
            metric=payload.metric,
            count=payload.count,
            price=payload.price,
            subtotal=payload.subtotal
        )

    @staticmethod
    def _dict_to_entity(payload: Any) -> InvoiceItem:
        return InvoiceItem(
            description=payload['description'],
            metric=Metric[payload['metric']],
            count=payload['count'],
            price=payload['price'],
            subtotal=payload['subtotal']
        )

    @staticmethod
    def to_entity(payload: Any) -> InvoiceItem:
        if isinstance(payload, InvoiceItemDTO):
            return InvoiceItemMapper._dto_to_entity(payload)
        else:
            return InvoiceItemMapper._dict_to_entity(payload)


class InvoiceMapper(ApiMapper):
    @staticmethod
    def to_dto(entity: Invoice) -> InvoiceDTO:
        items = list(map(InvoiceItemMapper.to_dto, entity.items))
        template_preview = "data:image/png;base64," + (base64.b64encode(entity.template_preview).decode('utf-8')
                                                       if entity.template_preview is not None
                                                       else '')
        approval_status = (entity.approval_status.value[0]
                           if type(entity.approval_status.value) is tuple
                           else entity.approval_status.value)
        return InvoiceDTO(
            id=entity.id,
            number=str(entity.number),
            createdDate=entity.created_date,
            dueDate=entity.due_date,
            notes=entity.notes,
            currency=entity.currency.name,
            buyerId=entity.buyer_id,
            sellerId=entity.seller_id,
            total=entity.total,
            approvalStatus=approval_status,
            type=entity.type.name,
            paymentStatus=entity.type.name,
            category=items[0].description if len(items) > 0 else '',
            templatePreview=template_preview,
            items=items
        )

    @staticmethod
    def to_entity(payload: InvoiceDTO) -> Invoice:
        raise NotImplemented


class NewInvoiceMapper(ApiMapper):
    @staticmethod
    def to_dto(entity: Any) -> NewInvoiceDTO:
        entity = DotDict(entity)
        items = list(map(InvoiceItemMapper.to_dto, entity['items']))
        return NewInvoiceDTO(
            id=entity.id,
            number=str(entity.number),
            createdDate=entity.createdDate,
            dueDate=entity.dueDate,
            notes=entity.notes,
            currency=entity.currency,
            buyerId=entity.buyerId,
            buyerEmail=entity.buyerEmail if len(entity.buyerEmail) > 0 else None,
            sellerId=entity.sellerId,
            templatePreview=entity.templatePreview,
            items=items,
            isTemplate=entity.isTemplate,
            send=entity.send,
            isRegular=entity.isRegular,
            regularCreatingDate=entity.regularCreatingDate
        )

    @staticmethod
    def _dto_to_entity(payload: NewInvoiceDTO) -> Invoice:
        templatePreview = None
        if len(payload.templatePreview) > 0:
            # data:image/png;base64,iVBORw0KG...
            base64_data = payload.templatePreview.split(',')[1]
            templatePreview = base64.b64decode(base64_data)
        return Invoice(
            number=int(payload.number),
            approval_status=ApprovalStatus.NotSet,
            currency=Currency[payload.currency],
            items=[InvoiceItemMapper.to_entity(item) for item in payload.items],
            total=sum([item.subtotal for item in payload.items]),
            notes=payload.notes,
            buyer_id=payload.buyerId,
            buyer_email=payload.buyerEmail,
            due_date=payload.dueDate,
            seller_id=payload.sellerId,
            template_preview=templatePreview
        )

    @staticmethod
    def to_entity(payload: Any) -> Invoice:
        if not isinstance(payload, NewInvoiceDTO):
            payload = NewInvoiceMapper.to_dto(payload)
        return NewInvoiceMapper._dto_to_entity(payload)


class InvoiceNumberMapper(ApiMapper):
    @staticmethod
    def to_entity(number: int) -> Entity:
        raise NotImplemented

    @staticmethod
    def to_dto(number: int) -> InvoiceNumberDTO:
        return InvoiceNumberDTO(newInvoiceNumber=number)
