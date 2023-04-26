from flask_restx import fields
from app.api.extensions import invoices_ns

invoice_item_dto_in = invoices_ns.model('invoice_item_in', {
    'id': fields.Integer(),
    'description': fields.String(),
    'price': fields.Float(),
    'metric': fields.String(),
    'count': fields.Integer(),
    'subTotal': fields.Float()
})

invoice_dto_in = invoices_ns.model('invoice_in', {
    'id': fields.Integer(),
    'number': fields.Integer(),
    'createdDate': fields.DateTime(),
    'dueDate': fields.DateTime(),
    'notes': fields.String(),
    'items': fields.List(fields.Nested(invoice_item_dto_in)),
    'buyerId': fields.Integer(),
    'buyerEmail': fields.String(),
    'sellerId': fields.Integer(),
    'isTemplate': fields.Boolean(),
    'send': fields.Boolean(),
    'currency': fields.String(),
    'isRegular': fields.Boolean(),
    'regularCreatingDate': fields.Boolean(),
    'templatePreview': fields.String()
})
