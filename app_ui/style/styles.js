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
      width: '100%',
      paddingBottom: 50,
    },

    // main content of a page  -MH
    content: {
      flex: 1,
      width: 390,
      alignItems: 'center',
      justifyContent: 'flex-start',  // Start content at the top
      paddingTop: 20,
      paddingBottom: 80,
    },
    scrollContainer: {
      paddingVertical: 0,
      width: '100%',
    },

    // page sections -MH
    contentSection: {
      marginBottom: 25,
      width: '95%',
      alignItems: 'center',
    },
    sectionHeading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text1,
      marginBottom: 5,
      textAlign: 'left',
      alignSelf: 'flex-start',
      paddingLeft: 5,
    },
    horizontalLine: {
      borderTopColor: theme.lighter,
      borderTopWidth: 2,
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

    // date display -MH
    dateDisplay: {
      position: 'absolute',
      top: -5,
    },
    dateDisplayText: {
      fontSize: 18,
      color: theme.text2,
    },

    // circle button  -MH
    circleButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
      height: 60,
      borderRadius: 30, // circular button
      backgroundColor: theme.main,
    },
    buttonDescription: {
      fontSize: 16,
      marginTop: 8,
      color: theme.main,
    },

    // home page chore sections
    groupContentSection: {
      marginTop: 20,
      width: '95%',
      alignItems: 'center',
    },
    groupChoreSectionLabel: {
      flexDirection: 'row', // Align children (text and icon) horizontally
      alignItems: 'center', // Center items vertically
      justifyContent: 'space-between', // Ensure text stays on the left, button on the right
      width: '100%',
      paddingLeft: 30,
      margin: 0,
    },
    groupLabelChevron: {
      position: 'absolute',
      left: 2,
      color: theme.main,
    },
    homeChoresSection: {
      flex: 1,
      width: '100%',
      alignItems: 'center', // Horizontally center content
      justifyContent: 'flex-start', // Start content at the top
    },
    fullWidth: {
      width: '100%',
      margin: 0,
    },

    // empty section placeholder text  -MH
    emptySectionText: {
      fontSize: 16,
      fontWeight: '400',
      color: theme.text2,
    },
    biggerEmptySectionText: {
      fontSize: 20,
      fontWeight: '400',
      color: theme.text2,
    },
    emptySectionSection: {
      marginHorizontal: 30,
      marginTop: -5,
    },
    emptyChoresSection: {
      marginTop: 15,
    },
    emptyTasksSection: {
      width: '100%',
      marginBottom: 12,
    },
    emptyGroupsSection: {
      width: '100%',
      paddingHorizontal: 10,
      marginTop: 160,
      alignItems: 'center',
    },
    emptyInvitesSection: {
      width: '100%',
      paddingHorizontal: 10,
      marginTop: 160,
      alignItems: 'center',
    },

    // loading screen  -MH
    loadingContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 25,
    },
    loadingText: {
      fontSize: 18,
      fontWeight: '300',
      color: theme.text2,
    },

    // chores tab sections  -MH
    choreSection: {
      backgroundColor: theme.white,
      width: '100%',
      height: '95%',
      alignItems: 'center',
      marginTop: 52, // was 26 before adding the date
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.lightest,
    },
    choreSectionTabs: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',

      position: 'absolute',
      top: 35, // was 10 before adding the date
      zIndex: 1,
    },
    tabButtonSelected: {
      backgroundColor: theme.white,
      padding: 5,
      marginBottom: -2,
      paddingBottom: 7,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      width: '40%',
      alignItems: 'center',
      borderWidth: 2,
      borderBottomWidth: 0,
      borderColor: theme.lightest,
    },
    tabButtonDeselected: {
      backgroundColor: theme.desaturated,
      padding: 5,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      width: '40%',
      alignItems: 'center',
      borderWidth: 2,
      borderBottomWidth: 0,
      borderColor: theme.lightest,
    },
    choreSectionTabText: {
      color: theme.text1,
      fontSize: 18,
      fontWeight: '600',
    },

    // chore block  -MH
    choreBlock: baseChoreBlock,
    choreBlockCompleted: {
      ...baseChoreBlock,
      backgroundColor: theme.desaturated,
    },
    choreBlockGroup : {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      paddingVertical: 10,
      width: '95%',
      minHeight: 55,
      borderRadius: 15,
      //backgroundColor: theme.lighter,
    },
    homeChoreBlock: {
      ...baseChoreBlock,
      backgroundColor: theme.lightest,
      borderColor: theme.lighter,
      borderWidth: 3,
      margin: 5,
      paddingVertical: 5,
    },
    choreCheck: {
      position: 'absolute',
      left: 15,
      top: 20,
      zIndex: 1,
    },
    choreTitle: baseChoreTitle,
    choreTitleCompleted: {
      ...baseChoreTitle,
      color: theme.text3,
      textDecorationLine: 'line-through',
    },
    homeChoreTitle: {
      ...baseChoreTitle,
      marginTop: 5,
      marginBottom: 5,
      fontSize: 20,
      width: '90%',
      height: 'auto',
    },
    homeChoreInfo: {
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    recurrenceLabel: {
      fontSize: 17,
      fontWeight: '300',
      color: theme.text2,
    },
    rotatingLabel: {
      fontSize: 17,
      fontWeight: '300',
      color: theme.text2,
    },
    editChoreButton: {
      position: 'absolute',
      right: 15,
      top: 20,
      zIndex: 1,
    },
    dueDateContainer: {
      width: '100%',
      paddingRight: 15,
      paddingVertical: 3,
    },
    dueDateText: {
      fontSize: 17,
      color: theme.text2,
      textAlign: 'right',
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
      marginTop: 15
    },
    signinButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 16,
    },

    // logout -NN
    logoutButton: {
      width: '80%',
      height: 45,
      borderRadius: 10,
      backgroundColor: theme.red,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
      flexDirection: 'row',
    },
    logoutButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 18,
    },

    // register -NN
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
    choreNameInput: {
      width: '100%',
      padding: 6,
      borderWidth: 1,
      borderColor: theme.lighter,
      borderRadius: 10,
      marginBottom: 25,
      fontSize: 16,
      color: theme.text1, // color when typing
    },
    choreNameInputNoEdit: {
      width: '100%',
      padding: 6,
      borderWidth: 1,
      borderColor: theme.lighter,
      borderRadius: 10,
      marginBottom: 25,
      fontSize: 16,
      color: theme.text1, // color when typing
      backgroundColor: theme.desaturated,
    },
    choreNameInputText: {
      fontSize: 16,
      color: theme.text1,
      paddingVertical: 4,
    },
    taskNameInput: {
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
      marginBottom: 25,
    },
    inputButtonContainer: {
      width: '13%',
      justifyContent: 'center',
      alignItems: 'flex-end', // align to the right
    },
    oldDropdown: {
      width: '100%',
      padding: 9,
      borderWidth: 1,
      borderColor: theme.lighter,
      borderRadius: 10,
      marginBottom: 20,
    },
    oldDropdownText: {
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
      fontSize: 18,
      marginLeft: 10,
      marginBottom: 2,
      color: theme.text2,
      width: '80%',
    },
    addChoreButton: {
      marginTop: 15,
      width: '80%',
      height: 60,
      borderRadius: 10,
      backgroundColor: theme.main,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    addChoreButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 20,
    },
    deleteChoreButtonText: {
      color: theme.white,
      fontWeight: '500',
      fontSize: 18,
    },
    deleteChoreButton: {
      marginTop: 15,
      width: '80%',
      height: 40,
      borderRadius: 10,
      backgroundColor: theme.red,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },

    // preset menu -MH
    presetButton: {
      position: 'absolute',
      //top: 40,
      right: 10,
      justifyContent: 'left',
    },
    presetButtonIcon: {
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'absolute',
      left: 0,
    },
    presetButtonText:  {
      fontSize: 18, 
      color: theme.main,
      paddingLeft: 30,
    },
    choreCategoryList: {
      width: '100%',
      marginBottom: 15,
      paddingHorizontal: 5,
    },
    choreCategoryTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    presetChoreItem: {
      backgroundColor: theme.lightest,
      marginBottom: 5,
      paddingVertical: 5,
      paddingHorizontal: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: 10,
    },
    presetChoreItemName: {
      fontSize: 18,
      fontWeight: '400',
      color: theme.text1,
    },
    presetChoreItemRecurrence: {
      fontSize: 17,
      fontWeight: '300',
      color: theme.text2,
    },

    // switch to toggle rotation - AT
    switchContainer: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    switchLabel: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 25,
      textAlignVertical: 'center',
      color: theme.text, // Dynamic text color based on theme
    },
    switchWrapper: {
      width: 50, // Width of the switch
      height: 25, // Height of the switch
      borderRadius: 25, // Circular ends
      justifyContent: 'center',
      paddingHorizontal: 3, // Space for thumb movement
    },
    switchTrack: {
      flex: 1,
      borderRadius: 25, // Match the switch wrapper for consistency
      backgroundColor: theme.desaturated,
      justifyContent: 'center', // Center the thumb vertically
    },
    switchTrackDisabled: {
      backgroundColor: theme.lightGray, // active state but not editable
    },
    switchActiveTrack: {
      backgroundColor: theme.main,
    },
    switchActiveTrackDisabled: {
      backgroundColor: theme.gray, // active state but not editable
    },
    switchThumb: {
      width: 20, // Size of the thumb
      height: 20,
      borderRadius: 10, // Fully circular thumb
      backgroundColor: theme.white, // White thumb for contrast
      elevation: 2, // Subtle shadow for a 3D effect
      position: 'absolute', // Allow smooth sliding
    },

    // chore details form dropdown -MH
    dropdownContainer: {
      width: '100%',
      alignSelf: 'center',
      marginBottom: 25,
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      padding: 9,
      borderWidth: 1,
      borderColor: theme.lighter,
      borderRadius: 10,
    },
    dropdownButtonNoEdit: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      padding: 9,
      borderWidth: 1,
      borderColor: theme.lighter,
      borderRadius: 10,
      backgroundColor: theme.desaturated,
    },
    dropdownButtonText: {
      fontSize: 16,
      color: theme.text1,
      flex: 1,
    },
    dropdownCenteredContainer: {
      justifyContent: 'center', // Center vertically
      alignItems: 'center',     // Center horizontally
      position: 'absolute',
    },
    dropdownOptionsContainer: {
      backgroundColor: theme.white,
      width: '100%',
      borderRadius: 5,
      elevation: 2,
      shadowColor: theme.gray,
      shadowRadius: 4,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.5,
    },
    dropdownOption: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: theme.lighter,
    },
    dropdownOptionText: {
      fontSize: 16,
      color: theme.text1,
    },
    dropdownOverlay: {
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },

    // Settings.js styles (for Profile/Settings page) -VA
    // Width/heights/margins may need to be changes to be device reliant so it will suit all devices

    // profile section -KK
    profileContainer:{
      flexGrow: 1,
      width: 350,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 20,
      paddingBottom: 100,
    },
    profilePicSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileNameSection: {
      alignItems: 'flex-start',
      flexDirection: 'column', 
      width: '100%',
      paddingLeft: 20,
      paddingRight: 20,
    },
    profilePictureCircle: {
      width: 120,
      height: 120,
      overflow: 'visible', // Crop any overflow for circular shape
    },
    profileNameLabel: {
      fontSize: 12,
      color: theme.text3,
      marginTop: 10,
      marginBottom: 5,
    },
    profileDisplayNameText: {
      width: '100%',
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: theme.lighter,
      borderRadius: 10,
      marginBottom: 10,
      fontSize: 30,
      fontWeight: '500',
      color: theme.text2,
    },
    displayNameCheckmark: {
      position: 'absolute',
      right: 30,
      top: 45,
    },
    profileUsernameText: {
      fontSize: 20,
      color: theme.text3,
      marginTop: -5,
    },
    settingsPadding: {
      paddingBottom: 20,
    },

    // profile pic section -KK
    profilePicturePhoto: {
      width: '100%',
      height: '100%',
      borderRadius: 100,
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
    setProfileIcon: {
      width: 80, 
      height: 80,
      borderRadius: 40, 
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,

    },
    pfpImage: {
      width: 80,          
      height: 80,         
      resizeMode: 'cover',
    },
    
    // Display Icons in Pop Up Profile Pic Selection
    pfpIconContainer: {
      flex: 1,
      marginTop: 20,
      flexDirection: 'row', 
      flexWrap: 'wrap',
      justifyContent: 'space-around', 
      width: '85%',
      alignItems: 'center',
    },
    pfpContainer: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center'
    },

    homeGroupColorButton: {
      justifyContent: 'center',
      alignItems: 'center',
      // width: 60,
      // height: 60,
      // borderRadius: 30, // circular button
      backgroundColor: theme.main,
    },
    
    // theme section -KK
    themeIconContainer: {
      width: '100%',
      flexDirection: 'row',
      //alignItems: 'left',
      //justifyContent: 'flex-start',
      //paddingLeft: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },

    // notification section -KK
    notificationContainer: {
      flexDirection: 'column',
      alignItems: 'left',
      justifyContent: 'center',
      width: '100%',
    },

    // settings button style -MH
    settingsButton: {
      width: '100%',
      height: 45,
      //borderRadius: 10,
      //backgroundColor: theme.lighter,
      margin: 2,
      justifyContent: 'center',
    },
    settingsButtonIcon: {
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'absolute',
      left: 8,
    },
    settingsButtonText:  {
      fontSize: 20, 
      color: theme.text1, 
      paddingLeft: 65,
    },

    // members page -NN
    membersList: {
      width: '100%',
      backgroundColor: theme.white,
      marginBottom: 90,
      borderWidth: 2,
      borderColor: theme.lightest,
      borderRadius: 15,
    },
    manageGroupMembersList: {
      marginBottom: 60,
    },
    memberListPadding: {
      paddingTop: 10,
    },
    manageGroupButton: {
      width: '80%',
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.main,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 50,
      flexDirection: 'row',
    },
    manageGroupButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 20,
    },
    leaveGroupButton: {
      width: '80%',
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.red,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 80,
      flexDirection: 'row',
    },
    disbandGroupButton: {
      width: '80%',
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.red,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 60,
      flexDirection: 'row',
    },
    inviteButton: {
      width: '60%',
      paddingVertical: 10,
      marginBottom: 10,
      borderRadius: 10,
      backgroundColor: theme.main,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 100,
      flexDirection: 'row',
    },
    inviteButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 18,
    },
    backPageButton: {
      padding: 10,
      position: 'absolute',
      top: 70,
      left: 20,
    },

    // invitation - NN
    mailButton: {
      position: 'absolute',
      backgroundColor: theme.gray,
      borderRadius: 20,
      padding: 8,
      top: 72,
      right: 20
    },
    
    // members card - NN
    memberItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 13,
      marginBottom: 15,
      borderRadius: 30,
      width: 370, 
      backgroundColor: theme.lighter,
    },
    memberName: {
      marginLeft: 10,
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'left',
      flex: 1,
    },
    memberRole: {
      textAlign: 'right',
      fontSize: 20,
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 5,
    },

    // manage members screen - NN
    manageMemberItem: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 5,
      minHeight: 90,
      marginVertical: 8,
      borderRadius: 40,
      width: 370,
      alignSelf: 'center',
      backgroundColor: theme.lighter,
    },
    permissionButtonContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    permissionButton: {
      borderColor: theme.main,
      borderWidth: 1,
      padding: 5,
      borderRadius: 5,
      marginHorizontal: 10,
      margin: 5,
    },
    deleteButton: {
      backgroundColor: theme.red,
      borderRadius: 40,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    // group invitations screen - NN
    invitationItem: {
      marginVertical: 15,
      padding: 15,
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: theme.desaturated,
      width:350,
    },
    invitationTextContainer:{
      flexDirection: 'row',
      // justifyContent: 'space-between',

    },
    invitationText: {
      fontSize: 18,
      paddingVertical: 2,
      fontWeight: '500',
      color: theme.text2,
    },
    invitationGroupText:{
      fontSize: 24,
      marginBottom: 12,
      paddingVertical: 4,
      fontWeight: '500',
      color: theme.text2,
      // textAlign: 'right',
    },
    invitationButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    acceptButton: {
      backgroundColor: theme.green,
      padding: 10,
      borderRadius: 5,
      flexDirection: 'row',
    },
    declineButton: {
      backgroundColor: theme.red,
      padding: 10,
      borderRadius: 5,
      flexDirection: 'row',
    },
    buttonText: {
      color: theme.white,
      fontSize: 18,
    },

    // create/invite button & pop-up - NN
    createGroupButton: {
      width: '95%',
      marginLeft: '2.5%',
      marginTop: 10,
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.main,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: -50,
      flexDirection: 'row',
    },
    createGroupButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 20,
    },
    groupInviteeInput: {
      width: '85%',
      height: 40,
      paddingHorizontal: 10,
      borderRadius: 5,
      borderColor: theme.main,
      borderWidth: 1,
      marginBottom: 20,
      backgroundColor: theme.white,
      color: theme.text1,
    },
    submitButton: {
      width: '85%',
      height: 50,
      borderRadius: 10,
      backgroundColor: theme.main,
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitButtonText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: 18,
    },
    closeButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      padding: 5,
    },
    
    // groups display -NN
    groupDisplayContentContainer: {
      paddingTop: 15,
      paddingBottom: 140,
    },
    groupDisplayContent: {
      flex: 1,
      width: '100%',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      marginBottom: -40,
    },
    groupItem: {
      width: '92%',
      marginLeft: '4%', // adjust based on above setting to center
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 15,
      paddingHorizontal: 15,
      marginTop: 10,
      marginBottom: 17,
      borderWidth: 2,
      borderRadius: 10,
      backgroundColor: theme.lighter,
      borderColor: theme.main,
    },
    groupName: {
      fontSize: 25,
      fontWeight: 'bold',
      flexShrink: 1,
    },
    groupSize: {
      fontSize: 15,
      color: theme.text2,
      marginTop: 5,
    },
    groupColorPicker: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    popover: {
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    menuContainer: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',  // Allow wrapping of icons to next line
      justifyContent: 'space-between',  // Spread out the items
      marginTop: 10,
    },
    menuItem: {
      width: '20%',  // 4 items per row (3 columns)
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      padding: 10,
    },
    groupColorIcon: {
      alignSelf: 'center',
    },
    mainColorFinder: {
      color: theme.main,
    },

    // edit group name -NN
    editGroupNameButton: {
      position: 'absolute',
      padding: 8,
      top: 72,
      right: 20
    },
    editGroupNameInput: {
      borderWidth: 5,
      borderRadius: 10,
      borderColor: 'black',
    },

    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    editInput: {
      fontWeight: 'bold',
      padding: 5,
      fontSize: 25,
      minWidth: 280,
      maxWidth: 280,
      textAlign: 'center',
    },
    groupSize: {
      fontSize: 13,
      color: theme.gray,
      marginTop: 5,
    },
  });
};

export default createStyles;