import React, { useState, Component } from "react";
import { View, Alert } from "react-native";
import { SocialIcon } from "react-native-elements";
import * as Facebook from "expo-facebook";
import * as firebase from "firebase";
import { FacebookApi } from "../../utils/Social";
import Loading from "../Loading";

//TODO fix credential error
export default function LoginFacebook(props) {
  const { toastReft, navigation } = props;
  const [isLoading, setIsLoading] = useState(false);

  async function logIn() {
    try {
      await Facebook.initializeAsync(FacebookApi.application_id);
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile"],
      });
      if (type === "success") {
        setIsLoading(true);
        console.log(token);
        // Get the user's name using Facebook's Graph API
        const credentials = await fetch(
          `https://graph.facebook.com/me?access_token=${credentials}`
        );

        await firebase
          .auth()
          .signInWithCredential(credentials)
          .then(() => {
            navigation.navigate("Account");
          })
          .catch(() => {
            toastReft.current.show(
              "Error accediendo a facebook, Error desconocido, intentelo más tarde"
            );
          });
      } else if (type === "cancel") {
        toastReft.current.show(
          "Inicio de sesión cancelada, Error desconocido, intentelo más tarde"
        );
      } else {
        toastReft.current.show("Error desconocido, intentelo más tarde");
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
    setIsLoading(false);
  }

  return (
    <>
      <SocialIcon
        title="Iniciar Sesión con Facebook"
        button
        type="facebook"
        onPress={logIn}
      />
      <Loading isVisible={isLoading} text="Iniciando sesión" />
    </>
  );
}
