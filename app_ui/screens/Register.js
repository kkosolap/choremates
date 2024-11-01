// Register.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';

import axios from 'axios';
import { API_URL } from '../config';

const Register = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      console.log('API_URL:', API_URL);
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
