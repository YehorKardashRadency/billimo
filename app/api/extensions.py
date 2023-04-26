from flask_restx import Api
from . import api_bp

api = Api(
    api_bp,
    title='Invoicing microservice',
    version='1.0'
)
invoices_ns = api.namespace("invoice")

api.add_namespace(invoices_ns)


