// CreateGroup.js -NN

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import axios from 'axios';

import { API_URL } from '../config.js';
import createStyles from '../style/styles.js';
import { useTheme } from '../contexts/ThemeProvider.js';
import { useGroupThemes } from '../contexts/GroupThemeProvider';
import { ScreenHeader } from '../components/headers.js';

// for creating groups -NN
const CreateGroupScreen = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { changeGroupTheme } = useGroupThemes();

    const navigation = useNavigation();

    const [groupName, setGroupName] = useState('');
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const getUsername = async () => {
            const storedUsername = await SecureStore.getItemAsync('username');
                if (storedUsername) {
                    setUsername(storedUsername);
                } else {
                console.error("CreateGroup.js: Username not found in SecureStore.");
                }
            };
        getUsername();
    }, []);

    const handleCreateGroup = async () => {
        try {
            const response = await axios.post(`${API_URL}create-group`, {
                group_name: groupName,
                username: username,
            });
            // Alert.alert('Group created successfully', `Group ID: ${response.data.group_id}`);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'New group created',
              });
            changeGroupTheme(username, response.data.group_id, theme.name); // set default group color to current theme  -MH
            
            navigation.goBack();
        } catch (error) {
            console.error("Error creating group:", error);
            Toast.show({
                type: 'error',
                text1: 'Error fetching invitations',
                text2: error.response?.data?.error || 'An unexpected error occurred',
              });
        }
    };
    
    const handleGroupNameChange = (text) => {
        if (text.length <= 15) {
            setGroupName(text);
        }
    };

    return (
        <View style={styles.screen}>
            <RegisterHeader title="Enter Group Name" navigation={navigation} />
            <TextInput
                style={styles.groupInviteeInput}
                placeholder="Group Name"
                value={groupName}
                onChangeText={handleGroupNameChange}
                maxLength={15}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleCreateGroup}>
                <Text style={styles.submitButtonText}>Create Group</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateGroupScreen;