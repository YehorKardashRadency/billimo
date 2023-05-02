from typing import Callable
import attr

@attr.s(auto_attribs=True)
class Consumer:
    queue: str
    callback: Callable
