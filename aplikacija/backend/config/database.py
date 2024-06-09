from pymongo import MongoClient
import ssl

client = MongoClient("mongodb+srv://dujeAdmin:dujeAdmin@mobileappdb.ufe79j6.mongodb.net/?retryWrites=true&w=majority&appName=mobileAppDB", ssl_cert_reqs=ssl.CERT_NONE)

db = client.mobileAppDB

users_collection = db["users"]
devices_collection = db["devices"]
routines_collection = db["routines"]
conditions_collection = db["conditions"]
actions_collection = db["actions"]
contexts_collection = db["contexts"]
historyLogs_collection = db["historyLogs"]