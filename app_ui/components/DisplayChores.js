// a component that will display the chores on the screen!
// -VA
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, Button, StyleSheet} from 'react-native';
import Checkbox from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';

API_URL = "http://10.0.0.4:3000/"


const DisplayChoresList = () => {
  const [chores, setChores] = useState([]);
  const [isChecked, setChecked] = useState(false);          // state holds for all buttons


  // Fetch chores from the backend
  useEffect(() => {
    const fetchChores = async () => {
      try {
        const response = await fetch(API_URL + 'chores');
        const data = await response.json();
        setChores(data); // Store chores in state
      } catch (error) {
        Alert.alert('Error fetching chores');
      }
    };

    fetchChores();                              // Call the function to fetch chores
  }, []);                                       // Empty dependency array ensures this runs once when the component mounts

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Chores To Do</Text>

      <FlatList
        data={chores}
        keyExtractor={(item) => item.id.toString()}                     // Ensure each item has a unique key
        renderItem={({ item }) => (                                     // onPress, delete


        <View style={styles.container}>
            <View style={styles.row}>
            <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
            <Text>{item.name}</Text>
            </View>
            <StatusBar style="auto" />
        </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    checkbox: {
      margin: 8,
    fontSize: 16,
    borderColor: '#000',        //change checkbox color, should change when toggled -VA
    }
  });


export default DisplayChoresList;