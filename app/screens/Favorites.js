import React, {useState, useEffect} from "react"
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native"
import { Image } from "react-native-elements"

import { firebaseApp } from "../utils/FireBase"
import firebase from "firebase/app"
import "firebase/firestore"
const db = firebase.firestore(firebaseApp)

export default function Favorites(props) {
    const { navigation } = props
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const idUser = firebase.auth().currentUser.uid
        db.collection("favorites").where("idUser", "==", idUser).get().then(response => {
            const idRestaurantsArray = [];
            response.forEach(doc => {
                idRestaurantsArray.push(doc.data().idRestaurant)
            })
            getDataRestaurant(idRestaurantsArray).then(response => {
                console.log(response);
                
            })
        })
    }, [])

    const getDataRestaurant = idRestaurantsArray => {
        const arrayRestaurants = []
        idRestaurantsArray.forEach(idRestaurant => {
            const result = db.collection("restaurants").doc(idRestaurant).get()
            arrayRestaurants.push(result)
        })
        return Promise.all(arrayRestaurants) //Promise espera que termine de ejecutar la función antes de devolver nada.
    }

    return (
        <View>
            <Text>Lista de restaurante favoritos</Text>
        </View>
    )
}