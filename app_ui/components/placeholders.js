// placeholders.js

import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../contexts/ThemeProvider';
import createStyles from '../style/styles';
import themes from '../style/colors';


// Show while pages are loading
export const LoadingVisual = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={styles.loadingContainer}>
      {/* loading */}
      <ActivityIndicator
        size="large"
        color={theme.main}
      />

      <View style={styles.spacer}></View>
      <View style={styles.spacer}></View>

      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};