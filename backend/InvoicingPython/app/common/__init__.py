from flask import Blueprint

common_bp = Blueprint('common', __name__)

from .current_user_middleware import *
from .exception_handlers import *