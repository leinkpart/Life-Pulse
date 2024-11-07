import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {Modal, Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from './component/theme';

import Login from './src/Login_Register/Login';
import Register from './src/Login_Register/Register';
import Home from './src/home/Home';
import Setting from './src/setting/Setting';
import Reminder from './src/reminder/Reminder';
import AddRemind from './src/reminder/AddRemind';

const Stack = createStackNavigator(); 
const Tab = createBottomTabNavigator();

import Icon from 'react-native-vector-icons/Ionicons';
import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingIcon from 'react-native-vector-icons/MaterialIcons';
import Repeat from './src/reminder/Repeat';
import EditRemind from './src/reminder/EditRemind';
import Cycling from './src/activities/Cycling';
import Walking from './src/activities/Walking';

const TabNavigation = () => {
  return(
    <Tab.Navigator>
      <Tab.Screen
        name="Main"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <HomeIcon name="home" size={30} color={focused ? '#4F75FF' : '#697565'} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 14, color: focused ? '#4F75FF' : '#697565' }}>Home</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <SettingIcon name="settings" size={28} color={focused ? '#4F75FF' : '#697565'} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 14, color: focused ? '#4F75FF' : '#697565' }}>Setting</Text>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const App = () => {
  return (
    <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Register" component={Register}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Home" component={TabNavigation} 
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen name="Reminder" component={Reminder} 
          options={{
            headerShown: true,
          }}
        />

        <Stack.Screen name="AddRemind" component={AddRemind} 
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen name="EditRemind" component={EditRemind} 
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen name="Repeat" component={Repeat} 
          options={{
            headerShown: true,
            presentation: 'modal'
          }}
        />

        <Stack.Screen name="Cycling" component={Cycling} 
          options={{
            headerShown: true,
            presentation: 'modal'
          }}
        />

        <Stack.Screen name="Walking" component={Walking} 
          options={{
            headerShown: true,
            presentation: 'modal'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
