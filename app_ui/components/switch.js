// switch.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeProvider';
import createStyles from '../style/styles';
import themes from '../style/colors';

const Switch = ({ isOn, onToggle, label, disabled }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [switchState, setSwitchState] = useState(isOn || false);
  const animation = new Animated.Value(switchState ? 1 : 0);

  const toggleSwitch = () => {
    if (disabled) return;

    const newValue = !switchState;
    setSwitchState(newValue);
    onToggle(newValue);

    Animated.timing(animation, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const interpolatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [themes.inactive, themes.active],
  });

  const interpolatedPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Adjust for padding and button size
  });

  return (
    <View style={styles.switchContainer}>
      {label && <Text style={styles.switchLabel}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleSwitch}
        disabled={disabled}
        style={styles.switchWrapper}
      >
        <Animated.View
          style={[
            styles.switchTrack,
            switchState ? styles.switchActiveTrack : {},
            disabled ? styles.switchActiveTrackDisabled : {},
          ]}
        >
          <Animated.View
            style={[
              styles.switchThumb,
              { transform: [{ translateX: interpolatedPosition }] },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default Switch;

// Example usage
// <Switch isOn={true} onToggle={(value) => console.log(value)} label="Enable Notifications" />
