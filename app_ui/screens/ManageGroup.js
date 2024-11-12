// ManageGroup.js - NN

import React, { useState } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import Arrow from 'react-native-vector-icons/MaterialIcons';
import Delete from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../style/ThemeProvider.js';
import createStyles from '../style/styles.js';
import { ScreenHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config.js';


const ManageScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { members: initialMembers } = route.params;

  const [members, setMembers] = useState(initialMembers);

  /*const handleDeleteMember = async (username) => {
    // confirmation alert
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${username}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              // make call to delete member
              await axios.delete(`${API_URL}delete-group-member`, {
                data: { username },
              });

              setMembers((prevMembers) => 
                prevMembers.filter((member) => member.username !== username)
              );
            } catch (error) {
              console.error("Error deleting member:", error);
              Alert.alert("Error", "Could not delete the member.");
            }
          }
        }
      ]
    );
  };*/

  return (
    <View style={styles.screen}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backPageButton}>
          <Arrow name="arrow-back" size={25} color="black" />
      </TouchableOpacity> */}

      <ScreenHeader title="Manage Group" navigation={navigation}/>
      
      <FlatList
        data={members}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.manageMemberItem}>
            <Text style={styles.manageMemberName}>{item.username}</Text>
            <TouchableOpacity 
              style={styles.deleteButton} 
              // onPress={() => handleDeleteMember(item.username)}
            >
              <Delete name="close" size={25} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* will need to show all the members along with adding and deleting functionality*/}
    </View>
  );
};

export default ManageScreen;
