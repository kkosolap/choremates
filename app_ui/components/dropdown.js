// dropdown.js 

// Used from https://www.npmjs.com/package/react-native-element-dropdown
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';


import colors from '../style/colors';
import createStyles from '../style/styles';
import LogoutButton from '../components/logout'; 
import { TabHeader } from '../components/headers.js';
import { useTheme } from '../style/ThemeProvider';
import { useLogout } from '../style/LogOutProvider';

// import axios from 'axios';
// import { API_URL } from '../config';


const data = [
  { label: 'Casa 🏠', value: '1' },
  { label: 'Trap Home ❤️', value: '2' },
  // { label: 'Item 3', value: '3' },
  // { label: 'Item 4', value: '4' },
  // { label: 'Item 5', value: '5' },
  // { label: 'Item 6', value: '6' },
  // { label: 'Item 7', value: '7' },
  // { label: 'Item 8', value: '8' },
];

export const DropdownComponent = () => {
  const { theme, changeTheme } = useTheme();
  const styles = createStyles(theme);

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          {/* Dropdown label */}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.dropDownContainer}>
      {renderLabel()}
      
      {/* <Dropdown
        style={[
          styles.dropDownDisplay,
          isFocus && { borderColor: 'blue' },
          { backgroundColor: theme.lightest } // Add your desired color here
        ]}
          placeholderStyle={styles.dropDownPrimaryTextStyle}
        selectedTextStyle={styles.dropDownPrimaryTextStyle}
        inputSearchStyle={styles.dropDownInputSearchStyle}
        // iconStyle={styles.dropDownIconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Home' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
        // renderLeftIcon={() => (
        //   <AntDesign
        //     style={styles.dropDownIcon}
        //     color={isFocus ? 'blue' : 'black'}
        //     name="Safety"
        //     size={20}
        //   />
        // )}
      /> */}

      <Dropdown
        style={[styles.dropDownDisplay, { backgroundColor:theme.lightest  }]}
        dropdownStyle={{
          backgroundColor: '#FF6347',
          position: 'absolute',      
          top: 50,    
          left: 0,
          right: 0,  
          zIndex: 1000,              
        }}
        placeholderStyle={styles.dropDownPrimaryTextStyle}
        selectedTextStyle={styles.dropDownPrimaryTextStyle}
        inputSearchStyle={styles.dropDownInputSearchStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Home' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />

      
    </View>
  );
};

export default DropdownComponent;