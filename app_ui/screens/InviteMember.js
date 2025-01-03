// InviteMember.js -NN

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import { API_URL } from '../config.js';
import createStyles from '../style/styles.js';
import { useTheme } from '../contexts/ThemeProvider.js';
import { RegisterHeader } from '../components/headers.js';

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
      } else {
        console.error("UI Member.js: Username not found in SecureStore.");
      }
    };
    getUsername();
  }, []);

    const handleSendInvitation = async () => {
      if (!inviteeName) {
          Toast.show({
              type: 'error',
              text1: 'Missing Info',
              text2: 'Please enter the invitee name.',
          });
          return;
      }
      try {
          const response = await axios.post(`${API_URL}send-invite`, {
              inviter_name: username,
              invitee_name: inviteeName,
              group_id: groupId,
          });
          Toast.show({
              type: 'success',
              text1: 'Invitation Sent',
              text2: `Invitation sent to user: ${inviteeName}`,
          });
          setInviteeName('');
      } catch (error) {
          console.error("Error sending invitation:", error);
          Toast.show({
              type: 'error',
              text1: 'Error Sending Invitation',
              text2: error.response?.data?.error || 'An unexpected error occurred.',
          });
      }
  };

    return (
        <View style={styles.screen}>
            <RegisterHeader title="Invite User" navigation={navigation} />
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