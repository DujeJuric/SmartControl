from pydantic import BaseModel
from models.deviceType import DeviceType


class Device(BaseModel):
    device_name: str
    device_type: DeviceType
    device_manufacturer: str
    device_model: str
    device_user_id: str