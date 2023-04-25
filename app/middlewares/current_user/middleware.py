from app.middlewares import middleware_bp
from flask import request, g

from app.middlewares.current_user.models import CurrentUser
from app.models.enums.role import Role


@middleware_bp.before_app_request
def parse_user():
    user = CurrentUser()
    user.id = int(request.headers.get("claim_id", "0"))
    user.company_id = int(request.headers.get("claim_companyid", "0"))
    user.name = request.headers.get("claim_sub", "")
    user.role = Role[request.headers.get("claim_role", "Empty")]
    g.current_user = user

