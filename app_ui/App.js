// App.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from './colors';

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

const HomeScreen = () => (
  <View style={styles.screen}>
    <Text>Home Screen</Text>
  </View>
);

const ChoresScreen = () => (
  <View style={styles.screen}>
    <Text>Chores Screen</Text>
  </View>
);

const MembersScreen = () => (
  <View style={styles.screen}>
    <Text>Members Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.screen}>
    <Text>Settings Screen</Text>
  </View>
);

/************************************************************ */
/*                     MAIN APP FUNCTION                      */
/************************************************************ */
export default function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get(API_URL + "home") // fetches the data at the address
      .then((response) => {
        console.log("Fetched data:", response.data); // Add this to check the response
        setData(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  // All the code for what gets displayed on the screen
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

            // Apply box styling if the tab is focused (selected)
            const boxStyle = focused ? styles.focusedBox : null;

            return (
              <View style={[styles.iconContainer, boxStyle]}>
                <Icon name={iconName} size={focused? 32 : 28} color={color} />
              </View>
            );
          },
          tabBarLabel: () => null, // Prevent the labels from showing
          tabBarActiveTintColor: colors.white,
          tabBarInactiveTintColor: colors.gray,
          tabBarStyle: {
            position: 'absolute',
            bottom: 15,
            left: 10,
            right: 10,
            borderRadius: 15,
            height: 65
          },
          tabBarIconStyle: {
            marginBottom: 0
          }
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chores" component={ChoresScreen} />
        <Tab.Screen name="Members" component={MembersScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/********************************************************** */
/*                      CSS AESTHETICS                      */
/********************************************************** */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
  },
  text: {
    color: '#fff',
    marginTop: 20,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedBox: {
    borderWidth: 2,
    borderColor: colors.blue,
    backgroundColor: colors.blue,
    borderRadius: 10,
    padding: 5,
  },
});
