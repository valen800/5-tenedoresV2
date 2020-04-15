import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Card, Image, Rating } from "react-native-elements";
import Toast from "react-native-easy-toast";

import { firebaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function TopRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      db.collection("restaurants")
        .orderBy("rating")
        .limit(5)
        .get()
        .then((response) => {
          const restaurantArray = [];

          response.forEach((doc) => {
            restaurantArray.push(doc.data());
          });
          setRestaurants(restaurantArray);
        })
        .catch((error) => {
          console.log(error);
          toastRef.current.show(
            "Error al cargar el Ranking, intentelo más tarde",
            3000
          );
        });
    })();
  }, []);

  return (
    <View>
      <Text>We're in Top Restaurants</Text>
      <Toast ref={toastRef} position="center" opacity={1} />
    </View>
  );
}
