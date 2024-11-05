// headers.js

import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';
import themes from '../style/colors';


// Custom header for main TABS (Home, Chores, etc)
export const TabHeader = ({ title }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={styles.tabHeader}>
      <Text style={styles.tabTitle}>{title}</Text>
    </View>
  );
};

// Custom header for screens (Add Chore, etc)
export const ScreenHeader = ({ title, navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screenHeader}>
      {/* GoBack button */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => navigation.goBack()}
      >
        <Text><Icon name="arrow-back" size={35} color={theme.text1} /></Text>
      </TouchableOpacity>
      
      {/* Title */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

// add back button to Register header
export const RegisterHeader = ({ title, navigation }) => {
  //const { theme } = useTheme();
  //const styles = createStyles(theme);
  const styles = createStyles(themes.purple);

  return (
    <View style={styles.registerHeader}>
      {/* GoBack button */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => navigation.goBack()}
      >
        <Text><Icon name="arrow-back" size={35} color={themes.purple.text1} /></Text>
      </TouchableOpacity>
      
      {/* Title */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};