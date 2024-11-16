// ManageGroup.js - NN

import React, { useState } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';

import Delete from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../style/ThemeProvider.js';
import createStyles from '../style/styles.js';
import { ScreenHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config.js';


const ManageScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Manage Group" navigation={navigation} />

      <ManageDisplay />
    </View>
  );
};

const ManageDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const route = useRoute();
  const { members: initialMembers, groupId, username  } = route.params;
  const [members, setMembers] = useState(initialMembers);

  const handleRemoveMember = (userToRemove) => {
    console.log("Username:", username);
    console.log("Group ID:", groupId);
    console.log("User to remove:", userToRemove);
    axios
      .delete(`${API_URL}/remove-user-from-group`, {
        data: {
          username,
          group_id: groupId,
          user_to_remove: userToRemove,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setMembers((prevMembers) =>
            prevMembers.filter((member) => member.username !== userToRemove)
          );
        } 
      })
      .catch((error) => {
        console.error("Error removing member: ", error);
        alert("Failed to remove the member.");
      });
  };

  return (
    <View style={styles.content}>
      <FlatList
        data={members}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <Text style={styles.memberName}>{item.username}</Text>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => handleRemoveMember(item.username)}
            >
              <Delete name="close" size={25} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ManageScreen;
