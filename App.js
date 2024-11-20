import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './component/theme';
import { Text } from 'react-native';


//Icon
import { Entypo, FontAwesome5, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

//Navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

//Authentication
import Login from './src/auth/Login';
import Register from './src/auth/Register';

//homeTabs
import Home from './src/bottomTabs/Home';
import Post from './src/bottomTabs/Article';
import Setting from './src/setting/Setting';
import Profile from './src/user/Profile';

//homeStacks
import Reminder from './src/reminder/Reminder';
import AddRemind from './src/reminder/AddRemind';
import EditRemind from './src/reminder/EditRemind';
import Repeat from './src/reminder/Repeat';
import Cycling from './src/activities/Cycling';
import Walking from './src/activities/Walking';
import NewPost from './component/NewPost';
import PersonalInfo from './src/user/PersonalInfo';
import ChangePassword from './src/user/ChangePassword';
import EditInfor from './src/user/EditInfor';

//Const Navigation
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//Phần của HomeTabs
const HomeTab = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: true,
      tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#1A1A1D',
        borderRadius: 15,
        height: 55,
        elevation: 10,
        width: '100%',
        paddingBottom: 1,
      },
      tabBarLabelStyle: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: '900',
      },
      tabBarIconStyle: {
        marginBottom: -2,
      },
    }}
  >
    <Tab.Screen
      name="Main"
      component={Home}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Feather name="home" size={26} color={focused ? '#4F75FF' : '#697565'} />
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
          <MaterialCommunityIcons name="text-box-outline" size={28} color={focused ? '#4F75FF' : '#697565'} />
        ),
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontSize: 14, color: focused ? '#4F75FF' : '#697565' }}>Posts</Text>
        ),
      }}
    />

    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1A1A1D', // Màu nền header
        },
        headerTintColor: '#fff',
        tabBarIcon: ({ focused }) => (
          <FontAwesome5 name="user" size={24} color={focused ? '#4F75FF' : '#697565'} />
        ),
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontSize: 14, color: focused ? '#4F75FF' : '#697565' }}>Profile</Text>
        ),
      }}
    />
    <Tab.Screen
      name="Setting"
      component={Setting}
      options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1A1A1D', // Màu nền header
        },
        headerTintColor: '#fff',
        tabBarIcon: ({ focused }) => (
          <Ionicons name="settings-outline" size={26} color={focused ? '#4F75FF' : '#697565'} />
        ),
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontSize: 14, color: focused ? '#4F75FF' : '#697565' }}>Setting</Text>
        ),
      }}
    />
  </Tab.Navigator>
);

//Phần homeStack
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeTab} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Reminder" 
        component={Reminder}
        options={{
          headerStyle: {
            backgroundColor: '#1A1A1D', // Màu nền header
          },
          headerTintColor: '#fff', // Màu chữ của title trên header
        }}
      />
      <Stack.Screen 
        name="AddRemind" 
        component={AddRemind} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EditRemind" 
        component={EditRemind} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Repeat" 
        component={Repeat} 
        options={{
          headerStyle: {
            backgroundColor: '#1A1A1D', // Màu nền header
          },
          headerTintColor: '#fff', // Màu chữ
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="Cycling" 
        component={Cycling} 
        options={{
          headerStyle: {
            backgroundColor: '#03A9F4', // Màu nền header
          },
          headerTintColor: '#fff', // Màu chữ
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="Walking" 
        component={Walking} 
        options={{
          headerStyle: {
            backgroundColor: '#E91E63', // Màu nền header
          },
          headerTintColor: '#fff', // Màu chữ
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="NewPost" 
        component={NewPost} 
        options={{
          headerStyle: {
            backgroundColor: '#9C27B0', // Màu nền header
          },
          headerTintColor: '#fff', // Màu chữ
          presentation: 'modal'
        }} 
      />

      <Stack.Screen 
        name="Personal Information" 
        component={PersonalInfo}
        options={{
          headerStyle: {
            backgroundColor: '#1A1A1D', // Màu nền header
          },
          headerTintColor: '#fff',
          presentation: 'modal'
        }}
      />

      <Stack.Screen 
        name="Change Password" 
        component={ChangePassword}
        options={{
          headerStyle: {
            backgroundColor: '#1A1A1D', // Màu nền header
          },
          headerTintColor: '#fff',
          presentation: 'modal'
        }}
      />

      <Stack.Screen 
        name="Edit Information" 
        component={EditInfor}
        options={{
          headerStyle: {
            backgroundColor: '#1A1A1D',
          },
          headerTintColor: '#fff',
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
};


const App = () => {
  const [isLogin, setIsLogin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loginStatus = await AsyncStorage.getItem('supabaseSession');
        setIsLogin(loginStatus === 'true'); // true nếu đã đăng nhập
      } catch (e) {
        console.error('Failed to check login status:', e);
      } finally {
        setIsLoading(false); // Hoàn tất kiểm tra
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' }}>
        <ActivityIndicator size="mid" color="#f1f1f1" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
            <Stack.Navigator>
            
              <Stack.Screen name="HomeStack" component={HomeStack} 
                options={{ 
                  headerShown: false, 
                  gestureEnabled: false, // Tắt gesture quay lại 
                }} 
              /> 
            
              <>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
              </>
            
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
