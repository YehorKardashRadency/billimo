from flask_restx import Resource

from app.api.extensions import invoices_ns


@invoices_ns.route('/ToArchive/<int:id>')
class Archive(Resource):
    def put(self, id):
        pass
