// App.js

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

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
// UCSC-Guest
//const API_URL = "http://169.233.124.217:3000/";
// Home
const API_URL = "http://10.0.0.172:3000/";


/************************************************************ */
/*                            TABS                            */
/************************************************************ */
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom header for main TABS (Home, Chores, etc)
export const TabHeader = ({ title }) => {
  return (
    <View style={styles.tabHeader}>
      <Text style={styles.tabTitle}>{title}</Text>
    </View>
  );
};

// Custom header for screens (Add Chore, etc)
export const ScreenHeader = ({ title, navigation }) => {
  return (
    <View style={styles.screenHeader}>
      {/* GoBack button */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => navigation.goBack()}
      >
        <Text><Icon name="arrow-back" size={35} color={colors.darkestBlue} /></Text>
      </TouchableOpacity>
      
      {/* Title */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

// ---------- HOME ----------
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NewChore" component={NewChoreScreen} />
    </Stack.Navigator>
  );
};

// ---------- CHORES ----------
const ChoresStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chores" component={ChoresScreen} />
    </Stack.Navigator>
  );
};

// ---------- MEMBERS ----------
const MembersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Members" component={MembersScreen} />
    </Stack.Navigator>
  );
};

// ---------- SETTINGS ----------
const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};


/************************************************************ */
/*                     MAIN APP FUNCTION                      */
/************************************************************ */
export default function App() {
  const [data, setData] = useState('');

  // example function setup by Kat - not currently used in this project
  useEffect(() => {
    axios.get(API_URL + "home") // fetches the data at the address
      .then((response) => {
        console.log("Fetched data:", response.data);
        setData(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  // ------- code for what gets displayed on the screen -------
  return (
    <NavigationContainer>
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

            // apply box styling if the tab is focused (selected)
            const boxStyle = focused ? styles.focusedBox : null;

            return (
              <View style={[styles.iconContainer, boxStyle]}>
                <Icon name={iconName} size={focused ? 32 : 28} color={color} />
              </View>
            );
          },
          tabBarLabel: () => null, // hide labels
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
        <Tab.Screen name="Members" component={MembersScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
