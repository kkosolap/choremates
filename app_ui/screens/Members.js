// Members.js -NN

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { ScreenHeader } from '../components/headers.js';
import { useTheme } from '../style/ThemeProvider.js';
import createStyles from '../style/styles.js';

import axios from 'axios';
import { API_URL } from '../config.js';


const MembersScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const route = useRoute();
  const { groupName } = route.params;

  return (
    <View style={styles.screen}>
      <ScreenHeader title={`${groupName}'s Members`} navigation={navigation} />
      <MembersDisplay navigation={navigation} />
    </View>
  );
};

const MembersDisplay = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const route = useRoute();
  const { groupId } = route.params;
  const [members, setMembers] = useState([]);

  // fetch members of the group
  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}get-group-members`, {
          params: { group_id: groupId }
        });
        // console.log("Group members response:", response.data);
        setMembers(response.data);
      } catch (error) {
        Alert.alert('Error retrieving group members: ' + error.message);
      }
    };

    fetchGroupMembers();
  }, [groupId]);

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
    </View>
  );
};

export default MembersScreen;
