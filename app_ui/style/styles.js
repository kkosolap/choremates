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
      width: 400,
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
    },
    sectionHeading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text1,
      marginBottom: 20,
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    horizontalLine: {
      borderBottomColor: theme.lighter,
      borderBottomWidth: 1,    // thickness of the line
      marginTop: -15,
      marginBottom: 15,
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
      fontWeight: 'bold',
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
      marginTop: 15
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

    //members page -NN
    manageButton: {
      position: 'absolute',
      width: '80%',
      bottom: 120,
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.gray,
      justifyContent: 'center',
      alignItems: 'center',
    },
    manageButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 16,
    },
    backPageButton: {
      padding: 10,
      position: 'absolute',
      top: 60,
      left: 20,
    },

    // invitation - NN
    mailButton: {
      position: 'absolute',
      backgroundColor: theme.gray,
      borderRadius: 20,
      padding: 8,
      top: 70,
      right: 20
    },
    
    // members card - NN
    memberItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      marginVertical: 15,
      borderColor: theme.gray,
      borderWidth: 1,
      borderRadius: 20,
      width: '95%', 
      alignSelf: 'center',
      backgroundColor: theme.lighter,
    },
    memberName: {
      textAlign: 'left',
      fontSize: 25,
      fontWeight: 'bold',
    },
    memberRole: {
      textAlign: 'right',
      fontSize: 20,
    },

    // manage members screen - NN
    manageMemberItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 15,
    },
    manageMemberName: {
      textAlign: 'left',
      fontSize: 25,
      fontWeight: 'bold',
      padding: 20,
      borderColor: theme.gray,
      borderWidth: 1,
      borderRadius: 20,
      width: '70%', 
      backgroundColor: theme.lighter,
    },
    deleteButton: {
      backgroundColor: theme.red,
      padding: 20,
      borderWidth: 1,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    // group invitations screen - NN
    invitationItem: {
      marginVertical: 10,
      padding: 15,
      borderWidth: 1,
      borderColor: theme.gray,
      borderRadius: 8,
    },
    invitationText: {
      fontSize: 16,
      marginBottom: 10,
    },
    invitationButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    acceptButton: {
      backgroundColor: '#0b6623',
      padding: 10,
      borderRadius: 5,
    },
    declineButton: {
      backgroundColor: theme.red,
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: theme.white,
    },
  });
};

export default createStyles;
