import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView,Text, Dimensions } from "react-native";
import {Rating, ListItem} from "react-native-elements"
import CarouselImages from "../../components/Carousel";
import Map from "../../components/Map"
import ListReviews from "../../components/Restaurants/ListReviews"
import * as firebase from "firebase";

const screenWidth = Dimensions.get("window").width;
const screenHeight = 200;

export default function Restaurant(props) {
  const { navigation } = props;
  const { restaurant } = navigation.state.params.restaurant.item;
  const [imagesRestaurant, setImagesRestaurant] = useState([]);
  const [rating, setRating] = useState(restaurant.rating);
  

  useEffect(() => {
    const arrayUrls = [];
    (async () => {
      await Promise.all(
        restaurant.images.map(async (idImage) => {
          await firebase
            .storage()
            .ref(`restaurant-images/${idImage}`)
            .getDownloadURL()
            .then((imageUrl) => arrayUrls.push(imageUrl));
        })
      );
      setImagesRestaurant(arrayUrls);
    })();
  }, []);

  return (
    <ScrollView style={styles.viewBody}>
      <CarouselImages
        arrayImages={imagesRestaurant}
        width={screenWidth}
        height={screenHeight}
      />
      <TitleRestaurant 
        name={ restaurant.name }
        description={restaurant.description}
        rating={rating}
      />
      <RestaurantInfo 
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      />
      <ListReviews 
        navigation={navigation}
        idRestaurant={restaurant.id}
        setRating={setRating}
      />
    </ScrollView>
  );
}

function TitleRestaurant(props) {
  const {name, description, rating} = props

  return (
      <View style={styles.viewRestaurantTitle}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.nameRestaurant}>{name}</Text>
          <Rating
            style={styles.rating}
            imageSize={20}
            readonly
            startingValue={parseFloat(rating)}
          />
        </View>
          <Text style={styles.descriptionRestaurant}>{description}</Text>
      </View>
  )
}

function RestaurantInfo(props) {
  const {location, name, address} = props

  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null
    },
    {
      text: "111 222 333",
      iconName: "phone",
      iconType: "material-community",
      action: null
    },
    {
      text: "varulo.cvcv@gmail.com",
      iconName: "phone",
      iconType: "material-community",
      action: null
    }
  ]

  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Información sobre el restaurante
      </Text>
      <Map location={location} name={name} height={100}/>
      {listInfo.map((item, index) => (
        //Podemos añadir más items en la lista si tenemos más inputs en el formulario
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680"
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewRestaurantTitle: {
    margin: 15
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold"
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "grey"
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1
  }
})