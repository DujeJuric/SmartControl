from fastapi import APIRouter
from models.user import User
from models.device import Device
from config.database import users_collection, devices_collection
from schema.schemas import individual_serial_user, individual_serial_device, multiple_serial_users, multiple_serial_devices
from bson import ObjectId
from fastapi import HTTPException
from auth import AuthHandler

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



