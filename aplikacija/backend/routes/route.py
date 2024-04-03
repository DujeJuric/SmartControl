from fastapi import APIRouter
from models.user import User
from models.device import Device
from config.database import users_collection, devices_collection
from schema.schemas import individual_serial_user, individual_serial_device, multiple_serial_users, multiple_serial_devices
from bson import ObjectId
from fastapi import HTTPException

router = APIRouter()

###USER ROUTES

# GET request to get all users
@router.get("/getUsers")
async def get_users():
    users =users_collection.find()
    return multiple_serial_users(users)

# POST request to create a new user
@router.post("/addUser")
async def create_user(user: User):
    user = dict(user)
    users_collection.insert_one(user)
    return individual_serial_user(user)

# GET request to get a single user
@router.get("/getUser/{user_id}")
async def get_user(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    return individual_serial_user(user)

# PUT request to update a user
@router.put("/updateUser/{user_id}")
async def update_user(user_id: str, user: User):

    user_data = dict(user)
        
    existing_user = users_collection.find_one({"_id": ObjectId(user_id)})
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": user_data})
    updated_user = users_collection.find_one({"_id": ObjectId(user_id)})

    return individual_serial_user(updated_user)

# DELETE request to delete a user
@router.delete("/deleteUser/{user_id}")
async def delete_user(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    users_collection.delete_one({"_id": ObjectId(user_id)})
    return individual_serial_user(user)

# GET request to get user's devices
@router.get("/getUserDevices/{user_id}")
async def get_user_devices(user_id: str):
    devices = devices_collection.find({"device_user_id": user_id})
    return multiple_serial_devices(devices)

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



