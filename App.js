// import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import {Modal, Text, View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from './component/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from'react-native-gesture-handler';

import Login from './src/auth/Login';
import Register from './src/auth/Register';
import Home from './src/bottomTabs/Home';
import Setting from './src/setting/Setting';
import Reminder from './src/reminder/Reminder';
import AddRemind from './src/reminder/AddRemind';
import Repeat from './src/reminder/Repeat';
import EditRemind from './src/reminder/EditRemind';
import Cycling from './src/activities/Cycling';
import Walking from './src/activities/Walking';
import Post from './src/bottomTabs/Article';
import NewPost from './component/NewPost';
import Profile from './src/user/Profile';

const Stack = createStackNavigator(); 
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// import Icon from 'react-native-vector-icons/Ionicons';
import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingIcon from 'react-native-vector-icons/MaterialIcons';
import { Entypo } from '@expo/vector-icons'

const BottomTabs = () => {
  return(
    <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: true,
      tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
        borderRadius: 15,
        height: 55,
        elevation: 10,
        width: '100%',
        paddingBottom: 1
      },
      tabBarLabelStyle: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: '900',
      },
      tabBarIconStyle: {
        marginBottom: -8,
      },
    }}
    >
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
        name="Post"
        component={Post}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo name="news" size={26} color={focused ? '#4F75FF' : '#697565'} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 14, color: focused ? '#4F75FF' : '#697565' }}>Posts</Text>
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

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Reminder" component={Reminder} />
      <Stack.Screen name="AddRemind" component={AddRemind} options={{ headerShown: false }} />
      <Stack.Screen name="EditRemind" component={EditRemind} options={{ headerShown: false }} />
      <Stack.Screen name="Repeat" component={Repeat} options={{ headerShown: true, presentation: 'modal' }} />
      <Stack.Screen name="Cycling" component={Cycling} options={{ headerShown: true, presentation: 'modal' }} />
      <Stack.Screen name="Walking" component={Walking} options={{ headerShown: true, presentation: 'modal' }} />
      <Stack.Screen name="NewPost" component={NewPost} options={{ headerShown: true, presentation: 'modal' }} />
      <Stack.Screen name="userProfile" component={MainDrawer} />
    </Stack.Navigator>
  );
};

// Drawer setup for Profile
const MainDrawer = () => (
  <Drawer.Navigator
  screenOptions={{
    drawerPosition: 'left',
    drawerType: 'slide',
    headerShown: false,
    drawerStyle: {
      width: '70%',
    },
  }}
  >
    <Drawer.Screen name="Home" component={BottomTabs} options={{ headerShown: false }} />
    {/* <Drawer.Screen name="Profile" component={Profile} options={{headerShown: false}} /> */}
  </Drawer.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('userSession');
      if (value !== null) {
        setIsLoggedIn(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F75FF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {isLoggedIn ? (
              <Stack.Screen name="Main" component={MainStack} options={{ headerShown: false }} />
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
