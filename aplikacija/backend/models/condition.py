from pydantic import BaseModel, Field
from models.conditionType import ConditionType

class Condition(BaseModel):
    condition_type: ConditionType
    condition_routine_id: str

    condition_time: str = None
    condition_days: str = None
    condition_repeat: bool  = None
    condition_location: str = None
    condition_weather: str = None
    condition_temperature: str = None
    condition_device_status: bool = None
    condition_device_id: str = None
    condition_manual: bool = None

    def __init__(self, **data):
        super().__init__(**data)
        if self.condition_type == ConditionType.time:
            self.condition_time = str(data.get('condition_time') )
            self.condition_days = str(data.get('condition_days'))
            self.condition_repeat = bool(data.get('condition_repeat'))
        elif self.condition_type == ConditionType.location:
            self.condition_location = str(data.get('condition_location'))
        elif self.condition_type == ConditionType.weather:
            self.condition_weather = str(data.get('condition_weather'))
        elif self.condition_type == ConditionType.temperature:
            self.condition_temperature = str(data.get('condition_temperature'))
        elif self.condition_type == ConditionType.device_status:
            self.condition_device_status = bool(data.get('condition_device_status'))
            self.condition_device_id = str(data.get('condition_device_id'))
        elif self.condition_type == ConditionType.manual:
            self.condition_manual = bool(data.get('condition_manual'))

        if self.condition_type != ConditionType.time:
            delattr(self, 'condition_time')
            delattr(self, 'condition_days')
            delattr(self, 'condition_repeat')
        if self.condition_type != ConditionType.location:
            delattr(self, 'condition_location')
        if self.condition_type != ConditionType.weather:
            delattr(self, 'condition_weather')
        if self.condition_type != ConditionType.temperature:
            delattr(self, 'condition_temperature')
        if self.condition_type != ConditionType.device_status:
            delattr(self, 'condition_device_status')
            delattr(self, 'condition_device_id')
        if self.condition_type != ConditionType.manual:
            delattr(self, 'condition_manual')
        



   
   
    