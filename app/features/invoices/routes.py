from . import invoices_bp
from flask import jsonify, request
from werkzeug.exceptions import Conflict


@invoices_bp.route('/create-or-edit', methods=['POST'])
def create():
    pass


@invoices_bp.route('/send', methods=['POST'])
def send():
    pass


@invoices_bp.route('/accept/<int:id>', methods=['PUT'])
def accept(id):
    pass


@invoices_bp.route('/decline/<int:id>', methods=['PUT'])
def decline(id):
    pass


@invoices_bp.route('/ToArchive/<int:id>', methods=['PUT'])
def archive(id):
    pass


@invoices_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete(id):
    pass

@invoices_bp.route('/current', methods=['GET'])
def get_current():
    pass


@invoices_bp.route('/regular', methods=['GET'])
def get_regular():
    pass


@invoices_bp.route('/archived', methods=['GET'])
def get_archived():
    pass


@invoices_bp.route('/templates', methods=['GET'])
def get_templates():
    pass


@invoices_bp.route('/requests', methods=['GET'])
def get_requests():
    pass


@invoices_bp.route('/invoice-number', methods=['GET'])
def get_last_invoice_number():
    pass


@invoices_bp.route('/{id:int}', methods=['GET'])
def get_by_id(id):
    pass

