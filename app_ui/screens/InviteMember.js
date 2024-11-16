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
const InviteMemberScreen = ({ username }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const route = useRoute();
    const navigation = useNavigation();
    const [inviteeId, setInviteeId] = useState('');
    const groupId = route.params.groupId;

    const handleSendInvitation = async () => {
        if (!inviteeId) {
          Alert.alert('Please enter the invitee ID');
          return;
        }
        console.log('User ID:', username);
        console.log('Invitee ID:', inviteeId);
        console.log('Group ID:', groupId);
        try {
          const response = await axios.post(`${API_URL}sendInvitation`, {
            inviter_id: username,
            invitee_id: inviteeId,
            group_id: groupId,
          });
          Alert.alert('Invitation sent successfully', `Invitation sent to user ID: ${inviteeId}`);
          setInviteeId('');
          setIsInviteModalVisible(false);
        } catch (error) {
          console.error("Error sending invitation:", error);
          Alert.alert("Failed to send invitation.");
        }
      };

    return (
        <View style={styles.screen}>
            <RegisterHeader title="Enter Invitee ID" navigation={navigation} />
            <TextInput
                style={styles.groupInviteeInput}
                placeholder="Enter Invitee ID"
                value={inviteeId}
                onChangeText={setInviteeId}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSendInvitation}>
                <Text style={styles.submitButtonText}>Send Invitation</Text>
            </TouchableOpacity>
        </View>
    );
};

export default InviteMemberScreen;