import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validation";
import * as firebase from "firebase";
import Loading from "../Loading";
import { withNavigation } from "react-navigation";

function Login(props) {
  const { toastReft, navigation } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);

  const login = async () => {
    setIsVisibleLoading(true);

    if (!email || !password) {
      toastReft.current.show("Todos los campos son obligatorios");
    } else {
      if (!validateEmail(email)) {
        toastReft.current.show("El email es incorrecto.");
      } else {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            navigation.navigate("Account");
          })
          .catch(() => {
            toastReft.current.show("Email o contraseña incorrecta");
          });
      }
    }
    setIsVisibleLoading(false);
  };

  return (
    <View>
      <Input
        placeholder="Email"
        containerStyle={styles.InputForm}
        onChange={e => setEmail(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Password"
        containerStyle={styles.InputForm}
        password={true}
        secureTextEntry={hidePassword}
        onChange={p => setPassword(p.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            onPress={() => setHidePassword(!hidePassword)}
            iconStyle={styles.iconRight}
          />
        }
      />
      <Button
        title="Login"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={login}
      />
      <Loading text="Iniciando cuenta" isVisible={isVisibleLoading} />
    </View>
  );
}

export default withNavigation(Login);

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  InputForm: {
    width: "100%",
    marginTop: 20
  },
  iconRight: {
    color: "#c1c1c1"
  },
  btnContainerLogin: {
    marginTop: 20,
    width: "95%"
  },
  btnLogin: {
    backgroundColor: "#00a680"
  }
});
