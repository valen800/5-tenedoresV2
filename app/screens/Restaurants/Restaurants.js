import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import ActionButton from "react-native-action-button";

import ListRestaurants from "../../components/Restaurants/ListRestaurants";

import * as firebase from "firebase/app";
import { firebaseApp } from "../../utils/FireBase";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [startRestaurants, setStartRestaurants] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [isReloadRestaurants, setIsReloadRestaurants] = useState(false);
  const LIMITRESTAURANTS = 8;

  //Si estamos logueado obtenemos la información del usuario
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  //Se obtiene cantidad de restaurantes y obtenemos los primero 8
  useEffect(() => {
    db.collection("restaurants")
      .get()
      .then(snap => {
        setTotalRestaurants(snap.size);
      });

    (async () => {
      const resultRestaurants = [];

      const restaurants = db
        .collection("restaurants")
        .orderBy("createAt", "desc")
        .limit(LIMITRESTAURANTS);

      await restaurants.get().then(response => {
        setStartRestaurants(response.docs[response.docs.lenght - 1]);

        response.forEach(doc => {
          let restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurants.push({ restaurant });
        });
        setRestaurants(resultRestaurants);
      });
    })();
    setIsReloadRestaurants(false);
  }, [isReloadRestaurants]);

  const handleLoadMore = async () => {
    const resultRestaurants = [];
    restaurants.length < totalRestaurants && setIsLoading(true);

    const restaurantsDB = db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurants.data().createAt)
      .limit(LIMITRESTAURANTS);

    await restaurantsDB.get().then(response => {
      if (response.docs.length > 0) {
        setStartRestaurants[response.docs.length - 1];
      } else {
        setIsLoading(false);
      }

      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push({ restaurant });
      });

      setRestaurants([...restaurants, ...resultRestaurants]);
    });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        restaurants={restaurants}
        isLoading={isLoading}
        handleLoadMore={handleLoadMore}
        navigation={navigation}
      />
      {user && (
        <AddRestaurantButton
          navigation={navigation}
          setIsReloadRestaurants={setIsReloadRestaurants}
        />
      )}
    </View>
  );
}

function AddRestaurantButton(props) {
  const { navigation, setIsReloadRestaurants } = props;

  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() =>
        navigation.navigate("AddRestaurant", { setIsReloadRestaurants })
      }
    />
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
});
