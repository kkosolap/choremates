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

// const GroupsDisplay = ({ groupId }) => {
//   const { theme } = useTheme();
//   const styles = createStyles(theme);
//   const navigation = useNavigation();
//   const [username, setUsername] = useState(null);
//   const [groups, setGroups] = useState([]);
//   const [popoverVisible, setPopoverVisible] = useState(false);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const popoverButtonRef = useRef(null);

//   useEffect(() => {
//     const getUsername = async () => {
//       const storedUsername = await SecureStore.getItemAsync('username');
//       if (storedUsername) {
//         setUsername(storedUsername);
//         fetchGroups(storedUsername);
//       } else {
//         console.error("GroupsDisplay: Username not found in SecureStore.");
//       }
//     };

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

//     getUsername();
//   }, []);

//   // Function to handle color change
//   const handleColorChange = (color) => {
//     if (selectedGroup) {
//       console.log(`Changing color for group: ${selectedGroup.group_name}:` + color);
//       // Logic to change the color for the selected group
//       // For example, you can update the group color in the backend here
//     }
//     setPopoverVisible(false);
//   };

//   // Handle the ellipsis button press
//   const handleEllipsisPress = (group, event) => {
//     event.stopPropagation(); // Prevents triggering navigation
//     setSelectedGroup(group);
//     setPopoverVisible(true);
//     console.log(`Ellipsis pressed for group: ${group.group_name}`);
//   };

//   const getUserId = async (username, groupname) => {
//     try {
      
//       // Fetch the user ID based on the username
//       const response = await axios.post(`${API_URL}get-id`, { username });
//       const userId = response.data.id;
//       // console.log("User ID:", userId); // Log the user ID
//       // console.log("Group ID:", groupname.group_id); // Log the group ID
  
//       // Check if either userId or groupId is undefined
//       if (userId === undefined || groupname.group_id === undefined) {
//         console.log(userId);
//         console.error("userId or groupId is undefined");
//         return;
//       }
  
//       // Now call /get-group-color with the fetched userId and groupId
//       const colorResponse = await axios.get(`${API_URL}get-group-color`, {
//         params: { user_id: userId, group_id: groupname.group_id },
//       });
  
//       console.log("Group Color:", colorResponse.data.group_color); // Log the group color
//     } catch (error) {
//       console.error("Error fetching user ID or group color:", error);
//     }
//   };

//   return (
//     <FlatList
//       data={groups}
//       keyExtractor={(item) => item.group_id.toString()}
//       renderItem={({ item }) => (
//         <View style={styles.groupItem} backgroundColor= {colors.blue.lightest} borderColor = {colors.blue.lighter}>
//           {/* Group Item */}
//           <TouchableOpacity
//             style={styles.groupItemTouchable}
//             onPress={() =>
//               navigation.navigate('Members', {
//                 groupName: item.group_name,
//                 groupId: item.group_id,
//               })
//             }
//           >
//             <Text style={styles.groupName}>{item.group_name}</Text>
//           </TouchableOpacity>

//           {/* Ellipsis Button */}
//           <TouchableOpacity
//             onPress={(event) => handleEllipsisPress(item, event)}
//             style={styles.groupColorPicker}
//           >
//             <Icon name="ellipsis-vertical" size={24} color="#000" />
//           </TouchableOpacity>

//           {/* Popover Menu */}
//           {selectedGroup && selectedGroup.group_id === item.group_id && (
//             <Popover
//               isVisible={popoverVisible}
//               onRequestClose={() => setPopoverVisible(false)}
//               from={() => popoverButtonRef.current}
//               popoverStyle={styles.popover}
//             >
//               <View style={styles.menuContainer}>
//                 <Text style={styles.groupName}>Change Group Color</Text>
//                 <View style={styles.iconGrid}>
//                   {[...Array(8).keys()].map((_, index) => {
//                     const iconColors = [
//                       colors.blue.main,
//                       colors.green.main,
//                       colors.pink.main,
//                       colors.yellow.main,
//                       colors.purple.main,
//                       '#A1A1A1',
//                       '#A1A1A1',
//                       '#A1A1A1',
//                     ];

//                     const iconColor = iconColors[index];

//                     return (
//                       <TouchableOpacity
//                         key={index}
//                         onPress={() => handleColorChange(iconColor)}
                        
//                         // onPress={() => getUserId(username, selectedGroup)}

//                         style={styles.menuItem}
//                       >
//                         <Icon name="brush" size={24} color={iconColor} style={styles.groupColorIcon} />
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               </View>
//             </Popover>
//           )}
//         </View>
//       )}
//       contentContainerStyle={{ paddingBottom: 20 }}
//     />
//   );
// };


// export default GroupsScreen;

// const GroupsDisplay = ({ groupId }) => {
//   const { theme } = useTheme();
//   const styles = createStyles(theme);
//   const navigation = useNavigation();
//   const [username, setUsername] = useState(null);
//   const [groups, setGroups] = useState([]);
//   const [popoverVisible, setPopoverVisible] = useState(false);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const popoverButtonRef = useRef(null);

//   useEffect(() => {
//     const getUsername = async () => {
//       const storedUsername = await SecureStore.getItemAsync('username');
//       if (storedUsername) {
//         setUsername(storedUsername);
//         fetchGroups(storedUsername);
//       } else {
//         console.error("GroupsDisplay: Username not found in SecureStore.");
//       }
//     };

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

//     getUsername();
//   }, []);

//   // Function to handle color change
//   const handleColorChange = (color) => {
//     if (selectedGroup) {
//       console.log(`Changing color for group: ${selectedGroup.group_name}:` + color);
//       // Logic to change the color for the selected group
//       // For example, you can update the group color in the backend here
//     }
//     setPopoverVisible(false);
//   };

//   // Handle the ellipsis button press
//   const handleEllipsisPress = (group, event) => {
//     event.stopPropagation(); // Prevents triggering navigation
//     setSelectedGroup(group);
//     setPopoverVisible(true);
//     console.log(`Ellipsis pressed for group: ${group.group_name}`);
//   };

//   const getUserId = async (username, groupname) => {
//     try {
//       // Fetch the user ID based on the username
//       const response = await axios.post(`${API_URL}get-id`, { username });
//       const userId = response.data.id;

//       // Check if either userId or groupId is undefined
//       if (userId === undefined || groupname.group_id === undefined) {
//         console.log(userId);
//         console.error("userId or groupId is undefined");
//         return;
//       }

//       // Now call /get-group-color with the fetched userId and groupId
//       const colorResponse = await axios.get(`${API_URL}get-group-color`, {
//         params: { user_id: userId, group_id: groupname.group_id },
//       });

//       console.log("Group Color:", colorResponse.data.group_color); // Log the group color

//       // Update the group color dynamically (You could also store this in the `groups` state)
//       return colorResponse.data.group_color;

//     } catch (error) {
//       console.error("Error fetching user ID or group color:", error);
//     }
//   };

//   return (
//     <FlatList
//       data={groups}
//       keyExtractor={(item) => item.group_id.toString()}
//       renderItem={({ item }) => {
//         const groupColor = getUserId(username, item); // Fetch group color dynamically

//         return (
//           <View
//             style={[styles.groupItem, { backgroundColor: groupColor || colors.blue.lightest, borderColor: groupColor || colors.blue.lighter }]}
//           >
//             {/* Group Item */}
//             <TouchableOpacity
//               style={styles.groupItemTouchable}
//               onPress={() =>
//                 navigation.navigate('Members', {
//                   groupName: item.group_name,
//                   groupId: item.group_id,
//                 })
//               }
//             >
//               <Text style={styles.groupName}>{item.group_name}</Text>
//             </TouchableOpacity>

//             {/* Ellipsis Button */}
//             <TouchableOpacity
//               onPress={(event) => handleEllipsisPress(item, event)}
//               style={styles.groupColorPicker}
//             >
//               <Icon name="ellipsis-vertical" size={24} color="#000" />
//             </TouchableOpacity>

//             {/* Popover Menu */}
//             {selectedGroup && selectedGroup.group_id === item.group_id && (
//               <Popover
//                 isVisible={popoverVisible}
//                 onRequestClose={() => setPopoverVisible(false)}
//                 from={() => popoverButtonRef.current}
//                 popoverStyle={styles.popover}
//               >
//                 <View style={styles.menuContainer}>
//                   <Text style={styles.groupName}>Change Group Color</Text>
//                   <View style={styles.iconGrid}>
//                     {[...Array(8).keys()].map((_, index) => {
//                       const iconColors = [
//                         colors.blue.main,
//                         colors.green.main,
//                         colors.pink.main,
//                         colors.yellow.main,
//                         colors.purple.main,
//                         '#A1A1A1',
//                         '#A1A1A1',
//                         '#A1A1A1',
//                       ];

//                       const iconColor = iconColors[index];

//                       return (
//                         <TouchableOpacity
//                           key={index}
//                           onPress={() => handleColorChange(iconColor)}
//                           style={styles.menuItem}
//                         >
//                           <Icon name="brush" size={24} color={iconColor} style={styles.groupColorIcon} />
//                         </TouchableOpacity>
//                       );
//                     })}
//                   </View>
//                 </View>
//               </Popover>
//             )}
//           </View>
//         );
//       }}
//       contentContainerStyle={{ paddingBottom: 20 }}
//     />
//   );
// };

// const GroupsDisplay = ({ groupId }) => {
//   const { theme } = useTheme();
//   const styles = createStyles(theme);
//   const navigation = useNavigation();
//   const [username, setUsername] = useState(null);
//   const [groups, setGroups] = useState([]);
//   const [popoverVisible, setPopoverVisible] = useState(false);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const popoverButtonRef = useRef(null);

//   useEffect(() => {
//     const getUsername = async () => {
//       const storedUsername = await SecureStore.getItemAsync('username');
//       if (storedUsername) {
//         setUsername(storedUsername);
//         fetchGroups(storedUsername);
//       } else {
//         console.error("GroupsDisplay: Username not found in SecureStore.");
//       }
//     };

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

//     getUsername();
//   }, []);

//   // Function to handle color change
//   const handleColorChange = (color) => {
//     if (selectedGroup) {
//       console.log(`Changing color for group: ${selectedGroup.group_name}:` + color);
//       // Logic to change the color for the selected group
//     }
//     setPopoverVisible(false);
//   };

//   // Handle the ellipsis button press
//   const handleEllipsisPress = (group, event) => {
//     event.stopPropagation(); // Prevents triggering navigation
//     setSelectedGroup(group);
//     setPopoverVisible(true);
//     console.log(`Ellipsis pressed for group: ${group.group_name}`);
//   };

//   const getUserId = async (username, groupname) => {
//     try {
//       const response = await axios.post(`${API_URL}get-id`, { username });
//       const userId = response.data.id;

//       if (userId === undefined || groupname.group_id === undefined) {
//         console.log(userId);
//         console.error("userId or groupId is undefined");
//         return;
//       }

//       const colorResponse = await axios.get(`${API_URL}get-group-color`, {
//         params: { user_id: userId, group_id: groupname.group_id },
//       });

//       console.log("Group Color:", colorResponse.data.group_color);
//       return colorResponse.data.group_color; // Dynamically return the group color

//     } catch (error) {
//       console.error("Error fetching user ID or group color:", error);
//     }
//   };

//   return (
//     <FlatList
//       data={groups}
//       keyExtractor={(item) => item.group_id.toString()}
//       renderItem={({ item }) => {
//         // const groupColor = getUserId(username, item); // Fetch the group color dynamically
//         // console.log("COLORS ARR: " + colors[groupColor]);



//       const backgroundColors = {
//         yellow: colors.yellow.lightest,
//         green: colors.green.lightest,
//         blue: colors.blue.lightest,
//         purple: colors.purple.lightest,
//         pink: colors.pink.lightest,
//       };

//       // Now you can safely reference backgroundColors[groupColor]
//       const backgroundColor = backgroundColors[groupColor] || colors.green.lightest; // Default to blue if groupColor is undefined

//       const borderColors = {
//         yellow: colors.yellow.lighter,
//         green: colors.green.lighter,
//         blue: colors.blue.lighter,
//         purple: colors.purple.lighter,
//         pink: colors.pink.lighter,
//       };

//       // Now you can safely reference borderColors[groupColor]
//       // const borderColor = borderColors[groupColor] || colors.yellow.lighter; // Default to blue if groupColor is undefined

//       // console.log(borderColors[groupColor])

//       const groupColor = 'purple';  // This should be dynamically set
//               // const groupColor = getUserId(username, item); // Fetch the group color dynamically

//       console.log("groupColor:", groupColor);  // Check if it's indeed 'purple'
      
//       const borderColor = borderColors[groupColor];
      
//       console.log("Resolved borderColor:", borderColor);  // Check if it resolves correctly
      
//       // If borderColor is undefined, you can fall back to a default value:
//       const finalBorderColor = borderColor || colors.blue.lighter;  // Default to blue if undefined
      
      

//         return (
//           <View
//             style={[styles.groupItem, { backgroundColor: backgroundColor, borderColor: borderColor }]}
//           >
//             <TouchableOpacity
//               style={styles.groupItemTouchable}
//               onPress={() =>
//                 navigation.navigate('Members', {
//                   groupName: item.group_name,
//                   groupId: item.group_id,
//                 })
//               }
//             >
//               <Text style={styles.groupName}>{item.group_name}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={(event) => handleEllipsisPress(item, event)}
//               style={styles.groupColorPicker}
//             >
//               <Icon name="ellipsis-vertical" size={24} color="#000" />
//             </TouchableOpacity>

//             {selectedGroup && selectedGroup.group_id === item.group_id && (
//               <Popover
//                 isVisible={popoverVisible}
//                 onRequestClose={() => setPopoverVisible(false)}
//                 from={() => popoverButtonRef.current}
//                 popoverStyle={styles.popover}
//               >
//                 <View style={styles.menuContainer}>
//                   <Text style={styles.groupName}>Change Group Color</Text>
//                   <View style={styles.iconGrid}>
//                     {[...Array(8).keys()].map((_, index) => {
//                       const iconColors = [
//                         colors.blue.main,
//                         colors.green.main,
//                         colors.pink.main,
//                         colors.yellow.main,
//                         colors.purple.main,
//                         '#A1A1A1',
//                         '#A1A1A1',
//                         '#A1A1A1',
//                       ];

//                       const iconColor = iconColors[index];

//                       return (
//                         <TouchableOpacity
//                           key={index}
//                           onPress={() => handleColorChange(iconColor)}
//                           style={styles.menuItem}
//                         >
//                           <Icon name="brush" size={24} color={iconColor} style={styles.groupColorIcon} />
//                         </TouchableOpacity>
//                       );
//                     })}
//                   </View>
//                 </View>
//               </Popover>
//             )}
//           </View>
//         );
//       }}
//       contentContainerStyle={{ paddingBottom: 20 }}
//     />
//   );
// };

const GroupsDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const [username, setUsername] = useState(null);
  const [groups, setGroups] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupColors, setGroupColors] = useState({});
  const popoverButtonRef = useRef(null);

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
        fetchGroups(storedUsername);
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

  useEffect(() => {
    const fetchGroupColors = async () => {
      if (username && groups.length > 0) {
        const colorMap = {}; // To store colors for each group
        for (const group of groups) {
          const color = await getUserId(username, group);
          colorMap[group.group_id] = color;
        }
        setGroupColors(colorMap);
      }
    };
    fetchGroupColors();
  }, [username, groups]);

  // Function to fetch color for a group
  const getUserId = async (username, group) => {
    try {
      const response = await axios.post(`${API_URL}get-id`, { username });
      const userId = response.data.id;
      if (userId === undefined || group.group_id === undefined) {
        console.error("userId or groupId is undefined");
        return;
      }

      const colorResponse = await axios.get(`${API_URL}get-group-color`, {
        params: { user_id: userId, group_id: group.group_id },
      });

      return colorResponse.data.group_color;
    } catch (error) {
      console.error("Error fetching user ID or group color:", error);
      return 'purple'; // Default color if error occurs
    }
  };

  // Function to handle color change
  const handleColorChange = (color) => {
    if (selectedGroup) {
      console.log(`Changing color for group: ${selectedGroup.group_name}: ${color}`);
    }
    setPopoverVisible(false);
  };

  const handleEllipsisPress = (group, event) => {
    event.stopPropagation(); // Prevents triggering navigation
    setSelectedGroup(group);
    setPopoverVisible(true);
    console.log(`Ellipsis pressed for group: ${group.group_name}`);
  };

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.group_id.toString()}
      renderItem={({ item }) => {

        const borderColors = {
          yellow: colors.yellow.lighter,
          green: colors.green.lighter,
          blue: colors.blue.lighter,
          purple: colors.purple.lighter,
          pink: colors.pink.lighter,
        };
        const backgroundColors= {
          yellow: colors.yellow.lightest,
          green: colors.green.lightest,
          blue: colors.blue.lightest,
          purple: colors.purple.lightest,
          pink: colors.pink.lightest,
        };
        
        const groupColor = groupColors[item.group_id] || colors.green.lightest;

        const backgroundColor = backgroundColors[groupColor] || colors.purple.lighter;

        const borderColor = borderColors[groupColor] || colors.purple.lighter;
        
        return (
          <View
            style={[styles.groupItem, { backgroundColor: backgroundColor, borderColor: borderColor }]}
          >
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
                        '#A1A1A1', // placeholder color
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
        );
      }}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};




export default GroupsScreen;
