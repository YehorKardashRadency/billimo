from flask import Blueprint

api_bp = Blueprint('api', __name__, url_prefix='/api/')

from .extensions import invoices_ns, bills_ns, api
from .invoices import *
from .bills import *
from .quick_actions import *
