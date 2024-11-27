// Members.js -NN

import React, { useState } from 'react';
import { View, Text, FlatList, Alert, Image, TouchableOpacity } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';

import { ScreenHeader } from '../components/headers.js';
import { useTheme } from '../contexts/ThemeProvider.js';
import createStyles from '../style/styles.js';


import axios from 'axios';
import { API_URL } from '../config.js';


// used to reference image paths stored locally
const avatarMap = {
  pinkAvatar: require('../icons/pinkAvatar.jpg'),
  pinkCat: require('../icons/cat_pink.jpg'),
  pinkSheep: require('../icons/sheep_pink.jpg'),
  pinkBear: require('../icons/bear_pink.jpg'),

  yellowAvatar: require('../icons/yellowAvatar.jpg'),
  yellowMouse: require('../icons/mouse_yellow.jpg'),
  yellowFrog: require('../icons/frog_yellow.jpg'),
  yellowTurtle: require('../icons/turtle_yellow.jpg'),

  greenAvatar: require('../icons/greenAvatar.jpg'),
  greenDog: require('../icons/dog_green.jpg'),
  greenDuck: require('../icons/duck_green.jpg'),
  greenRabbit: require('../icons/rabbit_green.jpg'),

  blueAvatar: require('../icons/blueAvatar.jpg'),
  blueSlug: require('../icons/slug_blue.jpg'),
  bluePig: require('../icons/pig_blue.jpg'),
  blueBee: require('../icons/bee_blue.jpg'),

  purpleAvatar: require('../icons/purpleAvatar.jpg'),
  purpleFox: require('../icons/fox_purple.jpg'),
  purplePigeon: require('../icons/pigeon_purple.jpg'),
  purpleDino: require('../icons/dino_purple.jpg'),
};

const MembersScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const route = useRoute();
  const { groupName, username } = route.params;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={`${groupName}`}
        navigation={navigation}
      />

      <MembersDisplay
        navigation={navigation}
        username={username}
      />
    </View>
  );
};

const MembersDisplay = ({ username, navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const route = useRoute();
  const { groupId } = route.params;
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  
  useFocusEffect(
    React.useCallback(() => {
      // fetch members of the group
      const fetchGroupMembers = async () => {
        try {
          const response = await axios.get(`${API_URL}get-group-members`, {
            params: { group_id: groupId }
          });

          //for displaying profile photo
          const membersWithPics = await Promise.all(
            response.data.map(async (member) => {
              try {
                const profilePicResponse = await axios.post(`${API_URL}get-profile`, {
                  username: member.username,
                });
                const profilePic = profilePicResponse.data[0]?.profile_pic;
                return { ...member, profilePic };
              } catch (error) {
                console.error(`Error fetching profile picture for ${member.username}:`, error.message);
                return { ...member, profilePic: null };
              }
            })
          );
          setMembers(membersWithPics);

          // check if user is admin
          const isAdminResponse = await axios.get(`${API_URL}get-is-admin`, {
            params: { username: username, group_id: groupId },
          });

          if (isAdminResponse.data.isAdmin) {
            setIsAdmin(true);
          }
        } catch (error) {
          Alert.alert(error.response.data.error);
        }
      };

      fetchGroupMembers();
    }, [groupId])
)

// manage group button pressed -> managegroup page
  const handleManageGroup = () => {
    navigation.navigate('ManageGroup', {
      members: members,
      username: username,
      groupId: groupId,
    });
  };

  // invite member button pressed -> invitemembers page
  const handleInviteMember = () => {
    navigation.navigate('InviteMember', { groupId });
  };

  // leave group button for members only
  const handleLeaveGroup = () => {
    Alert.alert(
      "Confirm Leave",
      "Are you sure you want to leave this group?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            axios.delete(`${API_URL}leave-group`, {
              data: { username, group_id: groupId },
            })
            .then(() => {
              alert("You have left the group.");
              navigation.navigate('GroupsMain');
            })
            .catch((error) => {
              console.error("Error leaving group: ", error);
              alert("Failed to leave the group.");
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
          style={styles.membersList}
          contentContainerStyle={[styles.centeredContent, styles.memberListPadding]}
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
            <View style={styles.memberItem}>
                {item.profilePic ? (
                  <Image
                    source={
                      avatarMap[item.profilePic]
                        ? avatarMap[item.profilePic]
                        : { uri: item.profilePic }
                    }
                    style={styles.profileImage}
                  />
                ) : (
                  <Text >No Image</Text>
                )}
                <Text style={styles.memberName}>{item.display_name}</Text>
                {item.role === 'admin' ? (
                  <Ionicons name="star" size={28} color={theme.white} />
                // ) : item.role === 'member' ? (
                //   <Ionicons name="eye" size={25} color="white" />
                ) : null}
            </View>
          )}
      />

      {isAdmin && (
        // if admin show invite button
        <TouchableOpacity
          style={styles.inviteButton}
          activeOpacity={0.8}
          onPress={handleInviteMember}
        >
          <Text style={styles.inviteButtonText}>Invite Member</Text>
        </TouchableOpacity>
      )}

      {isAdmin ? (
        // if admin show group button
        <TouchableOpacity
          style={styles.manageGroupButton}
          activeOpacity={0.8}
          onPress={handleManageGroup}
        >
          <Text style={styles.manageGroupButtonText}>Manage Group</Text>
        </TouchableOpacity>
      ) : (
        // if not show leave group
        <TouchableOpacity
          style={styles.leaveGroupButton}
          activeOpacity={0.8}
          onPress={() => {
            handleLeaveGroup();
          }}
        >
          <Text style={styles.manageGroupButtonText}>Leave Group</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MembersScreen;
