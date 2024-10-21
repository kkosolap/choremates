// Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../style/styles';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // registration logic
    console.log('Registering user:', username, password);
    navigation.navigate('Sign in');
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

        <Text style={styles.password}>
        Must contain at least 8 characters and include at least 1 uppercase letter, 1 number
        </Text>

        <TouchableOpacity style={styles.signinButton} onPress={handleRegister}>
            <Text style={styles.signinButtonText}>Register</Text>
        </TouchableOpacity>
    </View>
  );
};

export default Register;
