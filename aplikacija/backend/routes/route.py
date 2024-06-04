from fastapi import APIRouter
from models.user import User
from models.device import Device
from models.routine import Routine
from models.conditionType import ConditionType
from models.actionType import ActionType
from models.context import Context
from models.condition import Condition, TimeCondition, LocationCondition, WeatherCondition, TemperatureCondition, DeviceStatusCondition, ManualCondition
from models.action import Action, ControlDeviceAction, SendNotificationAction, ActivateRoutineAction
from config.database import users_collection, devices_collection, routines_collection, conditions_collection, actions_collection, contexts_collection
from schema.schemas import individual_serial_user, individual_serial_device, multiple_serial_users, multiple_serial_devices, individual_serial_routine, multiple_serial_routines, individual_serial_condition, multiple_serial_conditions, individual_serial_action, multiple_serial_actions, individual_serial_context, multiple_serial_contexts
from bson import ObjectId
from fastapi import HTTPException
from auth import AuthHandler
from typing import Union, List
from routineLogic import checkLocationCondition, checkLocationBasedTemperatureCondition, checkDeviceBasedTemperatureCondition, activateRoutine
import httpx

router = APIRouter()
auth_handler = AuthHandler()

###USER ROUTES

# GET request to get all users
@router.get("/getUsers")
async def get_users():
    users =users_collection.find()
    return multiple_serial_users(users)

# POST request to create a new user
@router.post("/addUser", status_code=201)
async def create_user(user: User):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = dict(user)
    hashed_password = auth_handler.get_password_hash(user["password"])
    user["password"] = hashed_password
    users_collection.insert_one(user)
    #create a context for the user
    context = {"context_user_id": str(user["_id"]),"context_temperature": 0.0, "context_device_id": "", "context_location_latitude": "", "context_location_longitude": "", "context_token": ""}
    contexts_collection.insert_one(context)
    return individual_serial_user(user)

# POST request to login a user
@router.post("/login")
async def login_user(user: User):
    user = dict(user)
    user_db = users_collection.find_one({"email": user["email"]})
    if user_db is None:
        raise HTTPException(status_code=404, detail="User not found")
    if not auth_handler.verify_password(user["password"], user_db["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth_handler.encode_token(str(user_db["_id"]))
    return {"token": token}


# GET request to get a single user
@router.get("/getUser/{user_email}")
async def get_user(user_email: str):
    user = users_collection.find_one({"email": user_email})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return individual_serial_user(user)

# PUT request to update a user
@router.put("/updateUser/{user_email}")
async def update_user(user_email: str, user: User):
    user = dict(user)
    users_collection.update_one({"email": user_email}, {"$set": user})
    user = users_collection.find_one({"email": user_email})
    return individual_serial_user(user)

# DELETE request to delete a user
@router.delete("/deleteUser/{user_id}")
async def delete_user(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    users_collection.delete_one({"_id": ObjectId(user_id)})
    return individual_serial_user(user)



###DEVICE ROUTES

# GET request to get all devices
@router.get("/getDevices")
async def get_devices():
    devices = devices_collection.find()
    return multiple_serial_devices(devices)

# POST request to create a new device
@router.post("/addDevice")
async def create_device(device: Device):
    device = dict(device)
    devices_collection.insert_one(device)
    return individual_serial_device(device)

# DELETE request to delete a device
@router.delete("/deleteDevice/{device_id}")
async def delete_device(device_id: str):
    device = devices_collection.find_one({"_id": ObjectId(device_id)})
    devices_collection.delete_one({"_id": ObjectId(device_id)})
    return individual_serial_device(device)

# GET request to get user's devices
@router.get("/getUserDevices/{user_id}")
async def get_user_devices(user_id: str):
    devices = devices_collection.find({"device_user_id": user_id})
    return multiple_serial_devices(devices)

# PUT request to update a device
@router.put("/updateDevice/{device_id}")
async def update_device(device_id: str, device: Device):
    device = dict(device)
    devices_collection.update_one({"_id": ObjectId(device_id)}, {"$set": device})
    device = devices_collection.find_one({"_id": ObjectId(device_id)})
    checkDeviceBasedTemperatureCondition()
    return individual_serial_device(device)

### ROUTINE ROUTES

# POST request to activate a routine
@router.post("/activateRoutine/{routine_id}")
async def activate_routine(routine_id: str):
    routine = routines_collection.find_one({"_id": ObjectId(routine_id)})
    if routine is None:
        raise HTTPException(status_code=404, detail="Routine not found")
    activateRoutine(routine["_id"])
    return individual_serial_routine(routine)

# POST to create a new routine
@router.post("/addRoutine")
async def create_routine(routine: Routine):
    routine = dict(routine)
    routines_collection.insert_one(routine)
    return individual_serial_routine(routine)

# GET request to get user routines
@router.get("/getUserRoutines/{user_id}")
async def get_user_routines(user_id: str):
    routines = routines_collection.find({"routine_user_id": user_id})
    return multiple_serial_routines(routines)

# DELETE request to delete a routine
@router.delete("/deleteRoutine/{routine_id}")
async def delete_routine(routine_id: str):
    routine = routines_collection.find_one({"_id": ObjectId(routine_id)})
    conditions= conditions_collection.find({"condition_routine_id": routine_id})
    actions = actions_collection.find({"action_routine_id": routine_id})
    for condition in conditions:
        conditions_collection.delete_one({"_id": condition["_id"]})
    for action in actions:
        actions_collection.delete_one({"_id": action["_id"]})
    routines_collection.delete_one({"_id": ObjectId(routine_id)})
    return individual_serial_routine(routine)

# PUT request to update a routine
@router.put("/updateRoutine/{routine_id}")
async def update_routine(routine_id: str, routine: Routine):
    routine = dict(routine)
    routines_collection.update_one({"_id": ObjectId(routine_id)}, {"$set": routine})
    routine = routines_collection.find_one({"_id": ObjectId(routine_id)})
    return individual_serial_routine(routine)

### CONDITION ROUTES

# GET request to get all conditions
@router.get("/getConditions")
async def get_conditions():
    conditions = conditions_collection.find()
    return multiple_serial_conditions(conditions)


#POST request to create a new condition
@router.post("/addCondition")
async def create_condition(condition: Union[LocationCondition, WeatherCondition, TemperatureCondition, DeviceStatusCondition, ManualCondition, TimeCondition]):
    condition = dict(condition)
    conditions_collection.insert_one(condition)
    return individual_serial_condition(condition, ConditionType[condition["condition_type"]])

# GET request to get routine conditions
@router.get("/getRoutineConditions/{routine_id}")
async def get_routine_conditions(routine_id: str):
    conditions = conditions_collection.find({"condition_routine_id": routine_id})
    return multiple_serial_conditions(conditions)

# DELETE request to delete a condition
@router.delete("/deleteCondition/{condition_id}")
async def delete_condition(condition_id: str):
    condition = conditions_collection.find_one({"_id": ObjectId(condition_id)})
    if condition is None:
        raise HTTPException(status_code=404, detail="Condition not found")
    conditions_collection.delete_one({"_id": ObjectId(condition_id)})
    return individual_serial_condition(condition, ConditionType[condition["condition_type"]])

# PUT request to update a condition
@router.put("/updateCondition/{condition_id}")
async def update_condition(condition_id: str, condition: Union[LocationCondition, WeatherCondition, TemperatureCondition, DeviceStatusCondition, ManualCondition, TimeCondition]):
    condition = dict(condition)
    conditions_collection.update_one({"_id": ObjectId(condition_id)}, {"$set": condition})
    condition = conditions_collection.find_one({"_id": ObjectId(condition_id)})
    if condition is None:
        raise HTTPException(status_code=404, detail="Condition not found")
    return individual_serial_condition(condition, ConditionType[condition["condition_type"]])

### ACTION ROUTES

# POST request to create a new action
@router.post("/addAction")
async def create_action(action: Union[ControlDeviceAction, SendNotificationAction, ActivateRoutineAction]):
    action = dict(action)
    actions_collection.insert_one(action)
    return individual_serial_action(action, ActionType[action["action_type"]])

# GET request to get routine actions
@router.get("/getRoutineActions/{routine_id}")
async def get_routine_actions(routine_id: str):
    actions = actions_collection.find({"action_routine_id": routine_id})
    return multiple_serial_actions(actions)

# DELETE request to delete an action
@router.delete("/deleteAction/{action_id}")
async def delete_action(action_id: str):
    action = actions_collection.find_one({"_id": ObjectId(action_id)})
    actions_collection.delete_one({"_id": ObjectId(action_id)})
    return individual_serial_action(action, ActionType[action["action_type"]])

# PUT request to update an action
@router.put("/updateAction/{action_id}")
async def update_action(action_id: str, action: Union[ControlDeviceAction, SendNotificationAction, ActivateRoutineAction]):
    action = dict(action)
    actions_collection.update_one({"_id": ObjectId(action_id)}, {"$set": action})
    action = actions_collection.find_one({"_id": ObjectId(action_id)})
    if action is None:
        raise HTTPException(status_code=404, detail="Action not found") 
    return individual_serial_action(action, ActionType[action["action_type"]])




### CONTEXT ROUTES

# POST request to change the temperature context
@router.post("/changeTemperatureContext/{context_user_id}")
async def change_temperature_context(context_user_id: str, context: Context):
    context = dict(context)
    contexts_collection.update_one({"context_user_id": context_user_id}, {"$set": {"context_temperature": context["context_temperature"]}})
    context = contexts_collection.find_one({"context_user_id": context_user_id})
    checkLocationBasedTemperatureCondition()
    return individual_serial_context(context)
    

# POST request to change the location context
@router.post("/changeLocationContext/{context_user_id}")
async def change_location_context(context_user_id: str, context: Context):
    context = dict(context)
    contexts_collection.update_one({"context_user_id": context_user_id}, {"$set": {"context_location_latitude": context["context_location_latitude"], "context_location_longitude": context["context_location_longitude"]}})
    context = contexts_collection.find_one({"context_user_id": context_user_id})
    checkLocationCondition()
    return individual_serial_context(context)

#POST request to change the device token
@router.post("/changeDeviceToken/{context_user_id}")
async def change_device_token(context_user_id: str, context: Context):
    context = dict(context)
    contexts_collection.update_one({"context_user_id": context_user_id}, {"$set": {"context_token": context["context_token"]}})
    context = contexts_collection.find_one({"context_user_id": context_user_id})
    return individual_serial_context(context)

# GET request to get user context
@router.get("/getUserContext/{context_user_id}")
async def get_user_context(context_user_id: str):
    context = contexts_collection.find_one({"context_user_id": context_user_id})
    return individual_serial_context(context)

# POST request to create a new context
@router.post("/addContext")
async def create_context(context: Context):
    context = dict(context)
    contexts_collection.insert_one(context)
    return individual_serial_context(context)




# Notifcations

# POST request to send a notification
EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"
@router.post("/sendNotification")
async def send_notification(expo_push_token: str, title: str, message: str):
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
    }
    payload = {
        "to": expo_push_token,
        "sound": "default",
        "title": title,
        "body": message,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(EXPO_PUSH_URL, headers=headers, json=payload)
        return response.json()