import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons';

import HomeTabs from './homeTabs';
import Profile from '../src/user/Profile';
import CustomDrawer from '../component/CustomDrawer';

const Drawer = createDrawerNavigator();

const HomeDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      drawerPosition: 'left',
      drawerType: 'slide',
      drawerStyle: {
        width: '80%',
      },
      drawerActiveTintColor: '#e0dfdc',
      drawerInactiveTintColor: '#e0dfdc',
      drawerLabelStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: -10,
      },
      drawerItemStyle: {
        borderRadius: 15,
        marginVertical: 5,
      },
      drawerActiveBackgroundColor: '#2a2a2a',
      drawerInactiveBackgroundColor: 'transparent',
    }}
  >
    <Drawer.Screen
      name="HomeDrawer"
      component={HomeTabs}
      options={{
        headerShown: false,
        drawerIcon: ({ color }) => (
          <View style={[styles.iconContainer, styles.squareBackground]}>
            <Icon name="home-outline" color={color} size={24} />
          </View>
        ),
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={Profile}
      options={{
        headerShown: true,
        drawerIcon: ({ color }) => (
          <View style={[styles.iconContainer, styles.squareBackground]}>
            <FontAwesome5 name="user" color={color} size={24} />
          </View>
        ),
      }}
    />
  </Drawer.Navigator>
);

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  squareBackground: {
    height: 48,
    width: 48,
    backgroundColor: '#4e4e4e',
    borderRadius: 15,
  },
});

export default HomeDrawer;
