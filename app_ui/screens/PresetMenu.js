// PresetMenu.js

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

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

  // extract the setter functions from route params
  //const route = useRoute();
  //const { setChoreName, setSelectedRec } = route.params;

  // upon button click
  /*
  const selectPreset = (name, rec) => {
    setChoreName(name);
    setSelectedRec(rec);
    navigation.goBack();
  };
  */
  const selectPreset = (choreName, recurrence) => {
    navigation.navigate('NewChore', {
      choreName: choreName,
      selectedRec: recurrence,
    });
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
              recurrence={chore.recurrence.label}
              onClick={() => selectPreset(chore.chore_name, chore.recurrence)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};


export default PresetMenuScreen;