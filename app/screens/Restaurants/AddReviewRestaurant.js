import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements"
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase//app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp)

export default function AddReviewRestaurant(props) {
    const { navigation } = props;
    const { idRestaurant } = navigation.state.params
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    const addReview = () => {
        if (rating === null) {
            toastRef.current.show("No has dado ninguna puntuación");
        } else if(!title) {
            toastRef.current.show("El titulo es obligatorio");
        } else if(!review) {
            toastRef.current.show("El comentario es obligatorio");
        } else {
            setIsLoading(true)
            const user = firebase.auth().currentUser;
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant: idRestaurant,
                title: title,
                review: review,
                rating: rating,
                createAt: new Date() //Devuelve fecha actual
            }

            db.collection("reviews").add(payload).then(() => {
                updateRestaurant()
                
            }).catch(() => {
                toastRef.current.show("Error al enviar la review, intentelo más tarde");
                setIsLoading(false);
            })

            console.log(payload)
        }
    }
    
    const updateRestaurant = () => {
        const restaurantRef = db.collection("restaurants").doc(idRestaurant);

        restaurantRef.get().then(response => {
            const restaurantData = response.data();
            const ratingTotal = restaurantData.ratingTotal + rating;
            const quantityVoting = restaurantData.quantityVoting + 1;
            const ratingResult = ratingTotal / quantityVoting;

            restaurantRef.update({
                rating: ratingResult,
                ratingTotal, // Estás dos variables se dejan igual porque se llaman igual en firebase
                quantityVoting
            }).then(() => {
                setIsLoading(false)
                navigation.goBack();
            }).catch(() => {
                setIsLoading(false)
                toastRef.current.show("Error al enviar la review, intentelo más tarde");
            })
        })
    }

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={["Pésima", "Deficiente","Normal","Muy bueno", "Excelente"]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={value => setRating(value)}
                />
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder="Título"
                    containerStyle={styles.input}
                    onChange={e => setTitle(e.nativeEvent.text)}
                />
                <Input
                    placeholder="Comentario"
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={e => setReview(e.nativeEvent.text)}
                />
                <Button 
                    title="Enviar Comentario"
                    onPress={addReview}
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.5}/>
            <Loading isVisible={isLoading} text="Enviando comentario"/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    formReview: {
        margin: 2,
        marginTop: 40,
        flex: 1,
        alignItems: "center"
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 200,
        width: "100%",
        padding: 0,
        margin: 0 
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        width: "95%",
        marginBottom: 10
    },
    btn: {
        backgroundColor: "#00a680"
    }
})