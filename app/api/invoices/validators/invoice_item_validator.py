from cerberus import schema_registry


def to_decimal(s): return float(s)


invoice_item_schema = {
    'description': {'type': 'string', 'required': True, 'minlength': 0, 'maxlength': 100},
    'price': {'type': 'number', 'required': True, 'coerce': to_decimal},
    'metric': {'type': 'string', 'required': True, 'allowed': ['Quantity', 'Hours', 'Months', 'CustomMetric']},
    'count': {'type': 'integer', 'required': True, 'min': 1},
    'subtotal': {'type': 'number', 'required': True, 'min': 0}
}

schema_registry.add('invoice_item', invoice_item_schema)
