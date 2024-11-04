// Members.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Text, View, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../config';


// main screen 
const MembersScreen = ({ groupId, userId }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const [hasInvitations, setHasInvitations] = useState(false);

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

  return (
    <View style={styles.screen}>

      <TouchableOpacity
        onPress={handleMailPress}
        style={[
          styles.mailButton,
          hasInvitations && { backgroundColor: theme.red }
        ]}
      >
        <Icon name="mail" size={25} color="#fff" />
      </TouchableOpacity>

      <TabHeader title="Members" />
      <MembersDisplay groupId={groupId} navigation={navigation}/>
    </View>
  );
};

// members display
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
        <Text style={styles.manageButtonText}>Manage Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MembersScreen;
