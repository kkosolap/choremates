import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

API_URL = "http://169.233.132.64:3000/"

const AddChoreScreen = () => {
    const [chore, setChore] = useState('');
  
    const handleAddChore = async () => {
      try {
        const response = await fetch(API_URL+'addChore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ choreName: chore }),
        });
        if (response.ok) {
          Alert.alert('Chore added successfully');
        } else {
          Alert.alert('Failed to add chore');
        }
      } catch (error) {
        Alert.alert('Error adding chore');
      }
    };
  
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter chore"
          value={chore}
          // onChangeText={setChore}
          onChangeText={(text) => setChore(text)}
        />
        <View style={styles.buttonContainer}>
        <Button title="Add Chore + " onPress={handleAddChore} />
        </View>
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
  container: {
    // flex: 2,
    marginTop: 250,               // Move the button down a bit from the input
    justifyContent: 'space-between',  // Space between input and button
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'lightblue',         // Added a background color to see the container area
    marginBottom: 10,      // Space below the input

  },
  buttonContainer: {
    width: '60%',
    backgroundColor: 'lightgreen',  // Add a background color to see the button container
  },
  
  input: {
    width: '80%',                // TextInput takes 80% of the screen width
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    width: '60%',                // Button container width is 60% of the screen width
    marginTop: 20,               // Move the button down a bit from the input
  },
});


  export default AddChoreScreen;