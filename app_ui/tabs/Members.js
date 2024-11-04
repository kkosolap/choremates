// Members.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Text, View, StyleSheet, TouchableOpacity, Alert, FlatList, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import Mail from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../config';
import Icon from 'react-native-vector-icons/Ionicons'


// members invitation and group creation
const MembersScreen = ({ groupId, userId }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const [hasInvitations, setHasInvitations] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inviteeId, setInviteeId] = useState('');
  const [displayGroupName, setDisplayGroupName] = useState('');
  const [isGroupCreated, setIsGroupCreated] = useState(false);

  // if invitation received, button turns red
  useEffect(() => {
    const fetchPendingInvitations = async () => {
      try {
        const response = await axios.get(`${API_URL}receivedInvitations`, {
          params: { user_id: userId }
        });
        setHasInvitations(response.data.length > 0);
      } catch (error) {
        console.error("Error fetching pending invitations:", error);
      }
    };

    fetchPendingInvitations();
  }, [userId]);

  // invitation button
  const handleMailPress = () => {
    navigation.navigate('GroupInvitations');
  };

  // creating a group button
  const handleCreateGroup = async () => {
    if (!groupName) {
      Alert.alert('Please enter a group name');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}createGroup`, {
        group_name: groupName,
        user_id: userId,
      });
      Alert.alert('Group created successfully', `Group ID: ${response.data.group_id}`);
      setDisplayGroupName(groupName);
      setIsGroupCreated(true);
      setIsGroupModalVisible(false);
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Failed to create group.");
    }
  };

  // sending invitation button
  const handleSendInvitation = async () => {
    if (!inviteeId) {
      Alert.alert('Please enter the invitee ID');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}sendInvitation`, {
        inviter_id: userId,
        invitee_id: inviteeId,
        group_id: groupId,
      });
      Alert.alert('Invitation sent successfully', `Invitation sent to user ID: ${inviteeId}`);
      setInviteeId(''); // Clear invitee ID after sending
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

      {!isGroupCreated ? ( // only shows create group/invite members depending on if you are in a group or not
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => setIsGroupModalVisible(true)}
        >
          <Text style={styles.managecreateButtonText}>Create Group</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => setIsInviteModalVisible(true)}
        >
          <Text style={styles.managecreateButtonText}>Invite Members</Text>
        </TouchableOpacity>
      )}

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
          <Text style={styles.modalTitle}>Enter Invitee ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Invitee ID"
            value={inviteeId}
            onChangeText={setInviteeId}
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
          const response = await axios.get(`${API_URL}groupMembers`, {
            params: { group_id: groupId }
          });
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
