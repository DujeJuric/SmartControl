from models.actionType import ActionType
from models.conditionType import ConditionType
from models.condition import Condition
from models.action import Action


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
        "device_state": device["device_state"],
        "device_attributes": device["device_attributes"],
        "device_last_changed": device["device_last_changed"],
        "device_last_updated": device["device_last_updated"],
        "device_context_id": device["device_context_id"],
        "device_entity_id": device["device_entity_id"],
        "device_user_id": device["device_user_id"],
    }

def multiple_serial_devices(devices) -> list:
    return [individual_serial_device(device) for device in devices]

def individual_serial_routine(routine) -> dict:
    return {
        "id": str(routine["_id"]),
        "routine_name": routine["routine_name"],
        "routine_user_id": routine["routine_user_id"],
    }

def multiple_serial_routines(routines) -> list:
    return [individual_serial_routine(routine) for routine in routines]

def individual_serial_action(action: Action, type) -> dict:
    if type == ActionType.control_device:
        return {
            "id": str(action["_id"]),
            "action_type": action["action_type"],
            "action_routine_id": action["action_routine_id"],
            "action_device_id": action["action_device_id"],
            "action_device_control_type": action["action_device_control_type"]
        }
    elif type == ActionType.send_notification:
        return {
            "id": str(action["_id"]),
            "action_type": action["action_type"],
            "action_routine_id": action["action_routine_id"],
            "action_notification_title": action["action_notification_title"],
            "action_notification_body": action["action_notification_body"]
        }
    elif type == ActionType.activate_routine:
        return {
            "id": str(action["_id"]),
            "action_type": action["action_type"],
            "action_routine_id": action["action_routine_id"],
            "action_activate_routine_id": action["action_activate_routine_id"]
        }
    else:
        raise ValueError("Unsupported action type")
    
def multiple_serial_actions(actions) -> list:
    return [individual_serial_action(action, ActionType[action["action_type"]]) for action in actions]


def individual_serial_condition(condition: Condition, type) -> dict:

    if type == ConditionType.time:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_true": condition["condition_true"],
            "condition_time": condition["condition_time"],
            "condition_days": condition["condition_days"],
            "condition_repeat": condition["condition_repeat"]
        }
    elif type == ConditionType.location:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_true": condition["condition_true"],
            "condition_location_latitude": condition["condition_location_latitude"],
            "condition_location_longitude": condition["condition_location_longitude"]
        }
    elif type == ConditionType.weather:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_true": condition["condition_true"],
            "condition_weather": condition["condition_weather"]
        }
    elif type == ConditionType.temperature:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_true": condition["condition_true"],
            "condition_temperature": condition["condition_temperature"],
            "condition_device_id": condition["condition_device_id"],
            "condition_option": condition["condition_option"],
            "condition_temperature_type": condition["condition_temperature_type"]

        }
    elif type == ConditionType.device_status:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_true": condition["condition_true"],
            "condition_device_status": condition["condition_device_status"],
            "condition_device_id": condition["condition_device_id"]
        }
    elif type == ConditionType.manual:
        return {
            "id": str(condition["_id"]),
            "condition_type": condition["condition_type"],
            "condition_routine_id": condition["condition_routine_id"],
            "condition_true": condition["condition_true"],
            "condition_manual": condition["condition_manual"]
        }
    else:
        raise ValueError("Unsupported condition type")
       

    
def multiple_serial_conditions(conditions) -> list:
    return [individual_serial_condition(condition, ConditionType[condition["condition_type"]]) for condition in conditions]

def individual_serial_context(context) -> dict:
    return {
        "id": str(context["_id"]),
        "context_user_id": context["context_user_id"],
        "context_device_id": context["context_device_id"],
        "context_location_latitude": context["context_location_latitude"],
        "context_location_longitude": context["context_location_longitude"],
        "context_temperature": context["context_temperature"],
        "context_token": context["context_token"]
    }

def multiple_serial_contexts(contexts) -> list:

    return [individual_serial_context(context) for context in contexts]

def individual_serial_historyLog(historyLog) -> dict:
    return {
        "id": str(historyLog["_id"]),
        "log_text": historyLog["log_text"],
        "log_user_id": historyLog["log_user_id"],
        "log_date": historyLog["log_date"]
    }

def multiple_serial_historyLogs(historyLogs) -> list:
    return [individual_serial_historyLog(historyLog) for historyLog in historyLogs]






