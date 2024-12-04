// placeholders.js

import { Text, View, ActivityIndicator } from 'react-native';

import { useTheme } from '../contexts/ThemeProvider';
import createStyles from '../style/styles';

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