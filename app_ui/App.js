// ChoreMates Project
// CSE 115A with Professor Richard Jullig @ UCSC


// ALL FRONTEND CODE HAPPENS HERE -KK

import axios from 'axios';
import { useEffect, useState } from 'react';
// Added -VA
import { Text, View, StyleSheet, TextInput, Button, Alert  } from 'react-native';

// Added                          TextInput, Button, Alert          -VA
import Checkbox from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';

// Importing .js files to add to UI
import Slider from './components/Slider';
import Task from './components/Tasks';
import AddChore from './components/AddChore';
import DisplayChoresList from './components/DisplayChores';


// API_URL = "http://localhost:3000/" 
/************************************************************     */
/* CHANGE THE API URL BELOW TO YOUR COMPUTER'S IP ADDRESS!!!      */
/* --> you can do this by typing ipconfig in windows terminal -KK */
/* --> ipconfig getifaddr en0 for mac                             */
/* If errors, check IP address,                                   */
/*                may change per location             -VA         */
/************************************************************     */
API_URL = "http://169.233.132.64:3000/"


export default function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get(API_URL+"home") // fetches the data at the address -KK
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  }, []);


  // const [isChecked, setChecked] = useState(false);


  // below is all the code for what gets displayed on the screen -KK
  return (
    <View style={styles.container}>
      {/* <Slider />       */}
      {/* <Task text = {"task 1"}/> */}
      {/* <Text style={'styles.text'}>{data}</Text> */}
      <AddChore />
      <DisplayChoresList />

    </View>


    //Just show checkbox
    // <View style={styles.container}>
    //   <View style={styles.row}>
    //     <Checkbox style={styles.checkbox} color="#00FF00" value={isChecked} onValueChange={setChecked} />
    //     <Text>My Option</Text>
    //   </View>
    //   <StatusBar style="auto" />
    // </View>




  );
}


/********************************************************** */
/*                CSS AESTHETICS BELOW:                     */
/********************************************************** */
const styles = StyleSheet.create({
  // Used for "Welcome to Home" sample -VA
  container: {
    flex: 1,
    backgroundColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
