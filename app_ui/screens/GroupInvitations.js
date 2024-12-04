// GroupInvitations.js - NN

import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import createStyles from '../style/styles';
import { useGroupThemes } from '../contexts/GroupThemeProvider';
import { useTheme } from '../contexts/ThemeProvider.js';
import { ScreenHeader } from '../components/headers.js';

import { API_URL } from '../config';
import axios from 'axios';

const GroupInvitations = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { changeGroupTheme } = useGroupThemes();

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

  const handleResponse = async (invitationId, response, groupId) => {
    try {
      const res = await axios.post(`${API_URL}respond-to-invite`, {
        invitation_id: invitationId,
        response,
      });

      const username = route.params?.username;
      if (response === 'accepted') {
        changeGroupTheme(username, groupId, theme.name); // set default group color to current theme  -MH
      }
      
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

  // ---------- Page Content ----------
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
                onPress={() => handleResponse(item.id, 'accepted', item.group_id)}
              >
                <Icon name="checkmark-outline" color={theme.white} size={24} />
                <Text style={styles.buttonText}> Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.declineButton} 
                onPress={() => handleResponse(item.id, 'rejected', item.group_id)}
              >
                <Icon name="close-outline" color={theme.white} size={24} />
                <Text style={styles.buttonText}> Decline</Text>
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