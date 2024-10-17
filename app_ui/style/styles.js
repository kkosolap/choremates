// styles.js
import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
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
});

export default styles;
