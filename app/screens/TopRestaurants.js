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
import ListTopRestaurants from "../components/Ranking/ListTopRestaurants";

import { firebaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function TopRestaurants(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      db.collection("restaurants")
        .orderBy("rating", "desc")
        .limit(5)
        .get()
        .then((response) => {
          const restaurantArray = [];

          response.forEach((doc) => {
            let restaurant = doc.data();
            restaurant.id = doc.id;
            restaurantArray.push(restaurant);
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
      <ListTopRestaurants restaurants={restaurants} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={1} />
    </View>
  );
}
