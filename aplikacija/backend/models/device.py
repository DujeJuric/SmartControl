from pydantic import BaseModel, Field
from models.deviceType import DeviceType
from typing import Dict, Any


class Device(BaseModel):
    device_name: str
    device_type: DeviceType
    device_state: str
    device_attributes: Dict[str, Any] = Field(default_factory=dict)
    device_last_changed: str
    device_last_updated: str
    device_context_id: str
    device_entity_id: str
    device_user_id: str