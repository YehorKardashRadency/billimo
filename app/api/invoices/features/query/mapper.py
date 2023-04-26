from app.api.invoices.features.query.DTO import InvoiceDTO, InvoiceItemDTO
from app.api.invoices.models import InvoiceItem, Invoice
from app.core.mapper import ApiMapper
import base64


def map_items(item: InvoiceItem) -> InvoiceItemDTO:
    return InvoiceItemDTO(
        description=item.description,
        price=item.price,
        metric=item.metric.name,
        count=item.count,
        subtotal=item.subtotal
    )


class ListInvoicesPresenterMapper(ApiMapper):
    @staticmethod
    def to_dto(entity: Invoice) -> InvoiceDTO:
        items = list(map(map_items, entity.items))
        template_preview = (base64.b64encode(entity.template_preview).decode('utf-8')
                            if entity.template_preview is not None
                            else '')
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
            approvalStatus=entity.approval_status.value,
            type=entity.type.name,
            paymentStatus=entity.type.name,
            category=items[0].description if len(items) > 0 else '',
            templatePreview=template_preview,
            items=items
        )

    @staticmethod
    def to_entity(payload: InvoiceDTO) -> Invoice:
        pass
