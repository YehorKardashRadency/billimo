bill_cancellation_schema = {
    'billId': {'type': 'integer', 'required': True},
    'companyId': {'type': 'integer', 'required': True},
    'cancellationReason': {'type': 'string', 'minlength': 0, 'maxlength': 100}
}
