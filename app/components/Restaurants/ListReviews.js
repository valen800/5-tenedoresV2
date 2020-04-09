import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text,FlatList } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements"

export default function ListReviews(props) {
    const { navigation, idRestaurant } = props;

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
                    idRestaurant: idRestaurant
                })}
            />
            <Text>Lista de cometarios...</Text>
        </View>
    );
            
}

const styles = StyleSheet.create({
    btnReview: {
        backgroundColor: "transparent"
    },
    btnTitleAddReview: {
        color: "#00a680"
    }
}) 