from flask import Blueprint

middleware_bp = Blueprint('middleware', __name__)

from app.middlewares.current_user import middleware as current_user_middleware
