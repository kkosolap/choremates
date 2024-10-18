// styles.js
import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  // text
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
  },

  // whole screen
  screen: {
    flex: 1,
    backgroundColor: colors.lightestBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // main content of a page
  content: {
    flex: 1,
    width: 400,
    alignItems: 'center',   // Horizontally center content
    justifyContent: 'flex-start',  // Start content at the top
    paddingTop: 20,  // Optional: Add some space at the top
  },

  // tab icons
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedBox: {
    borderWidth: 2,
    borderColor: colors.blue,
    backgroundColor: colors.blue,
    borderRadius: 10,
    padding: 5,
  },

  // page headers
  tabHeader: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  tabTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  screenHeader: {
    height: 60,
    width: 400,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  backButton: {
    padding: 8,
    position: 'absolute',
    left: 10, // 10 units from the left
  },

  // circle button
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30, // circular button
    backgroundColor: colors.blue,
  },
  buttonDescription: {
    fontSize: 16,
    marginTop: 8
  },
});

export default styles;
