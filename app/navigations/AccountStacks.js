import { createStackNavigator } from "react-navigation-stack";
import AccountScreen from "../screens/Account/MyAccount";
import LoginScreen from "../screens/Account/Login";
import RegisterScreen from "../screens/Account/Register";

const AccountsScreenStacks = createStackNavigator({
  Account: {
    screen: AccountScreen,
    navigationOptions: () => ({
      title: "My Account"
    })
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: () => {
      title: "Login";
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: () => {
      title: "Register";
    }
  }
});

export default AccountsScreenStacks;
