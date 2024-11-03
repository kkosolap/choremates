// Manage.js - NN

import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TabHeader } from '../components/headers.js';
import axios from 'axios';
import { API_URL } from '../config';

const ManageScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backPageButton}>
          <Icon name="arrow-back" size={25} color="black" />
      </TouchableOpacity>

      <TabHeader title="Manage Group" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      </ScrollView>

      {/* will need to show all the members along with adding and deleting functionality*/}
    </View>
  );
};

export default ManageScreen;
