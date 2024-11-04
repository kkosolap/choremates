// GroupInvitations.js - NN

import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import Arrow from 'react-native-vector-icons/MaterialIcons';
import { TabHeader } from '../components/headers.js';
import axios from 'axios';
import { API_URL } from '../config';

const GroupInvitations = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const invitations = route.params?.invitations || []; // get invitations from route params

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
            <Text style={styles.invitationText}>Group ID: {item.groupId}</Text>
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