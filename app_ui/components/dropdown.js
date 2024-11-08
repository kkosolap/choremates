// dropdown.js

import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../style/ThemeProvider';
import createStyles from '../style/styles';


const Dropdown = ({ label, data, onSelect }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const DropdownButton = useRef();
  const [dropdownTop, setDropdownTop] = useState(0);

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
    });
    setVisible(true);
  };

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.dropdownOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdownOptionsContainer, { top: dropdownTop }]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownOption}
      onPress={() => onItemPress(item)}
    >
      <Text style={styles.dropdownOptionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const onItemPress = (item) => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        activeOpacity={0.7}
        onPress={toggleDropdown}
        ref={DropdownButton}
      >
        <Text style={styles.dropdownButtonText}>
          {(selected && selected.label) || label}
        </Text>
        <Icon type='font-awesome' name={visible ? 'chevron-up' : 'chevron-down'} />
      </TouchableOpacity>
      {renderDropdown()}
    </View>
  );
};

export default Dropdown;
