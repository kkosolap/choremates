// Signin.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import themes from '../style/colors';

import { API_URL } from '../config';
import axios from 'axios'; 

const Signin = ({ onSignin }) => {
  // const { theme } = useTheme();
  const styles = createStyles(themes.purple);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSignin = async () => {
    try {
      const response = await axios.post(`${API_URL}login`, { username, password });
      const token = response.data.token;
      await SecureStore.setItemAsync('token', token); // Store the token securely
      await SecureStore.setItemAsync('username', username); // Store username securely
      onSignin(username); // Update the logged-in state
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.signinContainer}>
      <Text style={styles.signinTitle}>Sign in</Text>

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

      <TouchableOpacity style={styles.signinButton} onPress={handleSignin}>
        <Text style={styles.signinButtonText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signin;