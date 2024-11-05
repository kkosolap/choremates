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
    // basic text
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
    registerHeader: {
      //height: 60,
      width: 400,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -40,

      fontSize: 30,
      fontWeight: 'bold',
      color: theme.text1,
      marginBottom: 30,
    },
    backButton: {
      padding: 8,
      position: 'absolute',
      left: 2, // units from the left
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
      borderColor: theme.text3, 
      borderWidth: 1,
      padding: 5,
      flex: 1,
      marginRight: 10,
      borderRadius: 10,
      color: theme.text1,
    },
    taskText: {
      fontSize: 18,
      color: theme.text1,
      marginLeft: 5,
    },
    taskTextCompleted: {
      textDecorationLine: 'line-through',
      color: theme.gray, 
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
      marginTop: 40,
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

    // add chore / chore details forms  -MH
    formContainer: {
      width: '95%',
      alignItems: 'flex-start',
    },
    centeredContent: {
      alignItems: 'center',
      width: '100%',
    },
    label: {
      fontSize: 18,
      color: theme.text1,
      fontWeight: '600', // semi-bold
      marginBottom: 5,
    },
    input: {
      width: '100%',
      padding: 8,
      borderWidth: 1,
      borderColor: theme.lighter,
      borderRadius: 10,
      marginBottom: 20,
      fontSize: 16,
      color: theme.text1, // color when typing
    },
    smallerInput: {
      width: '87%',
      padding: 8,
      borderWidth: 1,
      borderColor: theme.lighter,
      borderRadius: 10,
      fontSize: 16,
      color: theme.text1, // color when typing
    },
    inputAndButton: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: 20,
    },
    inputButtonContainer: {
      width: '13%',
      justifyContent: 'center',
      alignItems: 'flex-end', // align to the right
    },
    dropdown: {
      width: '100%',
      padding: 9,
      borderWidth: 1,
      borderColor: theme.lighter,
      borderRadius: 10,
      marginBottom: 20,
    },
    dropdownText: {
      fontSize: 16,
      color: theme.text1,
    },
    taskList: {
      width: '100%',
      marginBottom: 10,
    },
    bulletAndTask: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginLeft: 5,
    },
    newChoreDeleteTask: {
      position: 'absolute',
      right: 15,
    },
    taskItem: {
      fontSize: 16,
      marginLeft: 10,
      marginBottom: 2,
      color: theme.text2,
      width: '80%',
    },
    addChoreButton: {
      marginTop: 25,
      width: '80%',
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.main,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addChoreButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 20,
    },
    deleteChoreButton: {
      marginTop: 50,
      width: '80%',
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.red,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Settings.js styles (for Profile/Settings page) -VA
    // Width/heights/margins may need to be changes to be device reliant so it will suit all devices
    profileContainer:{
      flexGrow: 1,
      width: 350,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 20,         // Optional: Add some space at the top
      paddingBottom: 100,
    },
    profileTopSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 75,        // Profile + name are off center
    },
    profilePictureArea: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: theme.lighter,
      marginRight: 75,
      marginLeft: 75,         // Profile + name are off center bc names are usually long -VA
      overflow: 'visible',    // Crop any overflow for circular shape
    },
    profilePicturePhoto: {
      width: '100%',
      height: '100%',
      borderRadius: 100,
    },
    profileDisplayNameText: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#5c5c5c',
    },
    profileUsernameText: {
      fontSize: 18,
      color: theme.gray,
    },
    profilePhotoEditButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 50,
      padding: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingsPadding: {
      paddingBottom: 20,
    },
    themeIconContainer: {
      width: 400,
      flexDirection: 'row',
      alignItems: 'left',
      justifyContent: 'center',
      paddingRight: 100,
    },  




    setProfileIcon: {
      width: 80, // Width of the button
      height: 80, // Height of the button
      borderRadius: 40, // Makes the button circular
      overflow: 'hidden', // Ensures the image is clipped to the button shape
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,

    },
    pfpImage: {
      width: 80, // Ensures the image covers the button area
      height: 80, // Ensures the image covers the button area
      resizeMode: 'cover', // Keeps the image aspect ratio
      
    },

    pfpIconContainer: {
      flexDirection: 'row', 
      flexWrap: 'wrap',
      justifyContent: 'space-around', 
      width: '85%',
    },
    pfpContainer: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center'
    },


    notificationContainer: {
      flexDirection: 'column',
      alignItems: 'left',
      justifyContent: 'center',
      paddingLeft: 15,
    },
    buttonSection: {
      padding: 5,
      paddingLeft: 25,
      paddingRight: 25,
    },
    buttonArea: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
    },
    iconArea: {
      width: 50, 
      height: 50, 
      justifyContent: 'center', 
      alignItems: 'center',
    },
    iconStyle: {
      width: 30, 
      height: 30,
    },
    buttonName:  { 
      width: 300, 
      fontSize: 20, 
      color: 'black', 
      marginLeft: 20,
    },
  });
};

export default createStyles;
