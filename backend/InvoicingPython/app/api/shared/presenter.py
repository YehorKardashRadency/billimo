from werkzeug.exceptions import NotFound, Forbidden, BadRequest

from app.core.exceptions import BaseNotFoundException, BaseForbiddenAccessException, BaseBadRequestException
from app.core.port import UseCaseOutputPort, JsonContentResult, UseCaseResponse


class Presenter(UseCaseOutputPort, JsonContentResult):

    def handle(self, response: UseCaseResponse) -> None:
        if not response.is_succeeded:
            if isinstance(response.error, BaseNotFoundException):
                raise NotFound(description=response.error.message)
            if isinstance(response.error, BaseForbiddenAccessException):
                raise Forbidden(description=response.error.message)
            if isinstance(response.error, BaseBadRequestException):
                raise BadRequest(description=response.error.message)
        self.content_result = response
