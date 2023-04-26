from http import HTTPStatus

from flask import request
from flask_restx import Resource

from app.api.extensions import invoices_ns
from app.api.invoices.features.manage.schema import invoice_dto_in
from app.api.invoices.features.manage.validators import is_invoice_valid


@invoices_ns.route("/create-or-edit")
class Create(Resource):
    @invoices_ns.expect(invoice_dto_in)
    def post(self):
        data = request.json

        is_valid = is_invoice_valid(data)

        if is_valid != {}:
            return is_valid, HTTPStatus.BAD_REQUEST

        result = None

        # if data['send'] and result.approval_status == ApprovalStatus.Approved:
        #     # send invoice
        #     pass
        #
        # if data['isRegular']:
        #     # create regular invoice
        #     pass

        # return jsonify(result), HTTPStatus.OK



# Delete resource
@invoices_ns.route('/delete/<int:id>')
class Delete(Resource):
    def delete(self, id):
        pass
