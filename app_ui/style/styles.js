// styles.js
import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lighterBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  text: {
    color: '#fff',
    marginTop: 20,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  tabHeader: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  tabTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Space below the header
  },
  backButton: {
    padding: 8, // Add padding for the touchable area
  },
});

export default styles;
