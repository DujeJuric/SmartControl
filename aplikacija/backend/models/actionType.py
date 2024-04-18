from pydantic import BaseModel
from enum import Enum

class ActionType(str, Enum):
    control_device = "control_device"
    activate_routine = "activate_routine"
    send_notification = "send_notification"
    