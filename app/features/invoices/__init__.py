from flask import Blueprint

invoices_bp = Blueprint('invoices', __name__)

from app.example import routes
