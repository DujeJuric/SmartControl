from pydantic import BaseModel
from enum import Enum

class DeviceType(str, Enum):
    sensor = "sensor"
    actuator = "actuator"
    gateway = "gateway"
    camera = "camera"
    light = "light"
    switch = "switch"
    thermostat = "thermostat"
    door_lock = "door_lock"
    door_bell = "door_bell"
    television = "television"


