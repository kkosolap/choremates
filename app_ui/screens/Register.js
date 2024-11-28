// Register.js - NN

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';

import themes from '../style/colors';
import createStyles from '../style/styles';
import { API_URL } from '../config';
import { RegisterHeader } from '../components/headers.js';

const Register = ({ navigation }) => {
  const styles = createStyles(themes.purple);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // post request to server for registration integrated by EL
    try {
      console.log('API_URL:', API_URL);
      const response = await axios.post(`${API_URL}register`, { username, password });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User '+ username +' successfully created',
      });
      navigation.navigate('Sign in');
    } catch (error) {
      console.error('Registration Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: error.response?.data?.error || 'An unexpected error occurred.',
      });
    }
  };

  // UI
  return (
    <View style={styles.signinContainer}>
        <RegisterHeader title="Register" navigation={navigation} />

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
