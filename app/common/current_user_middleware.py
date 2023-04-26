from enum import Enum

from . import common_bp
from flask import request, g


class Role(Enum):
    Empty = 'Empty'
    Admin = 'Admin',
    Director = 'Director',
    Manager = 'Manager',


class CurrentUser:
    id: int
    name: str
    role: Role
    company_id: int


@common_bp.before_app_request
def parse_user():
    user = CurrentUser()
    user.id = int(request.headers.get('claim_id', '0'))
    user.company_id = int(request.headers.get('claim_companyid', '0'))
    user.name = request.headers.get('claim_sub', '')
    user.role = Role[request.headers.get('claim_role', 'Empty')]
    g.current_user = user
