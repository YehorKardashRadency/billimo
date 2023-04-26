from flask_restx import Resource
from flask import jsonify
from app.api.extensions import invoices_ns
from app.api.invoices.features.query.presenter import ListInvoicesPresenter
from app.api.invoices.features.query.use_case import ListInvoicesRequest, ListInvoicesUseCase
from app.api.invoices.models.invoice_type import InvoiceType


# Current resource
@invoices_ns.route('/current')
class Current(Resource):
    _uc_list_invoices = ListInvoicesUseCase()
    _presenter = ListInvoicesPresenter()

    def get(self):
        request = ListInvoicesRequest(InvoiceType.Current)
        self._uc_list_invoices.execute(request, self._presenter)
        return jsonify(self._presenter.content_result)


# Regular resource
@invoices_ns.route('/regular')
class Regular(Resource):
    _uc_list_invoices = ListInvoicesUseCase()
    _presenter = ListInvoicesPresenter()

    def get(self):
        request = ListInvoicesRequest(InvoiceType.Current, regular=True)
        self._uc_list_invoices.execute(request, self._presenter)
        return jsonify(self._presenter.content_result)


# Archived resource
@invoices_ns.route('/archived')
class Archived(Resource):
    _uc_list_invoices = ListInvoicesUseCase()
    _presenter = ListInvoicesPresenter()

    def get(self):
        request = ListInvoicesRequest(InvoiceType.Archived)
        self._uc_list_invoices.execute(request, self._presenter)
        return jsonify(self._presenter.content_result)


# Templates resource
@invoices_ns.route('/templates')
class Templates(Resource):
    _uc_list_invoices = ListInvoicesUseCase()
    _presenter = ListInvoicesPresenter()

    def get(self):
        request = ListInvoicesRequest(InvoiceType.Template)
        self._uc_list_invoices.execute(request, self._presenter)
        return jsonify(self._presenter.content_result)


@invoices_ns.route('/invoice-number')
class LastInvoiceNumber(Resource):
    def get(self):
        pass


# Get resource by ID
@invoices_ns.route('/<int:id>')
class GetById(Resource):
    def get(self, id):
        pass