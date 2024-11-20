import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Entypo, FontAwesome5, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Home from '../src/bottomTabs/Home';
import Post from '../src/bottomTabs/Article';
import Setting from '../src/setting/Setting';
import Profile from '../src/user/Profile';

const Tab = createBottomTabNavigator();

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

    {/* <Tab.Screen
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
    /> */}
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

export default HomeTab;
