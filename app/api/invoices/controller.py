import json

from flask import request, jsonify, Response
from flask_restx import Resource

from app.api.extensions import invoices_ns
from app.api.shared.models import ApprovalStatus
from .models.invoice_type import InvoiceType
from .schemas.new_invoice_schema import invoice_dto_in
from .use_cases.archive_invoice import ArchiveInvoiceRequest, ArchiveInvoiceUseCase
from .use_cases.change_invoice_status import ChangeApprovalStatusUseCase, ChangeApprovalStatusRequest
from .use_cases.create_invoice import CreateInvoiceRequest, CreateInvoiceUseCase
from .use_cases.delete_invoice import DeleteInvoiceRequest, DeleteInvoiceUseCase
from .use_cases.get_by_id import GetInvoiceByIdUseCase, GetInvoiceByIdRequest
from .use_cases.get_last_invoice_number import GetLastInvoiceNumberRequest, GetLastInvoiceNumberUseCase
from .use_cases.list_invoices import ListInvoicesRequest, ListInvoicesUseCase
from .use_cases.send_invoice import SendInvoiceRequest, SendInvoiceUseCase
from ..shared.presenter import Presenter
from .validators import invoice_schema
from cerberus import Validator

from ...common.exceptions import ValidationException

uc_change_status = ChangeApprovalStatusUseCase()
uc_create_invoice = CreateInvoiceUseCase()
uc_send_invoice = SendInvoiceUseCase()
uc_delete_invoice = DeleteInvoiceUseCase()
uc_archive_invoice = ArchiveInvoiceUseCase()
uc_list_invoices = ListInvoicesUseCase()
uc_get_by_id = GetInvoiceByIdUseCase()
uc_get_last_number = GetLastInvoiceNumberUseCase()


@invoices_ns.route("/create-or-edit")
class Create(Resource):
    _create_presenter = Presenter()
    _send_presenter = Presenter()

    @invoices_ns.expect(invoice_dto_in)
    def post(self):
        data = request.json

        v = Validator(invoice_schema)
        if not v.validate(data):
            raise ValidationException(errors=v.errors)

        uc_create_request = CreateInvoiceRequest(invoice=data)
        response_create = uc_create_invoice.execute(uc_create_request)
        self._create_presenter.handle(response_create)

        if data['send'] and ApprovalStatus(response_create.result.approvalStatus) == ApprovalStatus.Approved:
            uc_send_request = SendInvoiceRequest(response_create.result.id)
            response_send = uc_send_invoice.execute(uc_send_request)
            self._send_presenter.handle(response_send)

        if data['isRegular']:
            # create regular invoice
            pass

        return jsonify(self._create_presenter.content_result)


# Delete resource
@invoices_ns.route('/delete/<int:id>')
class Delete(Resource):
    _presenter = Presenter()

    def delete(self, id):
        uc_request = DeleteInvoiceRequest(invoice_id=id)
        response = uc_delete_invoice.execute(uc_request)
        self._presenter.handle(response)
        return Response(status=200)


@invoices_ns.route('/ToArchive/<int:id>')
class Archive(Resource):
    _presenter = Presenter()

    def put(self, id):
        uc_request = ArchiveInvoiceRequest(invoice_id=id)
        response = uc_archive_invoice.execute(uc_request)
        self._presenter.handle(response)
        return Response(status=200)


@invoices_ns.route('/send/<int:id>')
class Send(Resource):
    _presenter = Presenter()

    def post(self, id):
        uc_request = SendInvoiceRequest(id)
        response = uc_send_invoice.execute(uc_request)
        self._presenter.handle(response)
        return Response(status=200)


@invoices_ns.route('/accept/<int:id>')
class Accept(Resource):
    _presenter = Presenter()

    def put(self, id):
        uc_request = ChangeApprovalStatusRequest(invoice_id=id, approval_status=ApprovalStatus.Approved)
        uc_response = uc_change_status.execute(uc_request)
        self._presenter.handle(uc_response)
        return Response(status=200)


# Decline resource
@invoices_ns.route('/decline/<int:id>')
class Decline(Resource):
    _presenter = Presenter()

    def put(self, id):
        uc_request = ChangeApprovalStatusRequest(invoice_id=id, approval_status=ApprovalStatus.RequiresUpdates)
        uc_response = uc_change_status.execute(uc_request)
        self._presenter.handle(uc_response)
        return Response(status=200)


@invoices_ns.route('/current')
class Current(Resource):
    _presenter = Presenter()

    def get(self):
        uc_request = ListInvoicesRequest(InvoiceType.Current)
        response = uc_list_invoices.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


# Regular resource
@invoices_ns.route('/regular')
class Regular(Resource):
    _presenter = Presenter()

    def get(self):
        uc_request = ListInvoicesRequest(InvoiceType.Current, regular=True)
        response = uc_list_invoices.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


# Archived resource
@invoices_ns.route('/archived')
class Archived(Resource):
    _presenter = Presenter()

    def get(self):
        uc_request = ListInvoicesRequest(InvoiceType.Archived)
        response = uc_list_invoices.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


# Templates resource
@invoices_ns.route('/templates')
class Templates(Resource):
    _presenter = Presenter()

    def get(self):
        uc_request = ListInvoicesRequest(InvoiceType.Template)
        response = uc_list_invoices.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


@invoices_ns.route('/invoice-number')
class GetLastInvoiceNumber(Resource):
    _presenter = Presenter()

    def get(self):
        uc_request = GetLastInvoiceNumberRequest()
        response = uc_get_last_number.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)


# Get resource by ID
@invoices_ns.route('/<int:id>')
class GetById(Resource):
    _presenter = Presenter()

    def get(self, id):
        uc_request = GetInvoiceByIdRequest(invoice_id=id)
        response = uc_get_by_id.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)
