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
import themes from '../style/colors.js';


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
    <FlatList
      data={groups}
      keyExtractor={(item) => item.group_id.toString()}
      renderItem={({ item }) => (
        <View style={styles.groupItem}>
          {/* Touchable for navigation */}
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('Members', { 
              groupName: item.group_name, 
              groupId: item.group_id 
            })}
          >
            {/* Left-aligned Group Name */}
            <Text style={styles.groupName}>{item.group_name}</Text>
          </TouchableOpacity>

          {/* Right-aligned Icon with Popover */}
          <View ref={popoverButtonRef}>
            <TouchableOpacity
              onPress={(event) => {
                event.stopPropagation(); // Prevents navigation from being triggered
                setPopoverVisible(true);
              }}
              style={styles.groupColorPicker}
            >
              <Icon name="ellipsis-vertical" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Popover Menu */}
          <Popover
            isVisible={popoverVisible}
            onRequestClose={() => setPopoverVisible(false)}
            from={() => popoverButtonRef.current}
            popoverStyle={styles.popover}
          >
            <TouchableOpacity onPress={() => handleOptionSelect('Option 1')}>
              <Text style={styles.menuItem}>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionSelect('Option 2')}>
              <Text style={styles.menuItem}>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptionSelect('Option 3')}>
              <Text style={styles.menuItem}>Option 3</Text>
            </TouchableOpacity>
          </Popover>
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

export default GroupsScreen;
