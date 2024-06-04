from pydantic import BaseModel
from models.actionType import ActionType


class Action(BaseModel):
    action_type: ActionType
    action_routine_id: str

class ControlDeviceAction(Action, BaseModel):
    action_device_id: str
    action_device_status: bool

    def __init__(self, **data):
        super().__init__(**data)
        self.action_device_id = data.get('action_device_id')
        self.action_device_status = data.get('action_device_status')

class SendNotificationAction(Action, BaseModel):
    action_notification_title: str
    action_notification_body: str

    def __init__(self, **data):
        super().__init__(**data)
        self.action_notification_title = data.get('action_notification_title')
        self.action_notification_body = data.get('action_notification_body')

class ActivateRoutineAction(Action, BaseModel):
    action_activate_routine_id: str

    def __init__(self, **data):
        super().__init__(**data)
        self.action_activate_routine_id = data.get('action_activate_routine_id')
        