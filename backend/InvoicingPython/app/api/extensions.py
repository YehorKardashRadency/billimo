from flask_restx import Api
from . import api_bp

api = Api(
    api_bp,
    title='Invoicing microservice',
    version='1.0'
)
invoices_ns = api.namespace("invoice")
bills_ns = api.namespace("bill")
quick_actions_ns = api.namespace("quickactions")


