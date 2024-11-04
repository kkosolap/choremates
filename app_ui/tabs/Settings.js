// Settings.js

import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity, Button, ScrollView} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import colors from '../style/colors';
import createStyles from '../style/styles';
import LogoutButton from '../components/logout'; 
import { TabHeader } from '../components/headers.js';
import { useTheme } from '../style/ThemeProvider';
import { Ionicons } from '@expo/vector-icons'; // For an edit icon

import axios from 'axios';
import { API_URL } from '../config';

const profilePicture = require('../icons/profile_duck.jpg');

// Header and page content
const SettingsScreen = ({ onLogout }) => {
  const { theme, changeTheme } = useTheme();
  const styles = createStyles(theme);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const getUsername = async () => {   // get the username from securestore -KK
      const username = await SecureStore.getItemAsync('username');
      if (username) {
        setUsername(username);
        try {
          const response = await axios.post(`${API_URL}get_display`, { username });
          setDisplayName(response.data[0]?.display_name);
        } catch (error) {
          console.error("UI Settings.js: Error loading display:", error);
        }
      } else {
        console.error("UI Settings.js: Username not found in SecureStore.");
      }
    };
    getUsername();
  }, []);
  
  const handleChangeDisplayName = (newDisplayName) => {
    // Add logic here for changing the theme -VA
    // console.log('profile pic edit')
  };

  const handleEditPhoto = () => {
    setIsEditing(!isEditing);
    // console.log(process.env.API_URL);

    // Add logic here for changing the profile photo -VA
    // console.log('profile pic edit')
  };

  return (
    <View style={styles.screen}>
      <TabHeader title="Settings" />
        <ScrollView contentContainerStyle={styles.profileContainer}>

          {/* Profile Section of Settings*/}
          <Text style={styles.sectionHeading}>Profile</Text>
          <View style={styles.horizontalLine}></View>
            <View style={styles.profileTopSection}>
              <View style={styles.profilePictureArea}>
                <Image source={profilePicture} style={styles.profilePicturePhoto} />
                <TouchableOpacity style={styles.profilePhotoEditButton} onPress={handleEditPhoto}>
                  <Ionicons name="images" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileTextContainer}>
                <Text>Display Name</Text>
                <TextInput 
                  style={styles.profileDisplayNameText} onChangeText={handleChangeDisplayName}>
                  {displayName}
                </TextInput>    
                {/* // value={displayName}  */}
                <Text>User Name</Text>
                <Text style={styles.profileUsernameText}>{username}</Text>
              </View>
            </View>

            {/* Extra space between profile and themes */}
            <View style={styles.settingsPadding}></View>

            {/* Theme Section of Settings */}
            <Text style={styles.sectionHeading}>Themes</Text>
            <View style={styles.horizontalLine}></View>
            {/* Container for Icons */}
            <View style={styles.themeIconContainer}>
              <TouchableOpacity onPress={() => changeTheme(username, 'blue')}>
                <Ionicons name="color-palette" size={48} color={colors.blue.main} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeTheme(username, 'pink')}>
                <Ionicons name="color-palette" size={48} color={colors.pink.main} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeTheme(username, 'purple')}>
                <Ionicons name="color-palette" size={48} color={colors.purple.main} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeTheme(username, 'green')}>
                <Ionicons name="color-palette" size={48} color={colors.green.main} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeTheme(username, 'yellow')}>
                <Ionicons name="color-palette" size={48} color={colors.yellow.main} />
              </TouchableOpacity>
            </View>

            {/* Extra space between themes and notifications */}
            <View style={styles.settingsPadding}></View>

            {/* Notification Section of Settings */}
            <Text style={styles.sectionHeading}>Notifications</Text>
            <View style={styles.horizontalLine}></View>
            <View style={styles.notificationContainer}>
              {/* Currently doesn't account for any onPress actions needed */}
              <TouchableOpacity style={styles.buttonSection}>
                <View style={styles.buttonArea}>
                  <View style={styles.iconArea}>
                    <Ionicons name="notifications" size={48} color={theme.main} />
                  </View>
                    <Text style={styles.buttonName}> Notification Setting 1 </Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSection}>
                <View style={styles.buttonArea}>
                  <View style={styles.iconArea}>
                    <Ionicons name="calendar" size={48} color={theme.main} />
                  </View>
                    <Text style={styles.buttonName}> Notification Setting 2 </Text>
                  </View>
                <View style={styles.sp}></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSection}>
                <View style={styles.buttonArea}>
                  <View style={styles.iconArea}>
                    <Ionicons name="alarm" size={48} color={theme.main} />
                  </View>
                    <Text style={styles.buttonName}> Notification Setting 3 </Text>
                  </View>
                <View style={styles.sp}></View>
              </TouchableOpacity>
            </View>
            <View style={styles.horizontalLine}></View>

            {/* Logout Button Display */}
            <LogoutButton onLogout={onLogout} />
            {/* Log out should be changed to warn ab log out first, then confirm it */}
        </ScrollView>
    </View>
  );
};

export default SettingsScreen;