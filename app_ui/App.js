// App.js

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

import { ThemeProvider, useTheme } from './contexts/ThemeProvider';
import { GroupThemeProvider } from './contexts/GroupThemeProvider';
// import { UserProvider } from './contexts/UserContext.js';
import { LogoutProvider } from './contexts/LogOutProvider';
import createStyles from './style/styles';

import HomeScreen from './tabs/Home';
import ChoresScreen from './tabs/Chores';
import GroupsScreen from './tabs/Groups';
import SettingsScreen from './tabs/Settings';

import Signin from './screens/Signin';
import Register from './screens/Register';

import NewChoreScreen from './screens/NewChore';
import ChoreDetailsScreen from './screens/ChoreDetails';

import GroupInvitations from './screens/GroupInvitations';
import ManageScreen from './screens/ManageGroup';
import CreateGroupScreen from './screens/CreateGroup.js';
import MembersScreen from './screens/Members.js';
import InviteMemberScreen from './screens/InviteMember.js';

import ChangeProfilePicScreen from './screens/NewProfilePicture';




/************************************************************ */
/* CHANGE THE API URL BELOW TO YOUR COMPUTER'S IP ADDRESS!!!  */
/************************************************************ */
// Put this in .env, replace youripv4 with your ip address -EL
// API_URL=http://youripv4:3000/


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
      <Stack.Screen name="ChoreDetails" component={ChoreDetailsScreen} />
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

// ---------- GROUPS ----------
const GroupsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GroupsMain" component={GroupsScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="InviteMember" component={InviteMemberScreen} />
      <Stack.Screen name="ManageGroup" component={ManageScreen} />
      <Stack.Screen name="GroupInvitations" component={GroupInvitations} />
      <Stack.Screen name="Members" component={MembersScreen} />
    </Stack.Navigator>
  );
};

// ---------- SETTINGS ----------
const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="ChangeProfilePic" component={ChangeProfilePicScreen} />
    </Stack.Navigator>
  );
};


/************************************************************ */
/*                     MAIN APP FUNCTION                      */
/************************************************************ */
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      const user = await SecureStore.getItemAsync('username');
      setIsLoggedIn(!!token); // Check if token exists
      setUsername(user);
    };
    checkToken();
  }, []);

  const handleSignin = (username) => {
    console.log('Logging in as:', username);
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token'); // Remove token securely
    await SecureStore.deleteItemAsync('username'); 
    setIsLoggedIn(false); // Update logged-in state
  };

  return (
    //<UserProvider>
      <ThemeProvider username={username}>
      <GroupThemeProvider username={username}>
      <LogoutProvider handleLogout={handleLogout}>

          <NavigationContainer>
            <AppContent isLoggedIn={isLoggedIn} handleSignin={handleSignin} />
          </NavigationContainer>

      </LogoutProvider>
      </GroupThemeProvider>
      </ThemeProvider>
    //</UserProvider>

  );
};

// AppContent component to handle logged-in and logged-out states
const AppContent = ({ isLoggedIn, handleSignin }) => {
  const { theme } = useTheme(); // Get the theme inside the provider
  const styles = createStyles(theme);

  return (
    // Will only display if user is logged in
    <>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Chores') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Groups') {
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
            tabBarActiveTintColor: theme.white,
            tabBarInactiveTintColor: theme.gray,
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
          <Tab.Screen name="Groups" component={GroupsStack} />
          <Tab.Screen name="Settings" component={SettingsStack} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Sign in" options={{ headerShown: false }}>
            {(props) => <Signin {...props} onSignin={handleSignin} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default App;