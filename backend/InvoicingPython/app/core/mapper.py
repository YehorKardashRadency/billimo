from abc import ABC, abstractmethod
from typing import Generic, TypeVar

Entity = TypeVar("Entity")
Presenter = TypeVar("Presenter")
Payload = TypeVar("Payload")


class ApiMapper(ABC, Generic[Entity, Presenter, Payload]):
    @staticmethod
    @abstractmethod
    def to_dto(entity: Entity) -> Presenter:
        """Map an Entity to a Presenter"""

    @staticmethod
    @abstractmethod
    def to_entity(payload: Payload) -> Entity:
        """Map a Payload to an Entity"""
