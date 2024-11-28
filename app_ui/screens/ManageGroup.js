// ManageGroup.js - NN

import React, { useState } from 'react';
import { Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Delete from 'react-native-vector-icons/Ionicons';
import { Ionicons } from 'react-native-vector-icons';
import Toast from 'react-native-toast-message';
import axios from 'axios';

import { API_URL } from '../config.js';
import createStyles from '../style/styles.js';
import { useTheme } from '../contexts/ThemeProvider.js';
import { ScreenHeader } from '../components/headers.js';



const ManageScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Manage Group" navigation={navigation} />

      <ManageDisplay navigation={navigation}/>
    </View>
  );
};

const ManageDisplay = ({ navigation }) => {
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
              }
            })
            .catch((error) => {
              console.error("Error removing member: ", error);
              Toast.show({
                type: 'error',
                text1: 'Error removing member',
                text2: error.response?.data?.error || 'An unexpected error occurred',
              });
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
                Toast.show({
                  type: 'log',
                  text1: 'Disbanded',
                  text2: 'Group has been disbanded',
                });
                navigation.navigate('GroupsMain');
              })
              .catch((error) => {
                console.error("Error disbanding group: ", error);
                Toast.show({
                  type: 'error',
                  text1: 'Error disbanding group',
                  text2: error.response?.data?.error || 'An unexpected error occurred',
                });              
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handlePermissionUpdate = (userToUpdate, canModify) => {
    axios.put(`${API_URL}update-chore-permission`, {
      username,
      group_id: groupId,
      user_to_update: userToUpdate,
      can_modify_chore: canModify,
    })
    .then((response) => {
      Toast.show({
        type: 'success',
        text1: `${canModify ? 'Edit Access' : 'View Only'}`,
        text2: `${canModify ? `Edit-only access updated for ${userToUpdate}` : `View-only access updated for ${userToUpdate}`}`,
      });
      
    })
    .catch((error) => {
      console.error("Error updating permission: ", error);
      Toast.show({
        type: 'error',
        text1: 'Error updating permission',
        text2: error.response?.data?.error || 'An unexpected error occurred',
      });
    });
  };

  return (
    <View style={styles.content}>
      <FlatList
        data={members}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.manageMemberItem}>
            <Text style={styles.memberName}>{item.display_name}</Text>
            {item.username !== username && (
            <>
              <View style={styles.permissionButtonContainer}>
                <TouchableOpacity
                  style={styles.permissionButton}
                  onPress={() => handlePermissionUpdate(item.username, true)}
                >
                  <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.permissionButton}
                  onPress={() => handlePermissionUpdate(item.username, false)}
                >
                  <Ionicons name="eye" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveMember(item.username)}
              >
                <Delete name="close" size={25} color="black" />
              </TouchableOpacity>
            </>
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
