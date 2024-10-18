// ChoreMates Project
// CSE 115A with Professor Richard Jullig @ UCSC


// ALL FRONTEND CODE HAPPENS HERE -KK

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';


// API_URL = "http://localhost:3000/" 
API_URL = "http://192.168.56.1:3000/"


export default function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    axios.get(API_URL+"home") // fetches the data at the address -KK
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  }, []);


  // below is all the code for what gets displayed on the screen -KK
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{data}</Text>
    </View>
  );
}


/********************************************************** */
/*                CSS AESTHETICS BELOW:                     */
/********************************************************** */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
