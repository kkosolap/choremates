// Members.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../config';


// main screen 
const MembersScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const [hasInvitations, setHasInvitations] = useState(false);

  // if invitation received, button turns red
  useEffect(() => {
    const fetchPendingInvitations = async () => {
      try {
        const response = await axios.get(`${API_URL}receivedInvitations`, {
        });
        setHasInvitations(response.data.length > 0);
      } catch (error) {
        console.error("Error fetching pending invitations:", error);
      }
    };

    fetchPendingInvitations();
  }, []);

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
      <MembersDisplay navigation={navigation}/>
    </View>
  );
};

// members display
const MembersDisplay = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [members, setMembers] = useState([]);

  const handleManageGroup = () => {
    navigation.navigate('Manage');
  };

  return (
    <View style={styles.content}>

      {/* display list of member profiles */}

      <TouchableOpacity 
        style={styles.membersButtons} 
        onPress={() => {
          console.log('Manage Group button pressed');
          handleManageGroup();
        }}
      >
        <Text style={styles.membersButtonText}>Manage Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MembersScreen;
