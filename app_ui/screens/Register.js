// Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios'; // Make sure axios is installed
import styles from '../style/styles';
import { API_URL } from '@env'; // Import your API URL

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}register`, { username, password });
      Alert.alert('Success', response.data.message);
      navigation.navigate('Sign in');
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.signinContainer}>
        <Text style={styles.signinTitle}>Register</Text>

        <TextInput
            style={styles.signinInput}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
        />

        <TextInput
            style={styles.signinInput}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.signinButton} onPress={handleRegister}>
            <Text style={styles.signinButtonText}>Register</Text>
        </TouchableOpacity>
    </View>
  );
};

export default Register;
