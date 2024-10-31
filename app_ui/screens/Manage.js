// Manage.js - NN

import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ManageScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
//   const { members, setMembers } = route.params;

//   const handleDeleteMember = (index) => {
//     const updatedMembers = [...members];
//     updatedMembers.splice(index, 1);
//     setMembers(updatedMembers);
//   };

  return (
    <View style={styles.screen}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backPageButton}>
            <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

      {/* {members.map((member, index) => (
        <View key={index} style={styles.members}>
          <Text style={styles.memberText}>{member.username}</Text>
          <TouchableOpacity onPress={() => handleDeleteMember(index)}>
            <Text style={styles.deleteText}>X</Text>
          </TouchableOpacity>
        </View>
      ))} */}
    </View>
  );
};

export default ManageScreen;
