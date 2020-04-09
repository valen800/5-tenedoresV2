import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import openMap from "react-native-open-maps"
import MapView from "react-native-maps"

export default function Map(props) {
    const {location, name, height} = props

    const openAppMap = () => {
        openMap({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 19,
            query: name
        })
    }

    return (
        <MapView style={{height: height, width: "100%"}} initialRegion={location} onPress={openAppMap}>
            <MapView.Marker 
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            />
        </MapView>
    )
}