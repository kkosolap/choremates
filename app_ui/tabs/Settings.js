// Settings.js

import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity, Button, ScrollView} from 'react-native';

import axios from 'axios';
import { API_URL } from '../config';

import colors from '../style/colors';
import createStyles from '../style/styles';
import { useTheme } from '../style/ThemeProvider';
import { TabHeader } from '../components/headers.js';
import LogoutButton from '../components/logout'; 
import { Ionicons } from '@expo/vector-icons'; // For an edit icon

const profilePicture = require('../icons/profile_duck.jpg');


// Header and page content
const SettingsScreen = ({ onLogout }) => {
  const { theme, changeTheme } = useTheme();
  const styles = createStyles(theme);

  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState('');

  const [displayName, setDisplayName] = useState('');

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
                        // ?id=2
        const response = await axios.get(`${API_URL}get_users`);

          // set users doesn't get just one user

        setUsers(response.data);
        // console.log(response.data);
        // console.log(users.id)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
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

  // const handleChangeTheme = (color) => {
  //   // Add logic here for changing the theme -VA
  //   // console.log('profile pic edit')
  //   theme.changeTheme(color);
  // };


  // const handleChangeTheme = (themeName) => {
  //   if (theme[themeName]) {
  //     setCurrentTheme(theme[themeName]);
  //   } else {
  //     console.warn(`Theme '${themeName}' does not exist in themes.`);
  //   }
  // };

  // const handleChangeTheme = (color) => {
  //   changeTheme(color); // Call changeTheme directly from useTheme
  // };



  

  const handleLogout = () => {
    onLogout();
  };
  
  return (
    //   <View style={styles.horizontalLine}></View>



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
              <TextInput style={styles.profileDisplayNameText} onChangeText={handleChangeDisplayName}
               >victoria</TextInput>    
               {/* // value={displayName}  */}
              <Text>User Name</Text>
              <Text style={styles.profileUsernameText}>@victoriaayala</Text>
            </View>
          </View>

          {/* Extra space between profile and themes */}

          <View style={styles.settingsPadding}></View>


          {/* Theme Section of Settings */}

          <Text style={styles.sectionHeading}>Themes</Text>
          <View style={styles.horizontalLine}></View>

          {/* Container for Icons */}
          <View style={styles.themeIconContainer}>
          <TouchableOpacity onPress={() => changeTheme('blue')}>
            <Ionicons name="color-palette" size={48} color={colors.blue.main} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeTheme('pink')}>
            <Ionicons name="color-palette" size={48} color={colors.pink.main} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeTheme('purple')}>
            <Ionicons name="color-palette" size={48} color={colors.purple.main} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeTheme('green')}>
            <Ionicons name="color-palette" size={48} color={colors.green.main} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeTheme('yellow')}>
            <Ionicons name="color-palette" size={48} color={colors.yellow.main} />
          </TouchableOpacity>

          </View>

          {/* Extra space between themes and notifications */}

          <View style={styles.settingsPadding}></View>


          {/* Theme Section of Settings */}

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

          {/* Logout Button Display */}

          <LogoutButton onLogout={onLogout} />

        </ScrollView>

      
      {/* Log out should be changed to warn ab log out first, then confirm it */}
    </View>



/* <ScrollView contentContainerStyle={styles.profileContent}>
  <TabHeader title="Settings" />

  <View style={styles.profileContent}>
    <Text style={styles.settingHeadingTitles}>Profile</Text>
    <View style={styles.horizontalLine}></View>
    <View style={styles.profileTopSection}>
      <View style={styles.profilePictureArea}>
        <Image source={profilePicture} style={styles.profilePicturePhoto} />
        <TouchableOpacity style={styles.profilePhotoEditButton} onPress={handleEditPhoto}>
          <Ionicons name="images" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileTextContainer}>
        <Text style={styles.profileDisplayNameText}>Victoria</Text>
        <Text style={styles.profileUsernameText}>@victoriaayala</Text>
      </View>
    </View>
  </View>

  <View style={styles.logoutButtonContainer}>
    <LogoutButton onLogout={onLogout} />
  </View>
</ScrollView> */




  );
};


// // Page content
// const SettingsDisplay = ({ onLogout }) => (
//   <View style={styles.profileContainer}>
//     <SafeAreaView style={styles.profileSafeArea}>
//       <View style={styles.profileTopSection}>
//         <View style={styles.profilePictureArea}>
//           <Image source={profilePicture} style={styles.profilePicturePhoto} />
//         </View>
//         <View style={styles.profileTextContainer}>
//           {/* This needs to be changed to an input text or something that allows it to change upon editing */}
//           <Text style={styles.profileDisplayNameText}>Victoria</Text>
//           <Text style={styles.profileUsernameText}>@victoriaayala</Text>
//           {/* <Button></Button> */}
//         </View>
//       </View>
//     </SafeAreaView>
    
//     <LogoutButton onLogout={onLogout} />
//   </View>
// );

export default SettingsScreen;
