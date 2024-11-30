// PresetMenu.js

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../contexts/ThemeProvider.js';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';
import { PresetChoreButton } from '../components/buttons.js';
import AllChores from '../data/presets.js';


// header and page content
const PresetMenuScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      {/*the ScreenHeader component creates the title and back button -MH*/}
      <ScreenHeader title="Chore Presets" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PresetMenuDisplay navigation={navigation} />
      </ScrollView>
    </View>
  );
};

// page content
const PresetMenuDisplay = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);


  //const toggleRotation = () => {
  //  setRotationEnabled(prevState => !prevState); // Toggle rotationEnabled in NewChore.js
  //};

  // ..
  const selectPreset = () => {
    navigation.goBack();
  };


  // ---------- Page Content ----------
  return (
    <View style={styles.content}>
      {AllChores.map((choreCategory, index) => (
        <View
          key={index}
          style={styles.choreCategoryList}
        >
          {/* Title of Chore Category */}
          <Text style={styles.choreCategoryTitle}>
            {choreCategory.name}
          </Text>

          {/* Map over chores in list */}
          {choreCategory.list.map((chore, choreIndex) => (
            <PresetChoreButton
              key={choreIndex}
              choreName={chore.chore_name}
              onClick={selectPreset}
            />
          ))}
        </View>
      ))}
    </View>
  );
};


export default PresetMenuScreen;