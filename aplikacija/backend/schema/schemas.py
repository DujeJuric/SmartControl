from models.actionType import ActionType
from models.conditionType import ConditionType
from models.condition import Condition


def individual_serial_user(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        }

def multiple_serial_users(users) -> list:
    return [individual_serial_user(user) for user in users]

def individual_serial_device(device) -> dict:
    return {
        "id": str(device["_id"]),
        "device_name": device["device_name"],
        "device_type": device["device_type"],
        "device_manufacturer": device["device_manufacturer"],
        "device_model": device["device_model"],
        "device_user_id": device["device_user_id"],
    }

def multiple_serial_devices(devices) -> list:
    return [individual_serial_device(device) for device in devices]

def individual_serial_routine(routine) -> dict:
    return {
        "id": str(routine["_id"]),
        "routine_name": routine["routine_name"],
        "routine_description": routine["routine_description"],
        "routine_user_id": routine["routine_user_id"],
    }

def multiple_serial_routines(routines) -> list:
    return [individual_serial_routine(routine) for routine in routines]

def individual_serial_action(action) -> dict:
    if action.get("action_type") == ActionType.control_device:
        return {
            "id": str(action["_id"]),
            "action_type": action["action_type"],
            "action_routine_id": action["action_routine_id"],
            "action_device_id": action.get("action_device_id"),
            "action_device_status": action.get("action_device_status")
        }
    elif action.get("action_type") == ActionType.send_notification:
        return {
            "id": str(action["_id"]),
            "action_type": action["action_type"],
            "action_routine_id": action["action_routine_id"],
            "action_notification": action.get("action_notification")
        }
    elif action.get("action_type") == ActionType.activate_routine:
        return {
            "id": str(action["_id"]),
            "action_type": action["action_type"],
            "action_routine_id": action["action_routine_id"],
            "action_activate_routine_id": action.get("action_activate_routine_id")
        }
    else:
        return {}
    
def multiple_serial_actions(actions) -> list:
    return [individual_serial_action(action) for action in actions]



def individual_serial_condition(condition) -> dict:
    if condition.get("condition_type") == ConditionType.time:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_time": condition.get("condition_time"),
            "condition_days": condition.get("condition_days"),
            "condition_repeat": condition.get("condition_repeat")
        }
    elif condition.get("condition_type") == ConditionType.location:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_location": condition.get("condition_location")
        }
    elif condition.get("condition_type") == ConditionType.weather:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_weather": condition.get("condition_weather")
        }
    elif condition.get("condition_type") == ConditionType.temperature:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_temperature": condition.get("condition_temperature")
        }
    elif condition.get("condition_type") == ConditionType.device_status:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_device_status": condition.get("condition_device_status"),
            "condition_device_id": condition.get("condition_device_id")
        }
    else:
        return {}
    
def multiple_serial_conditions(conditions) -> list:
    return [individual_serial_condition(condition) for condition in conditions]



