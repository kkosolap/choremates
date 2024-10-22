// App.js

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

import Signin from './screens/Signin';
import Register from './screens/Register';
import { API_URL } from '@env';
import colors from './style/colors';
import styles from './style/styles';
import HomeScreen from './tabs/Home';
import ChoresScreen from './tabs/Chores';
import MembersScreen from './tabs/Members';
import SettingsScreen from './tabs/Settings';
import NewChoreScreen from './screens/NewChore';


/************************************************************ */
/* CHANGE THE API URL BELOW TO YOUR COMPUTER'S IP ADDRESS!!!  */
/************************************************************ */
// API_URL moved to .env  -MH


/************************************************************ */
/*                            TABS                            */
/************************************************************ */
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ---------- HOME ----------
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="NewChore" component={NewChoreScreen} />
    </Stack.Navigator>
  );
};

// ---------- CHORES ----------
const ChoresStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChoresMain" component={ChoresScreen} />
    </Stack.Navigator>
  );
};

// ---------- MEMBERS ----------
const MembersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MembersMain" component={MembersScreen} />
    </Stack.Navigator>
  );
};

// ---------- SETTINGS ----------
const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
    </Stack.Navigator>
  );
};




/************************************************************ */
/*                     MAIN APP FUNCTION                      */
/************************************************************ */
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      setIsLoggedIn(!!token); // Check if token exists
    };
    checkToken();
  }, []);

  const handleSignin = (username, password) => {
    console.log('Logging in with:', username, password);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token'); // Remove token securely
    setIsLoggedIn(false); // Update logged-in state
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Chores') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Members') {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              // Apply box styling if the tab is focused (selected)
              const boxStyle = focused ? styles.focusedBox : null;

              return (
                <View style={[styles.iconContainer, boxStyle]}>
                  <Icon name={iconName} size={focused ? 32 : 28} color={color} />
                </View>
              );
            },
            tabBarLabel: () => null, // Hide labels
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.gray,
            tabBarStyle: {
              position: 'absolute',
              bottom: 15,
              left: 10,
              right: 10,
              borderRadius: 15,
              height: 65,
            },
            tabBarIconStyle: {
              marginBottom: 0,
            },
            headerShown: false,
          })}>
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Chores" component={ChoresStack} />
          <Tab.Screen name="Members" component={MembersStack} />
          <Tab.Screen name="Settings">
            {(props) => <SettingsScreen {...props} onLogout={handleLogout} />} 
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Sign in" options={{ headerShown: false }}>
            {(props) => <Signin {...props} onSignin={handleSignin} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
