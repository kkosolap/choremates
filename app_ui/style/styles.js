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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  taskText: {
    fontSize: 16,
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
    paddingTop: 30,  // Optional: Add some space at the top
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
    marginTop: 60,
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
    marginTop: 60,
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

  // chores and tasks
  choreContainer: {
    width: '100%', 
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'flex-start', 
    borderWidth: 2,
    borderColor: colors.lighterBlue,
    backgroundColor: colors.lighterBlue,
    borderRadius: 10,
    padding: 15,  
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginLeft: 20,
  },
  addTaskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  choreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  editButton: {
    fontSize: 16,
    color: 'blue',
    marginRight: 20,
  },
  deleteButton: {
    fontSize: 16,
    color: 'red',
    marginLeft: 10,
    marginRight: 20,
  },
  addTaskInput: {
    borderColor: colors.gray, 
    borderWidth: 1,
    padding: 5,
    flex: 1,
    marginRight: 10,
  },
});

export default styles;
