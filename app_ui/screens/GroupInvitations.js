// GroupInvitations.js - NN

import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';

import { useTheme } from '../contexts/ThemeProvider.js';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';

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
        Alert.alert(error.response.data.error);
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
        Alert.alert(`Invitation ${response}ed successfully.`);
        navigation.goBack();
      }
    } catch (error) {
      console.error(`Failed to ${response} invitation:`, error);
      Alert.alert(error.response.data.error);
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
        ListEmptyComponent={  // render if data is empty (no invitations)  -MH
          <View style={styles.emptyInvitesSection}>
            <Ionicons name={"mail-open"} size={80} color={theme.main} />

            <Text style={styles.biggerEmptySectionText}>
              No pending invitations
            </Text>
            <Text style={styles.emptySectionText}>
              Check back later!
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default GroupInvitations;