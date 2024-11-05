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
import { useNavigation, useFocusEffect } from '@react-navigation/native';


import axios from 'axios';
import { API_URL } from '../config';

const profilePicture = require('../icons/duck.jpg');

// const duck = require('../icons/duck.jpg');
// const pinkAvatar = require('../icons/pinkAvatar.jpg');
// const blueAvatar = require('../icons/blueAvatar.jpg');
// const purpleAvatar = require('../icons/purpleAvatar.jpg');
// const greenAvatar = require('../icons/greenAvatar.jpg');
// const yellowAvatar = require('../icons/yellowAvatar.jpg');

// Header and page content
const SettingsScreen = ({ onLogout }) => {

  const avatarMap = {
    duck: require('../icons/duck.jpg'),
    pinkAvatar: require('../icons/pinkAvatar.jpg'),
    blueAvatar: require('../icons/blueAvatar.jpg'),
    purpleAvatar: require('../icons/purpleAvatar.jpg'),
    greenAvatar: require('../icons/greenAvatar.jpg'),
    yellowAvatar: require('../icons/yellowAvatar.jpg'),
  };
  
  const { theme, changeTheme } = useTheme();
  const styles = createStyles(theme);
  const [isEditing, setIsEditing] = useState(false);
  const [display_name, setDisplayName] = useState('');
  const [profile_pic, setProfilePic] = useState('');
  const [username, setUsername] = useState(null);
  const navigation = useNavigation(); // get the navigation object


  // useEffect(() => {
  //   const getUsername = async () => {   // get the username from securestore -KK
  //     const username = await SecureStore.getItemAsync('username');
  //     if (username) {
  //       setUsername(username);
  //       try { // get the user's display name and profile picture -KK
  //         const displayResponse  = await axios.post(`${API_URL}get_display`, { username });
  //         const display = displayResponse.data[0]?.display_name;
  //         setDisplayName(display);
          
  //         const profilePicResponse = await axios.post(`${API_URL}get_profile`, { username });

  //         const pfp = profilePicResponse.data[0]?.profile_pic;

  //         if (pfp) {
  //           setProfilePic(pfp); // Set profile picture path
  //         }
  //         // console.log("PFP = "+pfp);
          
  //         console.log("UI Settings.js: display_name and profile_pic are ", display, pfp);
  //         /*try { // load the user's profile picture
  //           console.log("UI Settings.js: Loading profile pic: ", pfp);
  //           setProfilePic(require(`..icons/'${pfp}.jpg`)); // this wont work -KK
  //         } catch (error) {
  //           console.error("UI Settings.js: Error loading profile picture.");
  //         }*/
  //       } catch (error) {
  //         console.error("UI Settings.js: Error loading display:", error);
  //       }
  //     } else {
  //       console.error("UI Settings.js: Username not found in SecureStore.");
  //     }
  //   };
  //   getUsername();
  // }, []);

  useEffect(() => {
    const getUsername = async () => {   
      const username = await SecureStore.getItemAsync('username');
      if (username) {
        setUsername(username);
        try {
          const displayResponse  = await axios.post(`${API_URL}get_display`, { username });
          const display = displayResponse.data[0]?.display_name;
          setDisplayName(display);
          
          const profilePicResponse = await axios.post(`${API_URL}get_profile`, { username });
          const pfp = profilePicResponse.data[0]?.profile_pic;
          
          if (pfp) {
            setProfilePic(pfp); // Set profile picture path
            // console.log("SETTING.js: "+profile_pic); 
          }
  
        } catch (error) {
          console.error("Error loading display or profile picture:", error);
        }
      } else {
        console.error("Username not found in SecureStore.");
      }
    };
    getUsername();
  }, []);
  

  const handleChangeDisplayName = async () => {
    // console.log("UI Settings.js: Updating display name to:", display_name);
    try {
        await axios.post(`${API_URL}update_display`, {username, display_name});
    } catch (error) {
      // console.log("UI Settings.js: Error changing display name.");
    }
  };

  // open navigation to the profile pic window to update picture -VA
  // current error: opens chore pop up for a split second and returns to home
  // changes the user's profile picture -KK
    // const openChangeProfilePic = async () => {
  const openChangeProfilePic = () => {
    navigation.navigate('ChangeProfilePic');
    // console.log("UI Settings.js: Updating profile picture to:", profile_pic);
    /* try {
        await axios.post(`${API_URL}update_profile`, {username, profile_pic});
        try { // load the new profile picture -KK
          setProfilePic(require(`..icons/'${profile_pic}.jpg`));
        } catch (error) {
          console.log("UI Settings.js: Error loading new profile picture.");
        }
    } catch (error) {
      console.log("UI Settings.js: Error changing profile picture.");
    }*/
  };

  return (
    // console.log("IN VIEW: "+profile_pic),
    <View style={styles.screen}>
      <TabHeader title="Settings" />
        <ScrollView contentContainerStyle={styles.profileContainer}>

          {/* Profile Section of Settings*/}
          <Text style={styles.sectionHeading}>Profile</Text>
          <View style={styles.horizontalLine}></View>
            <View style={styles.profileTopSection}>
              <View style={styles.profilePictureArea}>
              {/* <Image 
                source={profile_pic ? { uri: profile_pic } : require('../icons/duck.jpg')} 
                style={styles.profilePicturePhoto} /> */}
              <Image 
              source={profile_pic && avatarMap[profile_pic] ? avatarMap[profile_pic] : avatarMap.duck} 
              style={styles.profilePicturePhoto} 
            />


                {/* <Image 
                source={profilePicture} style={styles.profilePicturePhoto} /> */}
                <TouchableOpacity style={styles.profilePhotoEditButton} 
                  onPress={openChangeProfilePic}>
                    
                  <Ionicons name="images" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileTextContainer}>
                <Text>Display Name</Text>
                <TextInput 
                  style={styles.profileDisplayNameText} 
                  value={display_name} 
                  onChangeText={setDisplayName} 
                  onSubmitEditing={handleChangeDisplayName}
                  
                  // multiline={false}
                  scrollEnabled={false}
                  // numberOfLines={1}

                />

                {/* // value={display_name}  */}
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