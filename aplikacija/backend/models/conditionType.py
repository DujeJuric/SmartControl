from pydantic import BaseModel, Field
from enum import Enum

class ConditionType(str, Enum):
    time = "time"
    location = "location"
    weather = "weather"
    temperature = "temperature"
    device_status = "device_status"
    manual = "manual"