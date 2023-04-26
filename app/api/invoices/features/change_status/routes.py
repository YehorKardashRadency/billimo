from flask_restx import Resource

from app.api.extensions import invoices_ns


@invoices_ns.route('/accept/<int:id>')
class Accept(Resource):
    def put(self, id):
        pass


# Decline resource
@invoices_ns.route('/decline/<int:id>')
class Decline(Resource):
    def put(self, id):
        pass
