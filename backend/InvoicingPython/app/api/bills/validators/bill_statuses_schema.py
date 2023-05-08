bill_statuses_schema = {
    'bills': {'type': 'list', 'schema': {'type': 'integer'}, 'required': True, 'minlength': 1},
    'status': {'type': 'string', 'allowed': ['NotSet', 'Approved', 'Pending', 'RequiresUpdates', 'Paid']}
}
