// Settings.js

import React, { useState, useCallback } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import colors from '../style/colors';
import createStyles from '../style/styles';
import LogoutButton from '../components/logout'; 
import { TabHeader } from '../components/headers.js';
import { SettingsButton, ThemeButton } from '../components/buttons.js';
import { useTheme } from '../style/ThemeProvider';
import { useLogout } from '../style/LogOutProvider';

import axios from 'axios';
import { API_URL } from '../config';

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
    blueAvatar: require('../icons/blueAvatar.jpg'),
    purpleAvatar: require('../icons/purpleAvatar.jpg'),
    greenAvatar: require('../icons/greenAvatar.jpg'),
    yellowAvatar: require('../icons/yellowAvatar.jpg'),
    pinkCat: require('../icons/cat_pink.jpg'),
    pinkBee: require('../icons/bee_pink.jpg'),
    blueSlug: require('../icons/slug_blue.jpg'),
    bluePig: require('../icons/pig_blue.jpg'),
    purpleRabbit: require('../icons/rabbit_purple.jpg'),
    purpleMouse: require('../icons/mouse_purple.jpg'),
    pinkSheep: require('../icons/sheep_pink.jpg'),
    purpleFox: require('../icons/fox_purple.jpg'),
    greenDog: require('../icons/dog_green.jpg'),
    greenDuck: require('../icons/duck_green.jpg'),
    yellowFrog: require('../icons/frog_yellow.jpg'),
    yellowTurtle: require('../icons/turtle_yellow.jpg'),
    orangeDino: require('../icons/dino_orange.jpg'),
    orangePigeon: require('../icons/pigeon_orange.jpg'),
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

      {/* Notifications */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeading}>Notifications</Text>
        <View style={styles.horizontalLine}></View>

        <View style={styles.notificationContainer}>
          {/* Currently doesn't account for any onPress actions needed */}
          <SettingsButton
            label="Notification Setting 1"
            iconName="notifications"
            onClick={() => console.log("button 1 clicked")}
          />

          <SettingsButton
            label="Notification Setting 2"
            iconName="calendar"
            onClick={() => console.log("button 2 clicked")}
          />

          <SettingsButton
            label="Notification Setting 3"
            iconName="alarm"
            onClick={() => console.log("button 3 clicked")}
          />
        </View>
      </View>

      {/* Logout */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeading}>Account</Text>
        <View style={styles.horizontalLine}></View>

        <LogoutButton onLogout={handleLogout} />
      </View>
    </View>
  );
};

export default SettingsScreen;