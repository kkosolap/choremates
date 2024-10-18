// App.js

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
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
// UCSC-Guest -MH
const API_URL = "http://169.233.124.217:3000/";


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
export default function App() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState({});   // tracks which chores are visible -KK
  const [edit, setEdit] = useState(null);       // tracks which chores are being edited -KK
  const [newTask, setNewTask] = useState('');   // contains the text for the new task -KK

  // group the tasks by chore -KK
  const groupedTasks = data.reduce((acc, task) => {
    if (!acc[task.chore]) {
      acc[task.chore] = [];
    }
    acc[task.chore].push({ id: task.id, task: task.task });
    return acc;
  }, {});

  // toggle the visibility for the chore -KK
  const toggleVisibility = (chore) => {
    setVisible((prevState) => ({
      ...prevState,
      [chore]: !prevState[chore],
    }));
  };

  // add task button -KK
  const addTask = (chore) => {
    axios.post(`${API_URL}add_task?chore_name=${chore}`, {
      task_name: newTask,
      user_id: 1,           // adjust later to the logged-in user -KK
    })
    .then((response) => {
      console.log(response.data);
      setNewTask('');       // reset the input -KK
      refreshTasks();       // refresh ltask list after updating -KK
    })
    .catch((error) => console.error(error));
  };

  // delete task button -KK
  const deleteTask = (chore, task) => {
    axios.delete(`${API_URL}delete_task?chore_name=${chore}&task_name=${task}`)
      .then((response) => {
        console.log(response.data);
        refreshTasks();     // refresh ltask list after updating -KK
      })
      .catch((error) => console.error(error));
  };

  // fetch the task list for display -KK
  const refreshTasks = () => {
    axios.get(API_URL + "get_tasks?user_id=1")
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  };
  
  // gets called when the component loads
  useEffect(() => {
    refreshTasks();
  }, []);

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
        <Tab.Screen name="Members" component={MembersStack} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
