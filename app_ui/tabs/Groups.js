// Groups.js

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Popover from 'react-native-popover-view';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import colors from '../style/colors';
import createStyles from '../style/styles';
import { API_URL } from '../config';
import { TabHeader } from '../components/headers';
import { LoadingVisual } from '../components/placeholders.js';
import { useTheme } from '../contexts/ThemeProvider.js';
import { useGroupThemes } from '../contexts/GroupThemeProvider';


// groups screen & invite button - NN
const GroupsScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const [username, setUsername] = useState(null);
  const [hasInvitations, setHasInvitations] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const getUsername = async () => {   // get the username from securestore -KK
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.error("UI Member.js: Username not found in SecureStore.");
      }
    };
    getUsername();
  }, []);

  // if invitation received, button turns red -NN
  useFocusEffect(
    React.useCallback(() => {
      const fetchPendingInvitations = async () => {
        if (!username) return;
        try {
          const response = await axios.get(`${API_URL}get-received-invite`, {
            params: { username: username }
          });
          setHasInvitations(response.data.length > 0);
        } catch (error) {
          console.error("Error fetching pending invitations:", error);
        }
      };

      fetchPendingInvitations();
    }, [username])
  )
  const handleMailPress = () => {
    navigation.navigate('GroupInvitations', { username });
  };
  
  return (
    <View style={styles.screen}>
      <TabHeader title="Groups" />
      <TouchableOpacity // invite button red when received invitation -NN
        onPress={handleMailPress}
        style={[
          styles.mailButton,
          hasInvitations && { backgroundColor: theme.red }
        ]}
      >
        <Icon name="mail" size={25} color="#fff" />
      </TouchableOpacity>

      <GroupsDisplay />

    </View>
  );
};

// show all groups and create group button -NN
const GroupsDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { groupThemes, changeGroupTheme } = useGroupThemes();

  const navigation = useNavigation();
  const [username, setUsername] = useState(null);
  const [groups, setGroups] = useState([]);

  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const popoverButtonRef = useRef(null);
  const [groupSizes, setGroupSizes] = useState({});

  const [loading, setLoading] = useState(true); 

  const fetchGroups = async (username) => {
    try {
      setLoading(true); // Start loading state
  
      // Fetch all groups for the user
      const response = await axios.post(`${API_URL}get-all-groups-for-user`, {
        username: username,
      });
      const groups = response.data;
      setGroups(groups);
  
      // Fetch group sizes for all groups concurrently
      const groupSizePromises = groups.map((group) =>
        axios
          .get(`${API_URL}get-group-size`, { params: { group_id: group.group_id } })
          .then((groupSizeResponse) => ({
            groupId: group.group_id,
            memberCount: groupSizeResponse.data.member_count,
          }))
      );
  
      // Wait for all group size requests to complete
      const groupSizes = await Promise.all(groupSizePromises);
  
      // Update state with all group sizes at once
      const updatedGroupSizes = groupSizes.reduce((acc, { groupId, memberCount }) => {
        acc[groupId] = memberCount;
        return acc;
      }, {});
      setGroupSizes(updatedGroupSizes);
  
    } catch (error) {
      console.error("Error fetching groups:", error);
      Alert.alert(error.response?.data?.error || "An error occurred");
    } finally {
      // Set loading to false only after everything is done
      setLoading(false);
    }
  };

  // fetch username and group
  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
        fetchGroups(storedUsername);
      } else {
        console.error("GroupsDisplay: Username not found in SecureStore.");
      }
    };
    getUsername();
  }, []);
  
  const handleEllipsisPress = (group, event) => {
    event.stopPropagation(); // prevents triggering navigation
    setSelectedGroup(group);
    setPopoverVisible(true);
  };

  // Function to handle color change -VA
  const handleColorChange = async (newColor) => {
    if (selectedGroup && username) {
      await updateGroupColor(username, selectedGroup.group_id, newColor);
    }
    setPopoverVisible(false);
  };

  const updateGroupColor = async (username, groupId, newColor) => {
    try {
      changeGroupTheme(username, groupId, newColor);
    } catch (error) {
      console.error("Error updating group color:", error);
      Alert.alert("Error", "An error occurred while updating the group color.");
    }
  };

  // update when focused
  useFocusEffect(
    useCallback(() => {
      if (username) {
        fetchGroups(username);
      }
    }, [username])
  );

  return (
    <View style={styles.content}>
      {loading ? (
        <LoadingVisual />
      ) : (
        <>
        <View style={styles.groupDisplayContent}>
          {/* If there are no groups - NN */}
          {groups.length === 0 ? (
            <Text style={styles.noGroupsText}>Create or Join a Group to View Groups</Text>
          ) : (
            <FlatList
              data={groups}
              keyExtractor={(item) => item.group_id.toString()}
              renderItem={({ item }) => {
                const groupSize = groupSizes[item.group_id];
                // Default to theme's color (for new groups that need to be initialized)
                const styles = createStyles(groupThemes[item.group_id] || theme);

                
                return (
                  <TouchableOpacity
                    style={styles.groupItem}
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('Members', {
                        groupName: item.group_name,
                        groupId: item.group_id,
                        username: username,
                      })
                    }
                  >
                    {/* Group Item */}
                    <View>
                      <Text style={styles.groupName}>{item.group_name}</Text>
                      <Text style={styles.groupSize}>{`${groupSize} members`}</Text>
                    </View>

                    {/* Ellipsis Button */}
                    <TouchableOpacity
                      onPress={(event) => handleEllipsisPress(item, event)}
                      style={styles.groupColorPicker}
                    >
                      <Icon name="ellipsis-vertical" size={28} />
                    </TouchableOpacity>

                    {/* Popover Menu */}
                    {selectedGroup && selectedGroup.group_id === item.group_id && (
                      <Popover
                        isVisible={popoverVisible}
                        onRequestClose={() => setPopoverVisible(false)}
                        from={() => popoverButtonRef.current}
                        popoverStyle={styles.popover}
                      >
                        <View style={styles.menuContainer}>
                          <Text style={styles.groupName}>Change Group Color</Text>
                          <View style={styles.iconGrid}>
                            {['blue', 'green', 'pink', 'yellow', 'purple'].map((colorChoice, index) => {
                              const iconColors = {
                                blue: colors.blue.main,
                                green: colors.green.main,
                                pink: colors.pink.main,
                                yellow: colors.yellow.main,
                                purple: colors.purple.main,
                              };
                              
                              const iconColor = iconColors[colorChoice];

                              return (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => handleColorChange(colorChoice)}
                                  style={styles.menuItem}
                                >
                                  <Icon name="brush" size={24} color={iconColor} style={styles.groupColorIcon} />
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      </Popover>
                    )}
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
          )}

          <TouchableOpacity 
            style={styles.createGroupButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <Text style={styles.createGroupButtonText}>+ Create Group</Text>
          </TouchableOpacity>
        </View>
        </>
      )}
    </View>
  );
};

export default GroupsScreen;
