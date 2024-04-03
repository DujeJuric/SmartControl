def individual_serial_user(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "complete": user["complete"],
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


