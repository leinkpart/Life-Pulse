import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeDrawer from './homeDrawers'; 
import HomeTab from './homeTabs';
import Reminder from '../src/reminder/Reminder';
import AddRemind from '../src/reminder/AddRemind';
import EditRemind from '../src/reminder/EditRemind';
import Repeat from '../src/reminder/Repeat';
import Cycling from '../src/activities/Cycling';
import Walking from '../src/activities/Walking';
import NewPost from '../component/NewPost';

const Stack = createStackNavigator();

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
    </Stack.Navigator>
  );
};

export default HomeStack;
