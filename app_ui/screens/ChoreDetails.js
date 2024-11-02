// ChoreDetails.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';
import showHelloPopup from '../components/hello.js';


// header and page content
const ChoreDetailsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Chore Details" navigation={navigation} />
      <ChoreDetailsDisplay navigation={navigation} />
    </View>
  );
};

// page content
const ChoreDetailsDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const route = useRoute();
  const { choreName, tasks } = route.params;  // Get chore name from parameters

  return (
    <View style={styles.content}>

      {/* chore name (text entry) */}
      {/* room tag (drop down) */}
      {/* starting week (drop down) */}
      {/* recurrence (drop down) */}
      {/* assign to (drop down) */}
      {/* steps (text entry) */}

      {/* ***change so this is default text in an editable form*** */}
      <Text style={styles.subtitle}>{choreName}</Text>

      <View style={styles.spacer}></View>
      <View style={styles.horizontalLine}></View>
      <View style={styles.spacer}></View>

      {tasks.map(({ id, task }) => (
        <View key={id} style={styles.taskContainer}>
          <View style={styles.taskAndCheck}>

            {/* task text */}
            <Text style={styles.taskText}>{task}</Text>
          </View>

        </View>
      ))}


      {/* DELETE Button */}
      <View style={styles.centeredContent}>
        <TouchableOpacity
          style={styles.deleteChoreButton}
          onPress={showHelloPopup}
          activeOpacity={0.8}
        >
          <Text style={styles.addChoreButtonText}>Delete Chore</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default ChoreDetailsScreen;