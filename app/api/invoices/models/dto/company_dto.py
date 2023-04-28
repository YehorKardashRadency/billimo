import attr


@attr.s(auto_attribs=True)
class CompanyDTO:
    id: int
    name: str
    email: str
    logo: str
