// GroupInvitations.js - NN

import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import axios from 'axios';

import { API_URL } from '../config';
import createStyles from '../style/styles';
import { useTheme } from '../contexts/ThemeProvider.js';
import { ScreenHeader } from '../components/headers.js';

const GroupInvitations = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const username = route.params?.username;
        const res = await axios.get(`${API_URL}get-received-invite`, {
          params: { username },
        });
        if (res.status === 200) {

          // append group name to invitation -NN
          const invitationsWithNames = await Promise.all(
            res.data.map(async (invitation) => {
              try {
                const groupNameRes = await axios.post(`${API_URL}get-group-name`, {
                  group_id: invitation.group_id,
                });
                return {
                  ...invitation,
                  group_name: groupNameRes.data.group_name || "Unknown Group",
                };
              } catch (error) {
                console.error("Error fetching group name:", error);
                return {
                  ...invitation,
                  group_name: "Unknown Group",
                };
              }
            })
          );
          setInvitations(invitationsWithNames);
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);

      }
    };

    fetchInvitations();
  }, []);

  const handleResponse = async (invitationId, response) => {
    try {
      const res = await axios.post(`${API_URL}respond-to-invite`, {
        invitation_id: invitationId,
        response,
      });
      
      if (res.status === 200) {
        if(response == 'accepted'){
          Toast.show({
            type: 'success',
            text1: 'Joined Group',
            text2: `Invitation ${response} successfully`,
          });
        }
        else if(response == 'rejected'){
          Toast.show({
            type: 'log',
            text1: `Invitation ${response}`,
            text2: `Declined to join group`,
          });
        }
        
        navigation.goBack();

      }
    } catch (error) {
      console.error(`Failed to ${response} invitation:`, error);
      Toast.show({
        type: 'error',
        text1: `Failed to ${response} invitation`,
        text2: error.response?.data?.error || 'An unexpected error occurred',
      });
    }
  };

  return (
    <View style={styles.screen}>

      <ScreenHeader title="Group Invitations" navigation={navigation}/>

      <FlatList
        data={invitations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.invitationItem}>
              <Text style={styles.invitationText}>Incoming Invite: </Text>
              <Text style={styles.invitationGroupText}>{item.group_name}</Text>
            <View style={styles.invitationButtonContainer}>
              <TouchableOpacity 
                style={styles.acceptButton} 
                onPress={() => handleResponse(item.id, 'accepted')}
              >
                <Icon name="checkmark-outline" style={styles.buttonText} size={24} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.declineButton} 
                onPress={() => handleResponse(item.id, 'rejected')}
              >
                <Icon name="close-outline" style={styles.buttonText} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default GroupInvitations;