// Groups.js

import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Mail from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

import { useTheme } from '../style/ThemeProvider.js';
import createStyles from '../style/styles.js';
import { TabHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config.js';


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
      <Mail name="mail" size={25} color="#fff" />
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
        console.log("Group members response:", response.data);
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        Alert.alert("Failed to load groups.");
      }
    };

    getUsername();
  }, []);

  return (
    <View style={styles.content}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.group_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.groupItem}>
            <Text style={styles.groupName}>{item.group_name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity 
        style={styles.createButton} 
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Text style={styles.managecreateButtonText}>+ Create Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GroupsScreen;
