// Members.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import { API_URL } from '../config';


// header and page content
const MembersScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <TabHeader title="Members" />
      <MembersDisplay navigation={navigation}/>
    </View>
  );
};

// page content
const MembersDisplay = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [members, setMembers] = useState([]);

  // useEffect(() => {
  //   const fetchMembers = async () => {
  //     try {
  //       const groupId = "";
  //       const response = await axios.get(`${API_URL}api/groups/${groupId}/members`);
  //       setMembers(response.data);
  //     } catch (error) {
  //       console.error('Error fetching members:', error);
  //     }
  //   };

  //   fetchMembers();
  // }, []);

  const handleManageGroup = () => {
    navigation.navigate('Manage');
  };

  return (
    <View style={styles.content}>

      {/* {members.map((member, index) => (
        <View key={index} style={styles.members}>
          <Text style={styles.memberText}>{member.username}</Text>
        </View>
      ))} */}

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
