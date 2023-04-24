from app.models.role import Role


class CurrentUser:
    id: int
    name: str
    role: Role
    company_id: int
