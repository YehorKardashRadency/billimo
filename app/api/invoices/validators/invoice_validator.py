from datetime import datetime


def to_date(s): return datetime.strptime(s, '%Y-%m-%d')


invoice_schema = {
    'id': {'type': 'integer', 'nullable': True},
    'number': {'type': 'integer', 'required': True},
    'createdDate': {'type': 'datetime', 'required': True, 'coerce': to_date},
    'dueDate': {'type': 'datetime', 'required': True, 'coerce': to_date},
    'regularCreatingDate': {'type': 'datetime', 'nullable': True, 'coerce': to_date},
    'notes': {'type': 'string', 'minlength': 0, 'maxlength': 50, 'required': True},
    'buyerId': {'type': 'integer', 'nullable': True},
    'buyerName': {'type': 'string', 'required': False},
    'buyerEmail': {'type': 'string', 'nullable': True},
    'sellerId': {'type': 'integer', 'required': True},
    'isTemplate': {'type': 'boolean', 'required': True},
    'send': {'type': 'boolean', 'required': True},
    'isRegular': {'type': 'boolean', 'required': True},
    'currency': {'type': 'string', 'allowed': ['USD', 'EUR', 'UAH'], 'required': True},
    'templatePreview': {'type': 'string',
                        'nullable': True,
                        'regex': '^data:image\\/png;base64,\S+$'},
    'items': {'type': 'list',
              'schema': {'type': 'dict', 'schema': 'invoice_item'},
              'allow_unknown': True}
}
