import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

const TempColorPicker = ({
  min,
  max,
  colorTemp,
  setColorTemp,
  brightness,
  setBrightness,
}) => {
  const [temp, setTemp] = useState(colorTemp);
  const [bright, setBright] = useState(brightness);

  const handleTempChange = (value) => {
    setTemp(value);
    setColorTemp(value);
  };

  const handeBrightChange = (value) => {
    setBright(value);
    setBrightness(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.valueView}>
        <Text style={styles.label}>Brightness: </Text>
        <Slider
          style={styles.sliderBright}
          minimumValue={3}
          maximumValue={255}
          value={bright}
          onValueChange={handeBrightChange}
        />
      </View>
      <View style={styles.valueView}>
        <Text style={styles.label}>Temp: </Text>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={temp}
          onValueChange={handleTempChange}
        />
      </View>
      <View style={styles.valueView}>
        <Text style={styles.label}>Temp Value: {temp.toFixed(2)} </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    alignContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  slider: {
    width: 200,
    height: 40,
    marginVertical: 10,
  },
  sliderBright: {
    width: 126,
    height: 40,
    marginVertical: 10,
  },
  colorDisplay: {
    width: 50,
    height: 50,

    borderRadius: 75,
  },
  colorText: {
    fontSize: 18,
    marginTop: 20,
  },
  valueView: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
});

export default TempColorPicker;
