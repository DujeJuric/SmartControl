from pydantic import BaseModel
from typing import List, Union


class Context(BaseModel):

    context_user_id: str
    context_device_id: str
    context_location_latitude: str
    context_location_longitude: str
    context_temperature: float
    context_token: str


    