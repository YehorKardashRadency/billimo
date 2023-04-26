from flask_restx import Resource

from app.api.extensions import invoices_ns


@invoices_ns.route('/send')
class Send(Resource):
    def post(self):
        pass