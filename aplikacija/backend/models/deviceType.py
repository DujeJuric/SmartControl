from pydantic import BaseModel
from enum import Enum

class DeviceType(str, Enum):
    sensor = "sensor"
    light = "light"
    switch = "switch"
    binary_sensor = "binary_sensor"
    weather = "weather"
    fan = "fan"


