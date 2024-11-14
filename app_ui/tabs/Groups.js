// Groups.js

import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Popover from 'react-native-popover-view';

import * as SecureStore from 'expo-secure-store';

import { useTheme } from '../style/ThemeProvider.js';
import createStyles from '../style/styles.js';
import { TabHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config.js';
import colors from '../style/colors';


// groups screen & invite button - NN
const GroupsScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [hasInvitations, setHasInvitations] = useState(false);
  const navigation = useNavigation();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getUsername = async () => {   // get the username from securestore -KK
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.error("UI Member.js: Username not found in SecureStore.");
      }
    };
    getUsername();
  }, []);

  // if invitation received, button turns red -NN
  useFocusEffect(
    React.useCallback(() => {
      const fetchPendingInvitations = async () => {
        if (!username) return;
        try {
          const response = await axios.get(`${API_URL}get-received-invite`, {
            params: { username: username }
          });
          setHasInvitations(response.data.length > 0);
        } catch (error) {
          console.error("Error fetching pending invitations:", error);
        }
      };

      fetchPendingInvitations();
    }, [username])
  )
  const handleMailPress = () => {
    navigation.navigate('GroupInvitations', { username });
  };
  

  return (
    <View style={styles.screen}>
      <TabHeader title="Groups" />
      <TouchableOpacity // invite button red when received invitation -NN
        onPress={handleMailPress}
        style={[
          styles.mailButton,
          hasInvitations && { backgroundColor: theme.red }
        ]}
      >
      <Icon name="mail" size={25} color="#fff" />
      </TouchableOpacity>

        <GroupsDisplay />

    </View>
  );
};

// // show all groups and create group button -NN
// const GroupsDisplay = ({ groupId }) => {
//   const { theme } = useTheme();
//   const styles = createStyles(theme);
//   const navigation = useNavigation();
//   const [username, setUsername] = useState(null);
//   const [groups, setGroups] = useState([]);
//   const [popoverVisible, setPopoverVisible] = useState(false);
//   const popoverButtonRef = useRef(null);

//   useEffect(() => {
//     const getUsername = async () => {
//       const storedUsername = await SecureStore.getItemAsync('username');
//       if (storedUsername) {
//         setUsername(storedUsername);
//         fetchGroups(storedUsername); // call fetch group -NN
//       } else {
//         console.error("GroupsDisplay: Username not found in SecureStore.");
//       }
//     };

//     //get all groups the user is a part of -NN
//     const fetchGroups = async (username) => {
//       try {
//         const response = await axios.post(`${API_URL}get-all-groups-for-user`, {
//           username: username,
//         });
//         console.log("Group response:", response.data);
//         setGroups(response.data);
//       } catch (error) {
//         console.error("Error fetching groups:", error);
//         Alert.alert("Failed to load groups.");
//       }
//     };


//     const handleOptionSelect = (option) => {
//       console.log(`Selected: ${option}`);
//       setPopoverVisible(false);
//     };

//     getUsername();
//   }, []);

//   return (
//     <FlatList
//       data={groups}
//       keyExtractor={(item) => item.group_id.toString()}
//       renderItem={({ item }) => (
//         <View style={styles.groupItem}>
//           <TouchableOpacity
//             style={styles.groupItemTouchable}
//             onPress={() => navigation.navigate('Members', { 
//               groupName: item.group_name, 
//               groupId: item.group_id 
//             })}
//           >
//             <Text style={styles.groupName}>{item.group_name}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={(event) => {
//               event.stopPropagation(); // Prevent navigation
//               setPopoverVisible(true);
//             }}
//             style={styles.groupColorPicker}
//           >
//             <Icon name="ellipsis-vertical" size={24} color="#000" />
//           </TouchableOpacity>

//           {/* Popover Menu */}
//           {/* I think it currently works for last group rendered
//           if method not worked out, maybe adding a dropdown to pick the group and color ?    -VA  */}
//           <Popover
//             isVisible={popoverVisible}
//             onRequestClose={() => setPopoverVisible(false)}
//             from={() => popoverButtonRef.current}
//             popoverStyle={styles.popover}
//           >
//             <View style={styles.menuContainer}>
//               <Text style={styles.groupName}>Change Group Color </Text>

//               <View style={styles.iconGrid}>
//                 {[...Array(8).keys()].map((_, index) => {
//                   // Ensure that the color is correctly assigned from theme
//                   const iconColors = [
//                     colors.blue.main,    // Blue
//                     colors.green.main,   // Green
//                     colors.pink.main,    // Pink
//                     colors.yellow.main,  // Yellow
//                     colors.purple.main,  // Purple
//                     '#A1A1A1',      // Placeholder colors
//                     '#A1A1A1',      
//                     '#A1A1A1',      
//                   ];

//                   const iconColor = iconColors[index];

//                   return (
//                     <TouchableOpacity
//                       key={index}
//                       onPress={() => handleOptionSelect(`Option ${index + 1}`)}
//                       style={styles.menuItem}
//                     >
//                       <Icon name="brush" size={24} color={iconColor} style={styles.groupColorIcon} />
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>


//             </View>
//           </Popover>
//         </View>
//   )}
//   contentContainerStyle={{ paddingBottom: 20 }}
// />


//   );
// };

const GroupsDisplay = ({ groupId }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const [username, setUsername] = useState(null);
  const [groups, setGroups] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const popoverButtonRef = useRef(null);

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
        fetchGroups(storedUsername);
        fetchUserData();
      } else {
        console.error("GroupsDisplay: Username not found in SecureStore.");
      }
    };

    const fetchGroups = async (username) => {
      try {
        const response = await axios.post(`${API_URL}get-all-groups-for-user`, {
          username: username,
        });
        console.log("Group response:", response.data);
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        Alert.alert("Failed to load groups.");
      }
    };

    getUsername();
  }, []);

  // Function to handle color change
  const handleColorChange = (color) => {
    if (selectedGroup) {
      console.log(`Changing color for group: ${selectedGroup.group_name}`);
      // Logic to change the color for the selected group
      // For example, you can update the group color in the backend here
    }
    setPopoverVisible(false);
  };

  // Handle the ellipsis button press
  const handleEllipsisPress = (group, event) => {
    event.stopPropagation(); // Prevents triggering navigation
    setSelectedGroup(group);
    setPopoverVisible(true);
    console.log(`Ellipsis pressed for group: ${group.group_name}`);
  };
  const fetchUserData = async () => {
    console.log('fetchUserData entered')
    try {
      const token = await SecureStore.getItemAsync('token');
      const storedUsername = await SecureStore.getItemAsync('username');

      if (token && storedUsername) {
        console.log('token and user');
        // Fetch user_id from the backend using the stored username
        const response = await fetch(`${API_URL}get-user-id?username=${storedUsername}`);
        console.log('returned');
        
        // Log the actual response content
        const data = await response.json();
        console.log('Response data:', data);
        

        if (data.success) {
          setUserId(data.user_id);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.group_id.toString()}
      renderItem={({ item }) => (
        <View style={styles.groupItem}>
          {/* Group Item */}
          <TouchableOpacity
            style={styles.groupItemTouchable}
            onPress={() =>
              navigation.navigate('Members', {
                groupName: item.group_name,
                groupId: item.group_id,
              })
            }
          >
            <Text style={styles.groupName}>{item.group_name}</Text>
          </TouchableOpacity>

          {/* Ellipsis Button */}
          <TouchableOpacity
            onPress={(event) => handleEllipsisPress(item, event)}
            style={styles.groupColorPicker}
          >
            <Icon name="ellipsis-vertical" size={24} color="#000" />
          </TouchableOpacity>

          {/* Popover Menu */}
          {selectedGroup && selectedGroup.group_id === item.group_id && (
            <Popover
              isVisible={popoverVisible}
              onRequestClose={() => setPopoverVisible(false)}
              from={() => popoverButtonRef.current}
              popoverStyle={styles.popover}
            >
              <View style={styles.menuContainer}>
                <Text style={styles.groupName}>Change Group Color</Text>
                <View style={styles.iconGrid}>
                  {[...Array(8).keys()].map((_, index) => {
                    const iconColors = [
                      colors.blue.main,
                      colors.green.main,
                      colors.pink.main,
                      colors.yellow.main,
                      colors.purple.main,
                      '#A1A1A1',
                      '#A1A1A1',
                      '#A1A1A1',
                    ];

                    const iconColor = iconColors[index];

                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleColorChange(iconColor)}
                        style={styles.menuItem}
                      >
                        <Icon name="brush" size={24} color={iconColor} style={styles.groupColorIcon} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Popover>
          )}
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};


export default GroupsScreen;
