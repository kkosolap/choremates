// Members.js
// Copied from previous members, just left here for now does not do anything yet.

import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Alert, FlatList, TextInput, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Mail from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons'
import * as SecureStore from 'expo-secure-store';

import { useTheme } from '../style/ThemeProvider.js';
import createStyles from '../style/styles.js';
import { TabHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config.js';


// members invitation, group creation, and invitations
const MembersScreen = ({ groupId }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const [hasInvitations, setHasInvitations] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inviteeName, setInviteeName] = useState('');
  const [displayGroupName, setDisplayGroupName] = useState('');
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

  // if invitation received, button turns red
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

  // invitation button
  const handleMailPress = () => {
    navigation.navigate('GroupInvitations', { username });
  };

  // creating a group button
  const handleCreateGroup = async () => {
    if (!groupName) {
      Alert.alert('Please enter a group name');
      return;
    }
    try {
      //console.log(groupName, username);
      const response = await axios.post(`${API_URL}create-group`, {
        group_name: groupName,
        username: username,
      });
      Alert.alert('Group created successfully', `Group ID: ${response.data.group_id}`);
      setDisplayGroupName(groupName);
      setIsGroupModalVisible(false);
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Failed to create group.");
    }
  };

  // sending invitation button
  const handleSendInvitation = async () => {
    if (!inviteeName) {
      Alert.alert('Please enter the invitee username');
      return;
    }
    try {
      //console.log("inviter: ", username, "\n invitee: ", inviteeName);
      const response = await axios.post(`${API_URL}send-invite`, {
        inviter_name: username,
        invitee_name: inviteeName,
        group_id: 2, // hardcoded, current only works with group_id = 2
      });
      Alert.alert('Invitation sent successfully', `Invitation sent to user: ${inviteeName}`);
      setInviteeName(''); // Clear invitee username after sending
      setIsInviteModalVisible(false);
    } catch (error) {
      console.error("Error sending invitation:", error);
      Alert.alert("Failed to send invitation.");
    }
  };

  return (
    <View style={styles.screen}>

      <TouchableOpacity // invite button red when received invitation
        onPress={handleMailPress}
        style={[
          styles.mailButton,
          hasInvitations && { backgroundColor: theme.red }
        ]}
      >
      <Mail name="mail" size={25} color="#fff" />
      </TouchableOpacity>

      <TabHeader title={displayGroupName ? `${displayGroupName}: Members` : "Members"} />

      <MembersDisplay groupId={groupId} navigation={navigation}/>

      <TouchableOpacity 
        style={styles.createButton} 
        onPress={() => setIsGroupModalVisible(true)}
      >
      <Text style={styles.managecreateButtonText}>Create Group</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.inviteButton} 
        onPress={() => setIsInviteModalVisible(true)}
      >
        <Text style={styles.managecreateButtonText}>Invite Members</Text>
      </TouchableOpacity>

      <Modal // create group modal
        animationType="slide"
        transparent={true}
        visible={isGroupModalVisible}
      >
        <View style={styles.modalView}>
          <TouchableOpacity 
            onPress={() => setIsGroupModalVisible(false)}
            style={styles.closeButton}
          >
          <Icon name="close" size={30} color={theme.black} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Enter Group Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Group Name"
            value={groupName}
            onChangeText={setGroupName}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateGroup}
          >
          <Text style={styles.submitButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal // invite member modal
        animationType="slide"
        transparent={true}
        visible={isInviteModalVisible}
      >
        <View style={styles.modalView}>
          <TouchableOpacity 
            onPress={() => setIsInviteModalVisible(false)}
            style={styles.closeButton}
          >
          <Icon name="close" size={30} color={theme.black} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Enter Invitee Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Invitee Username"
            value={inviteeName}
            onChangeText={setInviteeName}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSendInvitation}
          >
          <Text style={styles.submitButtonText}>Send Invitation</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// members display & management
const MembersDisplay = ({ groupId, navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [members, setMembers] = useState([]);

  // fetch members of the group
  useEffect(() => {
    const fetchGroupMembers = async () => {
        try {
          const response = await axios.get(`${API_URL}get-group-members`, {
            params: { group_id: 2 } // hardcoded for now
          });
          console.log("Group members response:", response.data);
          setMembers(response.data);
        } catch (error) {
            Alert.alert('Error retrieving group members: ' + error.message);
        }
    };

    fetchGroupMembers();
  }, [groupId]);


  const handleManageGroup = () => {
    navigation.navigate('Manage', {members});
  };

  return (
    <View style={styles.content}>
      <FlatList
          data={members}
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
              <View style={styles.memberItem}>
                  <Text style={styles.memberName}>{item.username}</Text>
                  <Text style={styles.memberRole}>Role: {item.role}</Text>
              </View>
          )}
      />

      <TouchableOpacity 
        style={styles.manageButton} 
        onPress={() => {
          console.log('Manage Group button pressed');
          handleManageGroup();
        }}
      >
        <Text style={styles.managecreateButtonText}>Manage Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MembersScreen;
