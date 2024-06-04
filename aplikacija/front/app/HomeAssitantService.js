BASE_URL = "http://10.19.4.148:8123/api";
TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmY2RmNGI0ZmY5NjU0N2VmYThjODIwYzQzNGU5MDAyOSIsImlhdCI6MTcxNjk3MDA5MiwiZXhwIjoyMDMyMzMwMDkyfQ.l9aTM7mrYrtw7gTawbabtTK6u1aYgEauMlF2FFl5Owo";

export const getDevices = async () => {
  const url = BASE_URL;

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
