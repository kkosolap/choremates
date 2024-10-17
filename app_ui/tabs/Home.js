// Home.js
import React from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Alert   } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../style/colors';
import styles from '../style/styles';


const HomeDisplay = () => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.8, // scale down to 80%
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1, // scale back to original size
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const showAlert = () => {
    Alert.alert(
      'How would you like to add a chore?',
      '',
      [
        {
          text: 'Create custom chore',
          onPress: () => console.log('custom'),
        },
        {
          text: 'Edit from preset list',
          onPress: () => console.log('preset'),
        },
      ],
      { cancelable: true } // allow dismissing by tapping outside
    );
  };

  return (
    <View style={styles.screen}>
      {/* Add Chore Button */}
      <TouchableWithoutFeedback onPress={showAlert} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
          <Icon name="add" size={40} color="#fff" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <Text style={styles.buttonDescription}>
        add chore
      </Text>
    </View>
  );
};

export default HomeDisplay;
