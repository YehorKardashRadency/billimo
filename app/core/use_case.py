from abc import ABC, abstractmethod

from .port import UseCaseRequest, UseCaseResponse


class UseCase(ABC):

    @abstractmethod
    def execute(self, uc_request: UseCaseRequest) -> UseCaseResponse:
        return NotImplemented
