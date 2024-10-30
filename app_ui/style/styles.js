// styles.js

import { StyleSheet } from 'react-native';

// function to create styles based on the theme  -MH
const createStyles = (theme) => {
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
    backgroundColor: theme.lighter,
  };
  const baseChoreTitle = {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text1,
    width: '75%',
    height: 'auto',
    flexShrink: 1,
    flexGrow: 1,
    //textAlignVertical: 'center',
    lineHeight: 28,
    paddingVertical: 0,
    marginVertical: 0,
  }

  // all styles  -MH
  return StyleSheet.create({
    // text
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: theme.text1,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text2,
    },

    // whole screen  -MH
    screen: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // main content of a page  -MH
    content: {
      flex: 1,
      width: 390,
      alignItems: 'center',   // Horizontally center content
      justifyContent: 'flex-start',  // Start content at the top
      paddingTop: 30,  // Optional: Add some space at the top
      paddingBottom: 100,
    },
    scrollContainer: {
      paddingVertical: 0,
    },

    // page sections -MH
    contentSection: {
      marginTop: 40,
      width: '90%',
      alignItems: 'center',
    },
    sectionHeading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text1,
      marginBottom: 5,
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    horizontalLine: {
      borderTopColor: theme.lighter,
      borderTopWidth: 1,
      width: '100%',
      height: 0,
      padding: 0,
      marginBottom: 15,
    },
    horizontalLineNoSpace: {
      borderTopColor: theme.lighter,
      borderTopWidth: 1,
      width: '100%',
      height: 0,
      padding: 0,
      margin: 0,
    },
    spacer: {
      height: 10,
      width: '100%',
  },

    // tab icons  -MH
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    focusedBox: {
      borderWidth: 2,
      borderColor: theme.main,
      backgroundColor: theme.main,
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
      fontWeight: '800',  // extra bold
      color: theme.text1,
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
      backgroundColor: theme.main,
    },
    buttonDescription: {
      fontSize: 16,
      marginTop: 8
    },

    // chore block  -MH
    choreBlock: baseChoreBlock,
    choreBlockCompleted: {
      ...baseChoreBlock,
      backgroundColor: theme.desaturated,
    },
    homeChoreBlock: {
      ...baseChoreBlock,
      backgroundColor: theme.lightest,
      borderColor: theme.lighter,
      borderWidth: 3,
    },
    choreCheck: {
      position: 'absolute', // position it absolutely within the header
      left: 15, // distance from the right edge
      top: 20, // distance from the top edge
      zIndex: 1, // ensure it's above other elements
    },
    choreTitle: baseChoreTitle,
    choreTitleCompleted: {
      ...baseChoreTitle,
      color: theme.text3,
      textDecorationLine: 'line-through',  // Adds a strikeout effect
    },
    homeChoreTitle: {
      ...baseChoreTitle,
      marginTop: 5,
      marginBottom: 5,
      fontSize: 20,
      width: '85%',
      height: 'auto',
    },
    recurrenceLabel: {
      marginBottom: 5,
      fontSize: 17,
      fontWeight: '300',
      color: theme.text2,
      width: '85%',
      height: 'auto',
    },
    editChoreButton: {
      position: 'absolute', // position it absolutely within the header
      right: 15, // distance from the right edge
      top: 20, // distance from the top edge
      zIndex: 1, // ensure it's above other elements
    },
    choresList: {
      flex: 1,
      width: 390,
      alignItems: 'center',   // Horizontally center content
      justifyContent: 'flex-start',  // Start content at the top
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
      borderColor: theme.gray, 
      borderWidth: 1,
      padding: 5,
      flex: 1,
      marginRight: 10,
      borderRadius: 10,
    },
    taskText: {
      fontSize: 18,
      color: theme.text1,
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

    //sign in -NN
    signinContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    signinTitle: {
      fontSize: 30,
      fontWeight: 'bold',
      color: theme.text1,
      marginBottom: 30,
    },
    signinInput: {
      width: '80%',
      height: 50,
      borderColor: theme.gray,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    signinButton: {
      width: '80%',
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.main,
      justifyContent: 'center',
      alignItems: 'center',
    },
    signinButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 16,
    },

    //logout -NN
    logoutButton: {
      width: '80%',
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.red,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 500,
    },
    
    logoutButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 16,
    },

    //register -NN
    registerButton: {
      marginTop: 20,
    },
    registerButtonText: {
      color: theme.main,
      fontSize: 16,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    password: {
      color: theme.gray,
      fontSize: 13,
      marginBottom: 20,
      width: '90%',
      alignSelf: 'center',
      textAlign: 'center',
    },
  });
};

export default createStyles;
