import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import SignUp from '../App/Screens/SignUpScreen';
import Login from '../App/Screens/LoginScreen';
import Dashboard from '../App/Screens/DashboardScreen';
import Chat from '../App/Screens/ChatScreen';

const AuthStack = createStackNavigator({
    Login: Login,
    SignUp: SignUp,
}, {
    headerMode: 'none', initialRouteName: 'Login'
});

const DashboardStack = createStackNavigator({
    Dashboard: Dashboard,
    Chat:Chat
}, {
    initialRouteName: 'Dashboard', headerMode: 'none'
});

const App = createSwitchNavigator({
    Auth: AuthStack,
    Dashboard: DashboardStack
},
    { initialRouteName: 'Auth' }
);


export default createAppContainer(App);