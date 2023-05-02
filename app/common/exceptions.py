import attr

@attr.s(auto_attribs=True)
class ValidationException(Exception):
    errors: dict
