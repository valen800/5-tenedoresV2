import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validation";
import * as firebase from "firebase";
import Loading from "../Loading";
import { withNavigation } from "react-navigation";

function RegisterForm(props) {
  const { toastReft, navigation } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [ConfirmhidePassword, setConfirmHidePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);

  const register = async () => {
    setIsVisibleLoading(true);

    if (!email || !password || !confirmPassword) {
      toastReft.current.show("Todos los campos son obligatorios");
    } else {
      if (!validateEmail(email)) {
        toastReft.current.show("El email es incorrecto.");
      } else {
        if (password !== confirmPassword) {
          toastReft.current.show("Las contraseñas no son iguales");
        } else {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              navigation.navigate("Account");
            })
            .catch(() => {
              toastReft.current.show(
                "Error al crear la cuenta, itentelo más tarde"
              );
            });
        }
      }
    }
    setIsVisibleLoading(false);
  };

  return (
    <View style={styles.formContain} behavior="padding" enabled>
      <Input
        placeholder="Email"
        containerStyle={styles.inputForm}
        onChange={(e) => setEmail(e.nativeEvent.text)}
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
        password={true}
        secureTextEntry={hidePassword}
        containerStyle={styles.inputForm}
        onChange={(p) => setPassword(p.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />
      <Input
        placeholder="Repeat Password"
        password={true}
        secureTextEntry={ConfirmhidePassword}
        containerStyle={styles.inputForm}
        onChange={(cp) => setConfirmPassword(cp.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={ConfirmhidePassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setConfirmHidePassword(!ConfirmhidePassword)}
          />
        }
      />
      <Button
        title="Submit"
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={register}
      />
      <Loading text="Creando cuenta" isVisible={isVisibleLoading} />
    </View>
  );
}

export default withNavigation(RegisterForm);

const styles = StyleSheet.create({
  formContain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  iconRight: {
    color: "#c1c1c1",
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: "#00a680",
  },
});
