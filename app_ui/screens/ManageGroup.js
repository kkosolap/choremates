// ManageGroup.js - NN

import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import createStyles from '../style/styles.js';
import { useTheme } from '../contexts/ThemeProvider.js';
import { ScreenHeader } from '../components/headers.js';

import { API_URL } from '../config.js';
import axios from 'axios';

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
  const [selectedButtons, setSelectedButtons] = useState({});

  // permission states -NN
  useEffect(() => {
    const loadSelectedButtons = async () => {
      try {
        const storedButtons = await AsyncStorage.getItem('selectedButtons');
        if (storedButtons) {
          try {
            setSelectedButtons(JSON.parse(storedButtons));
          } catch (error) {
            console.error("Error parsing stored buttons:", error);
            setSelectedButtons({});
          }
        } else {
          setSelectedButtons({});
        }
      } catch (error) {
        console.error("Error loading stored buttons:", error);
        setSelectedButtons({});
      }
    };
    loadSelectedButtons();
  }, []);

  const handleRemoveMember = (userToRemove) => {
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

  // update permissions
  const handlePermissionUpdate = (userToUpdate, canModify) => {
    // for permission display -NN
    const buttonKey = `${userToUpdate}-${canModify ? 'edit' : 'view'}`;
    const updatedButtons = { ...selectedButtons, [userToUpdate]: buttonKey };
    setSelectedButtons(updatedButtons);
    AsyncStorage.setItem('selectedButtons', JSON.stringify(updatedButtons));
    axios.put(`${API_URL}update-chore-permission`, {
      username,
      group_id: groupId,
      user_to_update: userToUpdate,
      can_modify_chore: canModify,
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

  // ---------- Page Content ----------
  return (
    <View style={styles.content}>
      <FlatList
        style={[styles.membersList, styles.manageGroupMembersList]}
        data={members}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => {
          const currentPermission = selectedButtons[item.username] || `${item.username}-edit`; // default edit if never changed -NN
          return (
            <View style={styles.manageMemberItem}>
              <Text style={styles.memberName}>{item.display_name}</Text>
              {item.username !== username && (
                <>
                  <View style={styles.permissionButtonContainer}>
                    <TouchableOpacity
                      style={[styles.permissionButton, currentPermission === `${item.username}-edit` && { backgroundColor: theme.main }]}
                      onPress={() => handlePermissionUpdate(item.username, true)}
                    >
                      <Ionicons name="pencil" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.permissionButton, currentPermission === `${item.username}-view` && { backgroundColor: theme.main }]}
                      onPress={() => handlePermissionUpdate(item.username, false)}
                    >
                      <Ionicons name="eye" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemoveMember(item.username)}
                  >
                    <Ionicons name="close-outline" size={35} color="white" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={styles.disbandGroupButton}
        activeOpacity={0.8}
        onPress={() => handleDisbandGroup()}
      >
        <Ionicons name={"trash"} size={28} color={theme.white} />

        <Text style={styles.manageGroupButtonText}> Disband Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageScreen;
