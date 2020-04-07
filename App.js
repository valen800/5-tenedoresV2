import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./app/navigations/Navigation";
import { firebaseApp } from "./app/utils/FireBase";
import { decode, encode } from "base-64";
import { YellowBox } from "react-native";
import _ from "lodash";

//warnings settings times
YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

//Ignore Warnings
YellowBox.ignoreWarnings([
  "Warning: componentWillReceiveProps has been renamed",
  "Warning: componentWillMount has been renamed"
]);

//Error variable atob and crypto
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = (byteArray) => {
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = Math.floor(256 * Math.random());
  }
};

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

export default function App() {
  return <Navigation />;
}
