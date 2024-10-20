// styles.js
import { StyleSheet } from 'react-native';
import colors from './colors';

// main choreBlock style  -MH
// (written separately so the completed version can inherit the same style)
const baseChoreBlock = {
  justifyContent: 'center',
  alignItems: 'center',
  margin: 10,
  paddingVertical: 10,
  width: '95%',
  minHeight: 55,
  borderRadius: 15,
  backgroundColor: colors.lighterBlue,
};

// all styles  -MH
const styles = StyleSheet.create({
  // text
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.text1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text2,
  },
  taskText: {
    fontSize: 18,
    color: colors.text2,
  },
  katTaskText: {
    fontSize: 16,
    color: colors.text2,
  },

  // whole screen  -MH
  screen: {
    flex: 1,
    backgroundColor: colors.lightestBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // main content of a page  -MH
  content: {
    flex: 1,
    width: 400,
    alignItems: 'center',   // Horizontally center content
    justifyContent: 'flex-start',  // Start content at the top
    paddingTop: 30,  // Optional: Add some space at the top
  },
  scrollContainer: {
    paddingVertical: 0,
  },

  // tab icons  -MH
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

  // page headers  -MH
  tabHeader: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  tabTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.text1,
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

  // circle button  -MH
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

  // chore block  -MH
  choreBlock: baseChoreBlock,
  choreBlockCompleted: {
    ...baseChoreBlock,
    backgroundColor: colors.gray,
  },
  choreTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text1,
    width: '55%',
    height: 'auto',
    flexShrink: 1,
    flexGrow: 1,
    textAlignVertical: 'center',
    lineHeight: 28,
    paddingVertical: 0,
    marginVertical: 0,
  },
  editChoreButton: {
    position: 'absolute', // position it absolutely within the header
    right: 15, // distance from the right edge
    top: 15, // distance from the top edge
    zIndex: 1, // ensure it's above other elements
  },

  // tasks  -MH
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  addTaskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },

  // chores and tasks  -KK
  katChoreContainer: {
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
  katTaskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginLeft: 20,
  },
  katAddTaskContainer: {
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
