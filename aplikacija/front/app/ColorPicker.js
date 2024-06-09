import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

const ColorPicker = ({
  xValue,
  yValue,
  setXValue,
  setYValue,
  brightness,
  setBrightness,
}) => {
  const [x, setX] = useState(xValue);
  const [y, setY] = useState(yValue);
  const [bright, setBright] = useState(brightness);
  const [color, setColor] = useState("rgb(0,0,0)");

  useEffect(() => {
    updateColor(xValue, yValue);
  }, []);

  const handleXChange = (value) => {
    setX(value);
    setXValue(value);
    updateColor(value, y);
  };

  const handleYChange = (value) => {
    setY(value);
    setYValue(value);
    updateColor(x, value);
  };

  const handeBrightChange = (value) => {
    setBright(value);
    setBrightness(value);
  };

  const updateColor = (x, y) => {
    const r = Math.floor(x * 255);
    const g = Math.floor(y * 255);
    const b = 150;
    setColor(`rgb(${r},${g},${b})`);
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
        <Text style={styles.label}>X: </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={x}
          onValueChange={handleXChange}
        />
      </View>
      <View style={styles.valueView}>
        <Text style={styles.label}>Y: </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={y}
          onValueChange={handleYChange}
        />
      </View>
      <View style={styles.valueView}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Color: </Text>
        <View style={[styles.colorDisplay, { backgroundColor: color }]} />
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

export default ColorPicker;
