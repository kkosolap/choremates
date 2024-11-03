// GroupInvitations.js

import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TabHeader } from '../components/headers.js';
import axios from 'axios';
import { API_URL } from '../config';

const GroupInvitations = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backPageButton}>
          <Icon name="arrow-back" size={25} color="black" />
      </TouchableOpacity>

      <TabHeader title="Group Invitations" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      </ScrollView>

      {/* will need to show all group invitations with an accept and decline option */}
    </View>
  );
};

export default GroupInvitations;
