// date.js

import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../contexts/ThemeProvider.js';
import createStyles from '../style/styles';

const getOrdinalSuffix = (day) => {
  const j = day % 10,
        k = day % 100;
  if (j === 1 && k !== 11) {
    return day + "st";
  }
  if (j === 2 && k !== 12) {
    return day + "nd";
  }
  if (j === 3 && k !== 13) {
    return day + "rd";
  }
  return day + "th";
};

// Show Today's Date (on Chores tab)  -MH
export const DisplayDate = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  const dayName = daysOfWeek[today.getDay()];
  const calendarDay = today.getDate();
  const calendarMonth = today.toLocaleString('default', { month: 'long' });

  return (
    <View style={styles.dateDisplay}>
      <Text style={styles.dateDisplayText}>
        {dayName},  {calendarMonth} {getOrdinalSuffix(calendarDay)}
      </Text>
    </View>
  );
}