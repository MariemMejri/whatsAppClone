import { View, Text } from 'react-native'
import React from 'react'
import Auth from './screens/Auth';
import NewUser from './screens/NewUser';
import Chat from './screens/Chat';
import GroupChat from './screens/GroupChat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="NewUser" component={NewUser} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="GroupChat" component={GroupChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}