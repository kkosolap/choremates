// InviteMember.js -NN

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import { useTheme } from '../style/ThemeProvider.js';
import createStyles from '../style/styles.js';
import { RegisterHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config.js';


// for inviting members -NN
const InviteMemberScreen = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const route = useRoute();
    const navigation = useNavigation();
    const groupId = route.params.groupId;
    const [inviteeName, setInviteeName] = useState('');
    const [username, setUsername] = useState(null);

  useEffect(() => {
    const getUsername = async () => {   // get the username from securestore -KK
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
        //console.log(username);
      } else {
        console.error("UI Member.js: Username not found in SecureStore.");
      }
    };
    getUsername();
  }, []);

    const handleSendInvitation = async () => {
        if (!inviteeName) {
          Alert.alert('Please enter the invitee name');
          return;
        }
        console.log('Username:', username);
        console.log('Invitee name:', inviteeName);
        console.log('Group ID:', groupId);
        try {
          const response = await axios.post(`${API_URL}send-invite`, {
            inviter_name: username,
            invitee_name: inviteeName,
            group_id: groupId,
          });
          Alert.alert('Invitation sent successfully', `Invitation sent to user: ${inviteeName}`);
          setInviteeName('');
        } catch (error) {
          console.error("Error sending invitation:", error);
          Alert.alert("Failed to send invitation.");
        }
      };

    return (
        <View style={styles.screen}>
            <RegisterHeader title="Enter Invitee Username" navigation={navigation} />
            <TextInput
                style={styles.groupInviteeInput}
                placeholder="Enter Invitee Username"
                value={inviteeName}
                onChangeText={setInviteeName}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSendInvitation}>
                <Text style={styles.submitButtonText}>Send Invitation</Text>
            </TouchableOpacity>
        </View>
    );
};

export default InviteMemberScreen;