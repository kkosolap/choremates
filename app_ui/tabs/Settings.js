// Settings.js

import React, { useState, useCallback } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import createStyles from '../style/styles';
import LogoutButton from '../components/logout'; 
import { API_URL } from '../config';
import { TabHeader } from '../components/headers.js';
import { ThemeButton } from '../components/buttons.js';
import { useTheme } from '../contexts/ThemeProvider.js';
import { useLogout } from '../contexts/LogOutProvider';

// header and page content
const SettingsScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TabHeader title="Settings" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SettingsDisplay />
        </ScrollView>
    </View>
  );
};

// page content
const SettingsDisplay = () => {
  const { theme, changeTheme } = useTheme();
  const styles = createStyles(theme);

  const [username, setUsername] = useState(null);
  const [display_name, setDisplayName] = useState('');
  const [profile_pic, setProfilePic] = useState('');

  const handleLogout = useLogout();
  const navigation = useNavigation();

  const avatarMap = {
    pinkAvatar: require('../icons/pinkAvatar.jpg'),
    pinkCat: require('../icons/cat_pink.jpg'),
    pinkSheep: require('../icons/sheep_pink.jpg'),
    pinkBear: require('../icons/bear_pink.jpg'),
  
    yellowAvatar: require('../icons/yellowAvatar.jpg'),
    yellowMouse: require('../icons/mouse_yellow.jpg'),
    yellowFrog: require('../icons/frog_yellow.jpg'),
    yellowTurtle: require('../icons/turtle_yellow.jpg'),
  
    greenAvatar: require('../icons/greenAvatar.jpg'),
    greenDog: require('../icons/dog_green.jpg'),
    greenDuck: require('../icons/duck_green.jpg'),
    greenRabbit: require('../icons/rabbit_green.jpg'),
  
    blueAvatar: require('../icons/blueAvatar.jpg'),
    blueSlug: require('../icons/slug_blue.jpg'),
    bluePig: require('../icons/pig_blue.jpg'),
    blueBee: require('../icons/bee_blue.jpg'),
  
    purpleAvatar: require('../icons/purpleAvatar.jpg'),
    purpleFox: require('../icons/fox_purple.jpg'),
    purplePigeon: require('../icons/pigeon_purple.jpg'),
    purpleDino: require('../icons/dino_purple.jpg'),
  };

  useFocusEffect(
    useCallback(() => {
      const getUsername = async () => {   
        const username = await SecureStore.getItemAsync('username');
        if (username) {
          setUsername(username);
          try { // get the user's display name and pfp -KK
            const displayResponse  = await axios.post(`${API_URL}get-display`, { username });
            const display = displayResponse.data[0]?.display_name;
            setDisplayName(display);
            
            const profilePicResponse = await axios.post(`${API_URL}get-profile`, { username });
            const pfp = profilePicResponse.data[0]?.profile_pic;
            if (pfp) {
              setProfilePic(pfp); // Set profile picture path -VA
            }
          } catch (error) {
            console.error("Error loading display or profile picture:", error);
          }
        } else {
          console.error("Username not found in SecureStore.");
        }
      };
      getUsername();
    }, [])
  );
  
  const handleChangeDisplayName = async () => {
      try {
        await axios.post(`${API_URL}update-display`, {username, display_name});
      } catch (error) {
        console.error("UI Settings.js: Error changing display name:", error);
      }
  };

  const openChangeProfilePic = () => {
    navigation.navigate('ChangeProfilePic');
  };

  const confirmLogout = () => {
    Alert.alert(
      "Log Out",
      "Confirm you want to log out of your account",
      [
        {
          text: "Stay Signed In",
          style: "cancel",
        },
        {
          text: "Log Out",
          onPress: () => {
            handleLogout();
          },
          style: "destructive",       // only displays in iOS -VA
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.content}>

      {/* Profile */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeading}>Profile</Text>
        <View style={styles.horizontalLine}></View>

        {/* Profile Picture */}
        <View style={styles.profilePictureCircle}>
          <Image 
            source={profile_pic && avatarMap[profile_pic] ? avatarMap[profile_pic] : avatarMap.duck} 
            style={styles.profilePicturePhoto} 
          />
          <TouchableOpacity style={styles.profilePhotoEditButton} 
            onPress={openChangeProfilePic}>  
            <Ionicons name="images" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Display Name and User Name */}
        <View style={styles.profileNameSection}>
          <Text style={styles.profileNameLabel}>Display Name</Text>
          <TextInput 
            style={styles.profileDisplayNameText} 
            value={display_name} 
            onChangeText={setDisplayName} 
            onSubmitEditing={handleChangeDisplayName} 
            maxLength={16} 
            scrollEnabled={false}
          />

          <Text style={styles.profileNameLabel}>User Name</Text>
          <Text style={styles.profileUsernameText}> @{username}</Text>
        </View>
      </View>

      {/* Theme */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeading}>Theme</Text>
        <View style={styles.horizontalLine}></View>

        {/* Color Options */}
        <View style={styles.themeIconContainer}>
          <ThemeButton color='pink' user={username}/>
          <ThemeButton color='yellow' user={username}/>
          <ThemeButton color='green' user={username}/>
          <ThemeButton color='blue' user={username}/>
          <ThemeButton color='purple' user={username}/>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeading}>Account</Text>
        <View style={styles.horizontalLine}></View>

        <LogoutButton onLogout={confirmLogout} />
      </View>
    </View>
  );
};

export default SettingsScreen;