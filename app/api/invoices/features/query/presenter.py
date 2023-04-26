from app.common.global_exception import NotFoundError
from .use_case import ListInvoicesResponse
from app.core.exceptions import BaseNotFoundException
from app.core.port import JsonContentResult
from app.core.use_case import UseCaseOutputPort


class ListInvoicesPresenter(UseCaseOutputPort[ListInvoicesResponse], JsonContentResult):

    def handle(self, response: ListInvoicesResponse) -> None:
        if not response.is_succeeded:
            if isinstance(response.error, BaseNotFoundException):
                raise NotFoundError(response.error.message)
        self.content_result = response
