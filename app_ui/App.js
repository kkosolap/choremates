// ChoreMates Project
// CSE 115A with Professor Richard Jullig @ UCSC


// ALL FRONTEND CODE HAPPENS HERE -KK

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';


// API_URL = "http://localhost:3000/" 
/************************************************************ */
/* CHANGE THE API URL BELOW TO YOUR COMPUTER'S IP ADDRESS!!!  */
/* --> you can do this by typing ipconfig in windows terminal */
/* --> or by typing ifconfig for mac/linux laptops -KK        */
/************************************************************ */
API_URL = "http://192.168.56.1:3000/"


export default function App() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState({});   // tracks which chores are visible -KK
  const [edit, setEdit] = useState(null);       // tracks which chores are being edited -KK
  const [newTask, setNewTask] = useState('');   // contains the text for the new task -KK


  // group the tasks by chore -KK
  const groupedTasks = data.reduce((acc, task) => {
    if (!acc[task.chore]) {
      acc[task.chore] = [];
    }
    acc[task.chore].push({ id: task.id, task: task.task });
    return acc;
  }, {});

  // toggle the visibility for the chore -KK
  const toggleVisibility = (chore) => {
    setVisible((prevState) => ({
      ...prevState,
      [chore]: !prevState[chore],
    }));
  };

  // add task button -KK
  const addTask = (chore) => {
    axios.post(`${API_URL}add_task?chore_name=${chore}`, {
      task_name: newTask,
      user_id: 1,           // adjust later to the logged-in user -KK
    })
    .then((response) => {
      console.log(response.data);
      setNewTask('');       // reset the input -KK
      refreshTasks();       // refresh ltask list after updating -KK
    })
    .catch((error) => console.error(error));
  };

  // delete task button -KK
  const deleteTask = (chore, task) => {
    axios.delete(`${API_URL}delete_task?chore_name=${chore}&task_name=${task}`)
      .then((response) => {
        console.log(response.data);
        refreshTasks();     // refresh ltask list after updating -KK
      })
      .catch((error) => console.error(error));
  };

  // fetch the task list for display -KK
  const refreshTasks = () => {
    axios.get(API_URL + "get_tasks?user_id=1")
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  };
  
  // gets called when the component loads
  useEffect(() => {
    refreshTasks();
  }, []);



  // below is all the code for what gets displayed on the screen -KK
  return (
    <View style={styles.container}>
      {Object.keys(groupedTasks).map((chore, choreIndex) => (
        <View key={choreIndex} style={styles.choreContainer}>
          {/* chore heading with edit button -KK */}
          <View style={styles.choreHeader}>
            <TouchableOpacity onPress={() => toggleVisibility(chore)}>
              <Text style={styles.heading}>{chore}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEdit(edit === chore ? null : chore)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
  
          {/* list the tasks for each chore -KK */}
          {visible[chore] && groupedTasks[chore].map(({ id, task }) => (
            <View key={id} style={styles.taskContainer}>
              <Text style={styles.task}>- {task}</Text>
              {edit === chore && (
                <TouchableOpacity onPress={() => deleteTask(chore, task)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
  
          {/* have a text input for adding a new chore when in "edit" mode -KK */}
          {edit === chore && (
            <View style={styles.addTaskContainer}>
              <TextInput
                style={styles.input}
                placeholder="Add a new task"
                value={newTask}
                onChangeText={setNewTask}
              />
              <Button title="Add Task" onPress={() => addTask(chore)} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}


/********************************************************** */
/*                CSS AESTHETICS BELOW:                     */
/********************************************************** */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',  // White background
    padding: 20,
  },
  choreContainer: {
    marginBottom: 20,
  },
  choreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    fontSize: 16,
    color: 'blue',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
  },
  task: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    fontSize: 16,
    color: 'red',
  },
  addTaskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    marginTop: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    flex: 1,
    marginRight: 10,
  },
});
