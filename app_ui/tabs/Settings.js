// Settings.js

import React, { useState, useCallback } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // For an edit icon
import * as SecureStore from 'expo-secure-store';

import colors from '../style/colors';
import createStyles from '../style/styles';
import LogoutButton from '../components/logout'; 
import { TabHeader } from '../components/headers.js';
import { useTheme } from '../style/ThemeProvider';
import { useLogout } from '../style/LogOutProvider';

import axios from 'axios';
import { API_URL } from '../config';

// Header and page content
const SettingsScreen = () => {
  const avatarMap = {
    duck: require('../icons/duck.jpg'),
    pinkAvatar: require('../icons/pinkAvatar.jpg'),
    blueAvatar: require('../icons/blueAvatar.jpg'),
    purpleAvatar: require('../icons/purpleAvatar.jpg'),
    greenAvatar: require('../icons/greenAvatar.jpg'),
    yellowAvatar: require('../icons/yellowAvatar.jpg'),

    pinkCat: require('../icons/cat_pink.jpg'),
    blueBee: require('../icons/bee_blue.jpg'),

    blueSlug: require('../icons/slug_blue.jpg'),
    bluePig: require('../icons/pig_blue.jpg'),

    purpleRabbit: require('../icons/rabbit_purple.jpg'),
    purpleMouse: require('../icons/mouse_purple.jpg'),
    purpleSheep: require('../icons/sheep_purple.jpg'),
    purpleFox: require('../icons/fox_purple.jpg'),

    greenDog: require('../icons/dog_green.jpg'),
    greenDuck: require('../icons/duck_green.jpg'),

    yellowFrog: require('../icons/frog_yellow.jpg'),

    orangeDino: require('../icons/dino_orange.jpg'),
    orangeTurtle: require('../icons/turtle_orange.jpg'),

  };
  
  const { theme, changeTheme } = useTheme();
  const styles = createStyles(theme);
  const handleLogout = useLogout();
  const [display_name, setDisplayName] = useState('');
  const [profile_pic, setProfilePic] = useState('');
  const [username, setUsername] = useState(null);
  const navigation = useNavigation(); // get the navigation object

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
        console.log("UI Settings.js: Error changing display name.");
      }
  };

  const openChangeProfilePic = () => {
    navigation.navigate('ChangeProfilePic');
  };

  return (
    <View style={styles.screen}>
      <TabHeader title="Settings" />
        <ScrollView contentContainerStyle={styles.profileContainer}>

          {/* Profile Section of Settings*/}
          <Text style={styles.sectionHeading}>Profile</Text>

          <View style={styles.horizontalLine}></View>

          {/* Profile Picture */}
          <View style={styles.profileTopSection}>
            <View style={styles.profilePictureArea}>
              <Image 
                source={profile_pic && avatarMap[profile_pic] ? avatarMap[profile_pic] : avatarMap.duck} 
                style={styles.profilePicturePhoto} 
              />
              <TouchableOpacity style={styles.profilePhotoEditButton} 
                onPress={openChangeProfilePic}>  
                <Ionicons name="images" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Display Name and User Name */}
          <View style={styles.profileNameSection}>
            <View >
              <Text style={{ color: '#858585' }}>Display Name</Text>
              <TextInput 
                style={styles.profileDisplayNameText} 
                value={display_name} 
                onChangeText={setDisplayName} 
                onSubmitEditing={handleChangeDisplayName} 
                maxLength={16} 
                scrollEnabled={false}
              />
              <Text style={{ color: '#858585' }}>User Name</Text>
              <Text style={styles.profileUsernameText}> @{username}</Text>
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
            <LogoutButton onLogout={handleLogout} />
            {/* Log out should be changed to warn ab log out first, then confirm it */}
        </ScrollView>
    </View>
  );
};

export default SettingsScreen;