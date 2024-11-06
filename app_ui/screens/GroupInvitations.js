// GroupInvitations.js - NN

import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import Arrow from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { TabHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config';


const GroupInvitations = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const username = route.params?.username;
        const res = await axios.get(`${API_URL}receivedInvitations`, {
          params: { username },
        });
        if (res.status === 200) {
          setInvitations(res.data);
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
        Alert.alert("Failed to load invitations.");
      }
    };
    
    fetchInvitations();
  }, []);

  const handleResponse = async (invitationId, response) => {
    try {
      const res = await axios.post(`${API_URL}respondToInvitation`, {
        invitation_id: invitationId,
        response,
      });
      
      if (res.status === 200) {
        Alert.alert(`Invitation ${response}ed successfully.`);
        navigation.goBack();
      }
    } catch (error) {
      console.error(`Failed to ${response} invitation:`, error);
      Alert.alert(`Failed to ${response} invitation.`);
    }
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backPageButton}>
        <Arrow name="arrow-back" size={25} color="black" />
      </TouchableOpacity>

      <TabHeader title="Group Invitations" />

      <FlatList
        data={invitations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.invitationItem}>
            <Text style={styles.invitationText}>Group ID: {item.id}</Text>
            <View style={styles.invitationButtonContainer}>
              <TouchableOpacity 
                style={styles.acceptButton} 
                onPress={() => handleResponse(item.id, 'accepted')}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.declineButton} 
                onPress={() => handleResponse(item.id, 'rejected')}
              >
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default GroupInvitations;