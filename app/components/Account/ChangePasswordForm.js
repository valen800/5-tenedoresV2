import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { reauthenticate } from "../../utils/Api";

export default function ChangePasswordForm(props) {
  const { setIsVisibleModal, toastRef } = props;
  const [password, setPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [newPasswordRepeat, setnewPasswordRepeat] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [hidePassword, sethidePassword] = useState(true);
  const [hideNewPassword, sethideNewPassword] = useState(true);
  const [hideNewPasswordRepeat, sethideNewPassowrdRepeat] = useState(true);

  const updatePassword = () => {
    setError({});

    if (!password || !newPassword || !newPasswordRepeat) {
      let objError = {};
      !password && (objError.password = "No puede estar vacio.");
      !newPassword && (objError.newPassword = "No puede estar vacio.");
      !newPasswordRepeat &&
        (objError.newPasswordRepeat = "No puede estar vacio.");

      setError(objError);
    } else {
      if (newPassword !== newPasswordRepeat) {
        setError({
          newPassword: "Las nuevas contraseñas tienen que ser iguales",
          newPasswordRepeat: "Las nuevas contraseñas tienen que ser iguales",
        });
      } else {
        setIsLoading(true);
        reauthenticate(password)
          .then(() => {
            firebase
              .auth()
              .currentUser.updatePassword(newPassword)
              .then(() => {
                setIsLoading(false);
                toastRef.current.show("Contraseña actualiza correctamente");
                setIsVisibleModal(false);
                firebase.auth().signOut();
              })
              .catch(() => {
                setError({ general: "Error al actualizar la contraseña." });
                setIsLoading(false);
              });
          })
          .catch(() => {
            setError({ password: "La contraseña no es correcta" });
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Contraseña actual"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hidePassword}
        onChange={(e) => setPassword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => sethidePassword(!hidePassword),
        }}
        errorMessage={error.password}
      />
      <Input
        placeholder="Nueva Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hideNewPassword}
        onChange={(e) => setnewPassword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => sethideNewPassword(!hideNewPassword),
        }}
        errorMessage={error.newPassword}
      />
      <Input
        placeholder="Repetir nueva contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hideNewPasswordRepeat}
        onChange={(e) => setnewPasswordRepeat(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPasswordRepeat ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => sethideNewPassowrdRepeat(!hideNewPasswordRepeat),
        }}
        errorMessage={error.newPasswordRepeat}
      />
      <Button
        title="Cambiar contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={updatePassword}
        loading={isLoading}
      />
      <Text>{error.general}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
