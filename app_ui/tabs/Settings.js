// Settings.js

import React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity, Button, ScrollView} from 'react-native';
import { useState } from 'react';
import colors from '../style/colors';
import styles from '../style/styles';
import { TabHeader } from '../components/headers.js';
import LogoutButton from '../components/logout'; 
import { Ionicons } from '@expo/vector-icons'; // For an edit icon


// After Git Pulling: 
import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';

// const { theme } = useTheme();
// const styles = createStyles(theme);

const profilePicture = require('../icons/profile_duck.jpg');


// Header and page content
const SettingsScreen = ({ onLogout }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [isEditing, setIsEditing] = useState(false);

  const handleEditPhoto = () => {
    setIsEditing(!isEditing);
    // Add logic here for changing the profile photo -VA
    // console.log('profile pic edit')
  };

  const handleChangeTheme = (color) => {
    // Add logic here for changing the theme -VA
    // console.log('profile pic edit')
  };

  const handleChangeDisplayName = (newDisplayName) => {
    // Add logic here for changing the theme -VA
    // console.log('profile pic edit')
  };

  

  const handleLogout = () => {
    onLogout();
  };
  return (
    //   <View style={styles.horizontalLine}></View>



    <View style={styles.content}>
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
              >Victoria</TextInput>
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
            <TouchableOpacity onPress={handleChangeTheme('yellow')}>
              <Ionicons name="color-palette" size={48} color={colors.yellow.main}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleChangeTheme('blue')}>
              <Ionicons name="color-palette" size={48} color={colors.blue.main}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleChangeTheme('purple')}>
              <Ionicons name="color-palette" size={48} color={colors.purple.main} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleChangeTheme('pink')}>
              <Ionicons name="color-palette" size={48} color={colors.pink.main}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleChangeTheme('green')}>
              <Ionicons name="color-palette" size={48} color={colors.green.main}  />
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
