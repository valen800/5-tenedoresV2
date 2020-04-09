import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements"

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {
    const { navigation, idRestaurant, setRating } = props;
    const [reviews, setReviews] = useState([]);
    const [reviewsReload, setReviewsReload] = useState(false);

    useEffect(() => {
        (async () => {
            const resultReviews = [];
            const arrayRating = [];

            db.collection("reviews").where("idRestaurant", "==", idRestaurant).get().then(response => {
                response.forEach(doc => {
                    resultReviews.push(doc.data());
                    arrayRating.push(doc.data().rating)
                });
                let numSum = 0;
                arrayRating.map(value => {
                    numSum = numSum + value;
                });
                const countRating = arrayRating.length;
                const resultRating = numSum / countRating;
                const resultRatingFinish = resultRating ? resultRating : 0;

                setReviews(resultReviews);
                setRating(resultRatingFinish);
            })
            setReviewsReload(false);
        })()
    }, [reviewsReload])

    return (
        <View>
            <Button
                buttonStyle={styles.btnReview}
                titleStyle={styles.btnTitleAddReview}
                title="Escribir una opinión"
                icon={{
                    type: "material-community",
                    name: "square-edit-outline",
                    color: "#00a680"
                }}
                onPress={() => navigation.navigate("AddReviewRestaurant",{
                    idRestaurant: idRestaurant,
                    setReviewsReload: setReviewsReload
                })}
            />
            <FlatList 
                data={reviews}
                renderItem={review => <Review review={review} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );  
}

function Review(props) {
    const { title, review, rating, createAt, avatarUser } = props.review.item;
    const formatDateReview = new Date(createAt.seconds * 1000);
    return (
        <View style={styles.viewReview}>
            <View style={styles.viewImageAvatar}>
                <Avatar
                    size="large"
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source={{
                         uri: avatarUser ? avatarUser : "https://api.adorable.io/avatars/285/abott@adorable.png" 
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    btnReview: {
        backgroundColor: "transparent"
    },
    btnTitleAddReview: {
        color: "#00a680"
    },
    viewReview: {
        flexDirection: "row",
        margin: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    viewImageAvatar: {
        marginRight: 15
    },
    imageAvatarUser: {
        width: 50,
        height: 50
    }
}) 