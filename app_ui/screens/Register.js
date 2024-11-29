// Register.js - NN

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import createStyles from '../style/styles';
import themes from '../style/colors';
import { RegisterHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config';


const Register = ({ navigation }) => {
  const styles = createStyles(themes.purple);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // post request to server for registration integrated by EL
    try {
      console.log('API_URL:', API_URL);
      const response = await axios.post(`${API_URL}register`, { username, password });
      Alert.alert('Success', response.data.message);
      navigation.navigate('Sign in');
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert(error.response.data.error);
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

        <TouchableOpacity
          style={styles.signinButton}
          activeOpacity={0.8}
          onPress={handleRegister}
        >
            <Text style={styles.signinButtonText}>Register</Text>
        </TouchableOpacity>
    </View>
  );
};

export default Register;
