// logout.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../style/styles';

const LogoutButton = ({ onLogout }) => {
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
      <Text style={styles.logoutButtonText}>Log out</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
