from pydantic import Field, BaseModel
from models.conditionType import ConditionType


class Condition(BaseModel):
    
    condition_type: ConditionType
    condition_routine_id: str
    condition_true: bool


class TimeCondition(Condition, BaseModel):
    condition_time: str
    condition_days: str
    condition_repeat: bool

    def __init__(self, **data):
        super().__init__(**data)
        self.condition_time = data.get('condition_time')
        self.condition_days = data.get('condition_days')
        self.condition_repeat = data.get('condition_repeat')

class LocationCondition(Condition):
    condition_location_latitude: str
    condition_location_longitude: str

    def __init__(self, **data):
        super().__init__(**data)
        self.condition_location_latitude = data.get('condition_location_latitude')
        self.condition_location_longitude = data.get('condition_location_longitude')
    
class WeatherCondition(Condition):
    condition_weather: str

    def __init__(self, **data):
        super().__init__(**data)
        self.condition_weather = data.get('condition_weather')

class TemperatureCondition(Condition):
    condition_temperature: float
    condition_device_id: str
    condition_option: str
    condition_temperature_type: str

    def __init__(self, **data):
        super().__init__(**data)
        self.condition_temperature = data.get('condition_temperature')
        self.condition_device_id = data.get('condition_device_id')
        self.condition_option = data.get('condition_option')
        self.condition_temperature_type = data.get('condition_temperature_type')

class DeviceStatusCondition(Condition):
    condition_device_status: bool
    condition_device_id: str

    def __init__(self, **data):
        super().__init__(**data)
        self.condition_device_status = data.get('condition_device_status')
        self.condition_device_id = data.get('condition_device_id')

class ManualCondition(Condition):
    condition_manual: bool

    def __init__(self, **data):
        super().__init__(**data)
        self.condition_manual = data.get('condition_manual')




   
   
    