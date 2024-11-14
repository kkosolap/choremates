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

// show all groups and create group button -NN
const GroupsDisplay = ({ groupId }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const [username, setUsername] = useState(null);
  const [groups, setGroups] = useState([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const popoverButtonRef = useRef(null);

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
        fetchGroups(storedUsername); // call fetch group -NN
      } else {
        console.error("GroupsDisplay: Username not found in SecureStore.");
      }
    };

    //get all groups the user is a part of -NN
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


    const handleOptionSelect = (option) => {
      console.log(`Selected: ${option}`);
      setPopoverVisible(false);
    };

    getUsername();
  }, []);

  return (
    // <FlatList
    //   data={groups}
    //   keyExtractor={(item) => item.group_id.toString()}
    //   renderItem={({ item }) => (
    //     <View style={styles.groupItem}>
    //       {/* Touchable for navigation */}
    //       <TouchableOpacity
    //         style={{ flex: 1 }}
    //         onPress={() => navigation.navigate('Members', { 
    //           groupName: item.group_name, 
    //           groupId: item.group_id 
    //         })}
    //       >
    //         {/* Left-aligned Group Name */}
    //         <Text style={styles.groupName}>{item.group_name}</Text>
    //       </TouchableOpacity>

    //       {/* Right-aligned Icon with Popover */}
    //       <View ref={popoverButtonRef}>
    //         <TouchableOpacity
    //           onPress={(event) => {
    //             event.stopPropagation();                                        // Prevents navigate to group -VA
    //             setPopoverVisible(true);
    //           }}
    //           style={styles.groupColorPicker}
    //         >
    //           <Icon name="ellipsis-vertical" size={24} color="#000" />
    //         </TouchableOpacity>
    //       </View>

    //       {/* Popover Menu */}
    //       <Popover
    //         isVisible={popoverVisible}
    //         onRequestClose={() => setPopoverVisible(false)}
    //         from={() => popoverButtonRef.current}
    //         popoverStyle={styles.popover}
    //       >
    //       <View style={styles.menuContainer}>
    //         <Text style={styles.groupName}>Change Group Color</Text>


            
    //         {/* <TouchableOpacity onPress={() => handleOptionSelect('Option 1')}>
    //           <Icon name="brush" size={24} color="#000"> option 1</Icon>

    //         </TouchableOpacity> */}
    //         <TouchableOpacity onPress={() => handleOptionSelect('Option 1')} style={styles.menuItem}>
    //           <View style={styles.iconTextContainer}>
    //             <Icon name="brush" size={24} color="#000" style={styles.groupColorIcon} />
    //           </View>
    //         </TouchableOpacity>

    //         <TouchableOpacity onPress={() => handleOptionSelect('Option 2')} style={styles.menuItem}>
    //           <View style={styles.iconTextContainer}>
    //             <Icon name="brush" size={24} color="#000" style={styles.groupColorIcon} />
    //           </View>
    //         </TouchableOpacity>

    //         <TouchableOpacity onPress={() => handleOptionSelect('Option 3')} style={styles.menuItem}>
    //           <View style={styles.iconTextContainer}>
    //             <Icon name="brush" size={24} color="#000" style={styles.groupColorIcon} />
    //           </View>
    //         </TouchableOpacity>
    //       </View>

    //       </Popover>
    //     </View>
    //   )}
    //   contentContainerStyle={{ paddingBottom: 20 }}
    // />

<FlatList
  data={groups}
  keyExtractor={(item) => item.group_id.toString()}
  renderItem={({ item }) => (
    <View style={styles.groupItem}>
      <TouchableOpacity
        style={styles.groupItemTouchable}
        onPress={() => navigation.navigate('Members', { 
          groupName: item.group_name, 
          groupId: item.group_id 
        })}
      >
        <Text style={styles.groupName}>{item.group_name}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={(event) => {
          event.stopPropagation(); // Prevent navigation
          setPopoverVisible(true);
        }}
        style={styles.groupColorPicker}
      >
        <Icon name="ellipsis-vertical" size={24} color="#000" />
      </TouchableOpacity>

      {/* Popover Menu */}
      {/* I think it currently works for last group rendered
      if method not worked out, maybe adding a dropdown to pick the group and color ?    -VA  */}
      <Popover
        isVisible={popoverVisible}
        onRequestClose={() => setPopoverVisible(false)}
        from={() => popoverButtonRef.current}
        popoverStyle={styles.popover}
      >
        <View style={styles.menuContainer}>
          <Text style={styles.groupName}>Change Group Color</Text>

          {/* Icon Grid */}
          <View style={styles.iconGrid}>
            {[...Array(8).keys()].map((_, index) => {
              // Ensure that the color is correctly assigned from theme
              const iconColors = [
                colors.blue.main,    // Blue
                colors.green.main,   // Green
                colors.pink.main,    // Pink
                colors.yellow.main,  // Yellow
                colors.purple.main,  // Purple
                '#A1A1A1',      // Placeholder colors
                '#A1A1A1',      
                '#A1A1A1',      
              ];

              const iconColor = iconColors[index];

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleOptionSelect(`Option ${index + 1}`)}
                  style={styles.menuItem}
                >
                  <Icon name="brush" size={24} color={iconColor} style={styles.groupColorIcon} />
                </TouchableOpacity>
              );
            })}
          </View>


        </View>
      </Popover>
    </View>
  )}
  contentContainerStyle={{ paddingBottom: 20 }}
/>


  );
};

export default GroupsScreen;
