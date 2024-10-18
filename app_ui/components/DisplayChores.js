// a component that will display the chores on the screen!
// -VA
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, Button, StyleSheet} from 'react-native';
import Checkbox from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';

API_URL = "http://10.0.0.4:3000/"


const DisplayChoresList = () => {
  const [chores, setChores] = useState([]);

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
          <View>
            {/* <Button title={"+ "+item.name} style={{ fontSize: 16 }}>
            </Button> */}
                    <Checkbox title={"+ "+item.name} style={styles.checkbox}>
                    </Checkbox>
                        
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    // container: {
    //   flex: 1,
    //   justifyContent: 'center', // Center vertically
    //   alignItems: 'center',     // Center horizontally
    //   padding: 20,                 // Add some padding around the container
    // },
    checkbox: {
        margin: 8,
    },
    
});
export default DisplayChoresList;