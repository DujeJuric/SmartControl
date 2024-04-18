from pydantic import BaseModel
from models.actionType import ActionType

class Action(BaseModel):
    action_type: ActionType
    action_routine_id: str

    action_device_id: str = None
    action_device_status: bool = None
    action_notification: str = None
    action_activate_routine_id: str = None


    def __init__(self, **data):
        super().__init__(**data)
        if self.action_type == ActionType.control_device:
            self.action_device_id = data.get('action_device_id')
            self.action_device_status = data.get('action_device_status')
        elif self.action_type == ActionType.send_notification:
            self.action_notification = data.get('action_notification')
        elif self.action_type == ActionType.activate_routine:
            self.action_activate_routine_id = data.get('action_activate_routine_id')
        
        if self.action_type != ActionType.control_device:
            delattr(self, 'action_device_id')
            delattr(self, 'action_device_status')
        if self.action_type != ActionType.send_notification:
            delattr(self, 'action_notification')
        if self.action_type != ActionType.activate_routine:
            delattr(self, 'action_activate_routine_id')
        
        