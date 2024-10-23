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
    paddingBottom: 100,
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
  choreCheck: {
    position: 'absolute', // position it absolutely within the header
    left: 15, // distance from the right edge
    top: 20, // distance from the top edge
    zIndex: 1, // ensure it's above other elements
  },
  choreTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text1,
    width: '75%',
    height: 'auto',
    flexShrink: 1,
    flexGrow: 1,
    //textAlignVertical: 'center',
    lineHeight: 28,
    paddingVertical: 0,
    marginVertical: 0,
  },
  editChoreButton: {
    position: 'absolute', // position it absolutely within the header
    right: 15, // distance from the right edge
    top: 20, // distance from the top edge
    zIndex: 1, // ensure it's above other elements
  },

  // tasks  -MH
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '82%',
    marginBottom: 4,
  },
  addTaskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '82%',
    marginTop: 8,
    marginBottom: 8,
  },
  addTaskInput: {
    borderColor: colors.gray, 
    borderWidth: 1,
    padding: 5,
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
  },
  taskText: {
    fontSize: 18,
    color: colors.text1,
    marginLeft: 5,
  },
  taskCheck: {
    marginTop: 3,
  },
  taskAndCheck: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});

export default styles;
