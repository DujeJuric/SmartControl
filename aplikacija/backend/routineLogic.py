import pytz
from datetime import datetime
from schema.schemas import individual_serial_condition, multiple_serial_conditions
from config.database import conditions_collection, contexts_collection, routines_collection, devices_collection, actions_collection, users_collection, contexts_collection, historyLogs_collection
from bson.objectid import ObjectId
import math
import requests

def checkTimeCondition():

    current_time = datetime.now(pytz.timezone('Europe/Zagreb')).time().strftime("%H:%M") 
    current_day = datetime.now(pytz.timezone('Europe/Zagreb')).strftime("%A")

    conditions = conditions_collection.find({"condition_type": "time"})

    for condition in conditions:
        condition_time = condition["condition_time"]
        condition_days = condition["condition_days"].split(",")
        

        if condition_days == [""]:
            if current_time == condition_time:
                if condition["condition_true"] == False:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": True}})
                    print(f"Time condition met for condition {condition['_id']}")
                    checkIffAllConditionsAreMet(condition["condition_routine_id"])
            else:
                if condition["condition_true"] == True:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": False}})  
                    print(f"!Time condition not longer met for condition {condition['_id']}") 
                          
        else:
            if current_time == condition_time and current_day in condition_days:
                if condition["condition_true"] == False:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": True}})
                    print(f"Time condition met for condition {condition['_id']}")
                    checkIffAllConditionsAreMet(condition["condition_routine_id"])
            else:
                if condition["condition_true"] == True:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": False}})
                    print(f"!Time condition not longer met for condition {condition['_id']}")


def checkLocationCondition():
    
    conditions = conditions_collection.find({"condition_type": "location"})

    for condition in conditions:

        routineId = condition["condition_routine_id"]

        routine = routines_collection.find_one({"_id": ObjectId(routineId)})

        userId = routine["routine_user_id"]

        userContext = contexts_collection.find_one({"context_user_id": userId})

        userLatitude = float(userContext["context_location_latitude"])
        userLongitude = float(userContext["context_location_longitude"])

        conditionLatitude = float(condition["condition_location_latitude"])
        conditionLongitude = float(condition["condition_location_longitude"])

        R = 6371000
        distanceLatitude = (conditionLatitude - userLatitude) * math.pi / 180
        distanceLongitude = (conditionLongitude - userLongitude) * math.pi / 180
        a = math.sin(distanceLatitude / 2) * math.sin(distanceLatitude / 2) + math.cos(userLatitude * math.pi / 180) * math.cos(conditionLatitude * math.pi / 180) * math.sin(distanceLongitude / 2) * math.sin(distanceLongitude / 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        if distance <= 20:
            if condition["condition_true"] == False:
                conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": True}})
                print(f"Location condition met for condition {condition['_id']}")
                checkIffAllConditionsAreMet(condition["condition_routine_id"])
        else:
            if condition["condition_true"] == True:
                conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": False}})
                print(f"!Location condition not longer met for condition {condition['_id']}")


       
def checkLocationBasedTemperatureCondition():

    conditions = conditions_collection.find({"condition_temperature_type": "Your Location"})

    for condition in conditions:

        routineId = condition["condition_routine_id"]
        routine = routines_collection.find_one({"_id": ObjectId(routineId)})
        userId = routine["routine_user_id"]
        userContext = contexts_collection.find_one({"context_user_id": userId})

        userLocationTemperature = float(userContext["context_temperature"])
        conditionTemperature = float(condition["condition_temperature"])

        conditionOption = condition["condition_option"]

        if conditionOption == "Above":
            if userLocationTemperature > conditionTemperature:
                if condition["condition_true"] == False:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": True}})
                    print(f"Location based temperature condition met for condition {condition['_id']}")
                    checkIffAllConditionsAreMet(condition["condition_routine_id"])
            else:
                if condition["condition_true"] == True:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": False}})
                    print(f"!Location based temperature condition not longer met for condition {condition['_id']}")

        elif conditionOption == "Bellow":
            if userLocationTemperature < conditionTemperature:
                if condition["condition_true"] == False:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": True}})
                    print(f"Location based temperature condition met for condition {condition['_id']}")
                    checkIffAllConditionsAreMet(condition["condition_routine_id"])
            else:
                if condition["condition_true"] == True:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": False}})
                    print(f"!Location based temperature condition not longer met for condition {condition['_id']}")


def checkDeviceBasedTemperatureCondition():

    conditions = conditions_collection.find({"condition_temperature_type": "Device"})
    

    for condition in conditions:

        device = devices_collection.find_one({"_id": ObjectId(condition["condition_device_id"])})
        
        deviceTemperature = 0
        if "temperature" in device["device_attributes"]:
            
            deviceTemperature = float(device["device_attributes"]["temperature"])
        else:
            
            if  device["device_state"] != "unavailable":
                deviceTemperature = float(device["device_state"])
            else:
               
                continue

        
        
        conditionTemperature = float(condition["condition_temperature"])

        conditionOption = condition["condition_option"]

        if conditionOption == "Above":
            if deviceTemperature > conditionTemperature:
                if condition["condition_true"] == False:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": True}})
                    print(f"Location based temperature condition met for condition {condition['_id']}")
                    checkIffAllConditionsAreMet(condition["condition_routine_id"])
            else:
                if condition["condition_true"] == True:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": False}})
                    print(f"!Location based temperature condition not longer met for condition {condition['_id']}")

        elif conditionOption == "Bellow":
            if deviceTemperature < conditionTemperature:
                if condition["condition_true"] == False:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": True}})
                    print(f"Location based temperature condition met for condition {condition['_id']}")
                    checkIffAllConditionsAreMet(condition["condition_routine_id"])
            else:
                if condition["condition_true"] == True:
                    conditions_collection.update_one({"_id": condition["_id"]}, {"$set": {"condition_true": False}})
                    print(f"!Location based temperature condition not longer met for condition {condition['_id']}")


def checkIffAllConditionsAreMet(routineId):

    routine = routines_collection.find_one({"_id": ObjectId(routineId)})
    routineConditions = conditions_collection.find({"condition_routine_id": str(routine["_id"])})

    allConditionsMet = True

    for condition in routineConditions:
        if condition["condition_true"] == False:
            allConditionsMet = False
            break
        
    if allConditionsMet == True:
        print("All conditions met for routine " + str(routine["_id"]))
        activateRoutine(routine["_id"])
        
    else:
        print("Not all conditions met for routine " + str(routine["_id"]))




def activateRoutine(routineId):
    
    routine = routines_collection.find_one({"_id": ObjectId(routineId)})

    userId = routine["routine_user_id"]
    userContext = contexts_collection.find_one({"context_user_id": userId})
    userToken = userContext["context_token"]


    routineActions = actions_collection.find({"action_routine_id": str(routine["_id"])})

    for action in routineActions:

        actionType = action["action_type"]

        if actionType == "send_notification":
            title = action["action_notification_title"]
            body = action["action_notification_body"]
            sendNotification(userToken, title, body)

        elif actionType == "activate_routine":
            activateRoutineId = action["action_activate_routine_id"]
            activateRoutine(activateRoutineId)

        elif actionType == "control_device":
            deviceId = action["action_device_id"]
            device = devices_collection.find_one({"_id": ObjectId(deviceId)})
            deviceEntityId = device["device_entity_id"]
            deviceType = device["device_type"]
            controlType = action["action_device_control_type"]
            controlDevice(deviceEntityId, deviceType, controlType)
            
        historyLog = {
            "log_text": f"Routine {routine['routine_name']} has been activated",
            "log_user_id": userId,
            "log_date": datetime.now(pytz.timezone('Europe/Zagreb')).strftime("%Y-%m-%d %H:%M:%S")
        }
        historyLogs_collection.insert_one(historyLog)







EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

def sendNotification(token, title, body):
    headers = {
        'Accept': 'application/json',
        "Accept-Encoding": "gzip, deflate",
        'Content-Type': 'application/json'
    }

    payload = {
        "to": token,
        "sound" : "default",
        "title": title,
        "body": body
    }
    response = requests.post(EXPO_PUSH_URL, headers=headers, json=payload)
    return response.status_code

HOME_ASSISTANT_URL = "http://10.19.4.148:8123/api"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmY2RmNGI0ZmY5NjU0N2VmYThjODIwYzQzNGU5MDAyOSIsImlhdCI6MTcxNjk3MDA5MiwiZXhwIjoyMDMyMzMwMDkyfQ.l9aTM7mrYrtw7gTawbabtTK6u1aYgEauMlF2FFl5Owo";

def controlDevice(deviceEntityId, deviceType, controlType):
    
    headers = {
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json'
    }
    payload = {
        "entity_id": deviceEntityId
    }
    if controlType == "Turn on":
        try:
            response = requests.post(HOME_ASSISTANT_URL + "/services/" + deviceType + "/turn_on", headers=headers, json=payload)
        except requests.exceptions.RequestException as e:
            print(e)
        
    elif controlType == "Turn off":
        try:
            response = requests.post(HOME_ASSISTANT_URL + "/services/" + deviceType + "/turn_off", headers=headers, json=payload)
        except requests.exceptions.RequestException as e:
            print(e)
    else :
        print("Invalid control type")
    




    