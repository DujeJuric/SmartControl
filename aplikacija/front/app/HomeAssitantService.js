import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { BASE_URL } from "../utility/url";

HOME_ASSISTANT_URL = "http://10.19.4.148:8123/api";
TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmY2RmNGI0ZmY5NjU0N2VmYThjODIwYzQzNGU5MDAyOSIsImlhdCI6MTcxNjk3MDA5MiwiZXhwIjoyMDMyMzMwMDkyfQ.l9aTM7mrYrtw7gTawbabtTK6u1aYgEauMlF2FFl5Owo";

export const getDevices = async () => {
  const url = HOME_ASSISTANT_URL;

  try {
    const devicesResponse = await fetch(url + "/states", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!devicesResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const devicesData = await devicesResponse.json();
    return devicesData.filter(
      (device) =>
        device.entity_id.includes("sensor.") ||
        device.entity_id.includes("light.") ||
        device.entity_id.includes("switch.") ||
        device.entity_id.includes("binary_sensor.") ||
        device.entity_id.includes("weather.") ||
        device.entity_id.includes("fan.")
    );
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export const turnOnDevice = async (data, type, deviceId) => {
  const url = HOME_ASSISTANT_URL;
  try {
    const response = await fetch(url + "/services/" + type + "/turn_on", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    const databaseData = await getDevice(deviceId);
    const updatedData = await getDeviceState(data.entity_id, responseData);
    return await update(databaseData, updatedData);
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export const turnOffDevice = async (data, type, deviceId) => {
  const url = HOME_ASSISTANT_URL;
  try {
    const response = await fetch(url + "/services/" + type + "/turn_off", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    const databaseData = await getDevice(deviceId);
    const updatedData = await getDeviceState(data.entity_id, responseData);
    return await update(databaseData, updatedData);
  } catch (error) {
    console.error("There was an error!", error);
  }
};

const getDeviceState = async (entity_id, responseData) => {
  const url = HOME_ASSISTANT_URL;

  try {
    const response = await fetch(url + "/states/" + entity_id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

const getDevice = async (deviceId) => {
  const url = BASE_URL;

  try {
    const response = await fetch(url + "/getDevice/" + deviceId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

const update = async (storedDevice, newDevice) => {
  const url = BASE_URL;

  body = {
    device_name: storedDevice.device_name,
    device_type: storedDevice.device_type,
    device_state: newDevice.state,
    device_attributes: newDevice.attributes,
    device_last_changed: newDevice.last_changed,
    device_last_updated: newDevice.last_updated,
    device_context_id: newDevice.context.id,
    device_entity_id: storedDevice.device_entity_id,
    device_user_id: storedDevice.device_user_id,
  };

  try {
    const response = await fetch(url + "/updateDevice/" + storedDevice.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was an error!", error);
  }
};
