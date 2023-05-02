import attr


@attr.s(auto_attribs=True)
class UseCaseException(Exception):
    message: str = None


@attr.s(auto_attribs=True)
class BaseNotFoundException(UseCaseException):
    pass


@attr.s(auto_attribs=True)
class BaseBadRequestException(UseCaseException):
    pass


@attr.s(auto_attribs=True)
class BaseForbiddenAccessException(UseCaseException):
    message: str = 'You don\'t have access!'
