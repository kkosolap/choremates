// ManageGroup.js - NN

import React, { useState } from 'react';
import { Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
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

    //alert popup to confirm removal
    Alert.alert(
      "Confirm Removal",
      `Are you sure you want to remove ${userToRemove} from the group?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            console.log("Username:", username);
            console.log("Group ID:", groupId);
            console.log("User to remove:", userToRemove);
            axios.delete(`${API_URL}remove-user-from-group`, {
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
                alert("User removed successfully.");
              }
            })
            .catch((error) => {
              console.error("Error removing member: ", error);
              alert("Failed to remove the member.");
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDisbandGroup = () => {
    Alert.alert(
      "Confirm Disband",
      "Are you sure you want to disband this group?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            axios.delete(`${API_URL}disband-group`, {
              data: {
                username,
                group_id: groupId,
              },
            })
              .then(() => {
                alert("Group has been disbanded.");
                navigation.navigate('GroupsMain');
              })
              .catch((error) => {
                console.error("Error disbanding group: ", error);
                alert("Failed to disband the group.");
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.content}>
      <FlatList
        data={members}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.manageMemberItem}>
            <Text style={styles.memberName}>{item.username}</Text>
            {item.username !== username && (
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleRemoveMember(item.username)}
              >
                <Delete name="close" size={25} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            console.log('Disband Group button pressed');
            handleDisbandGroup();
          }}
        >
          <Text style={styles.manageCreateButtonText}>Disband Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageScreen;
