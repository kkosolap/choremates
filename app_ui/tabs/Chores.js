// Chores.js

import { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, ScrollView, } from 'react-native';
import * as SecureStore from 'expo-secure-store'; 

import createStyles from '../style/styles';
import { useTheme } from '../contexts/ThemeProvider.js';
import { TabHeader } from '../components/headers.js';
import { LoadingVisual } from '../components/placeholders.js';
import { DisplayDate } from '../components/date.js';
import { ActiveChoreBlock, ActiveGroupChoreBlock } from '../components/blocks.js';
import { SectionTabButton } from '../components/buttons.js';

import axios from 'axios';
import { API_URL } from '../config';


// header and page content  -MH
const ChoresScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.screen}>
      <TabHeader title="Chores" />
      <ChoresDisplay />
    </View>
  );
};

// page content  -MH
const ChoresDisplay = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [username, setUsername] = useState(null);

  const [loading, setLoading] = useState(true); 

  // calls refresh whenever the screen is in focus -KK
  useFocusEffect(
    useCallback(() => { 
      const getUsername = async () => {   // get the username from securestore -KK
        const storedUsername = await SecureStore.getItemAsync('username');
        if (storedUsername){
          setUsername(storedUsername); 
          refresh(storedUsername);
        } else {
          console.error("UI Chores.js: Username not found in SecureStore.");
        }
      };
      getUsername();
    }, 
    [])
  );

  // State for grouped personal tasks  -MH
  const [personalData, setPersonalData] = useState([]);
  const [groupedPersonalTasksCompleted, setGroupedPersonalTasksCompleted] = useState({});
  const [groupedPersonalTasksToDo, setGroupedPersonalTasksToDo] = useState({});

  // Load personal chores  -MH
  useEffect(() => {
    if (!personalData) return; // safety check for null/undefined personalData

    // temp to store grouped tasks
    const completed = {};
    const toDo = {};

    personalData.forEach((task) => {
      // safety check for null/undefined tasks
      if (!task || !task.chore_name) {
        console.log("Chores.js: found null task in personalData");
        return;
      }

      // group based on chore completion
      const targetGroup = task.chore_is_completed ? completed : toDo;

      // if the chore name doesn't exist in the target group, initialize it
      if (!targetGroup[task.chore_name]) {
        targetGroup[task.chore_name] = {
          is_completed: task.chore_is_completed,
          recurrence: task.chore_recurrence,
          tasks: [],
        };
      }

      // only add tasks if task_name is non-null
      if (task.task_name) {
        targetGroup[task.chore_name].tasks.push({
          id: task.id,
          task: task.task_name,
          completed: task.task_is_completed,
        });
      }
    });

    // update state with grouped tasks
    setGroupedPersonalTasksCompleted(completed);
    setGroupedPersonalTasksToDo(toDo);
  }, [personalData]); // runs when personalData changes

  // State for grouped group tasks  -MH
  const [groupData, setGroupData] = useState([]);
  const [groupedGroupTasksCompleted, setGroupedGroupTasksCompleted] = useState({});
  const [groupedGroupTasksToDo, setGroupedGroupTasksToDo] = useState({});

  // Load group chores  -MH
  useEffect(() => {
    if (!groupData || groupData.length === 0) { // safety check for null/undefined groupData
      setLoading(false);

      setGroupedGroupTasksCompleted({});
      setGroupedGroupTasksToDo({});

      return;
    }

    // temp to store grouped tasks
    const completed = {};
    const toDo = {};

    groupData.forEach((task) => {
      // safety check for null/undefined tasks
      if (!task || !task.group_chore_name) {
        console.log("Chores.js: found null task in groupData");
        return;
      }

      // group based on chore completion
      const targetGroup = task.chore_is_completed ? completed : toDo;

      // if the chore name doesn't exist in the target group, initialize it
      if (!targetGroup[task.group_chore_name]) {
        targetGroup[task.group_chore_name] = {
          group_id: task.group_id,
          is_completed: task.chore_is_completed,
          recurrence: task.chore_recurrence,
          group_tasks: []
        };
      }

      // only add tasks if task_name is non-null
      if (task.group_task_name) {
        targetGroup[task.group_chore_name].group_tasks.push({
          id: task.id,
          task: task.group_task_name,
          completed: task.task_is_completed,
        });
      }

      setLoading(false);
    });

    setLoading(false);

    // update state with grouped tasks
    setGroupedGroupTasksCompleted(completed);
    setGroupedGroupTasksToDo(toDo);
  }, [groupData]); // runs when groupData changes

  // State for visible tasks
  const [visibleTasks, setVisibleTasks] = useState({}); // tracks which chores have visible tasks -MH

  // toggle the visibility of tasks for a chore -KK
  const toggleVisibility = (chore_name) => {
    setVisibleTasks((prevState) => ({
      ...prevState,
      [chore_name]: !prevState[chore_name],
    }));
  };

  // fetch the task list for display -KK
  const refresh = async (username) => {
    // get all the personal chore data for the user -KK
    await axios.post(`${API_URL}get-chores-data`, { username }).then((response) => setPersonalData(response.data))
    .catch((error) => console.error(error));

    // get all the group chore ids for the user -KK
    const response = await axios.post(`${API_URL}get-all-groups-for-user`, { username }).catch((error) => console.error(error));

    let allGroupData = []; 

    // get the group chore data for each group
    for (const group of response.data) {
      const group_id = group.group_id; 
      await axios.post(`${API_URL}get-group-chores-data-for-user`, { username, group_id })
        .then((response) => {
          allGroupData = [...allGroupData, ...response.data]; 
        })
        .catch((error) => console.error(error));
    }

    setGroupData(allGroupData); 
  };

  // Check if on To-Do or Completed Tab
  const [showToDo, setShowToDo] = useState(true); // tracks whether you're on the To-Do or Completed tab
  const personalChoresToShow = showToDo ? groupedPersonalTasksToDo : groupedPersonalTasksCompleted;
  const groupChoresToShow = showToDo ? groupedGroupTasksToDo : groupedGroupTasksCompleted;
  const emptyDisplayText = showToDo ? "No Chores To-Do!" : "No Completed Chores";


  // page content -MH
  return (
    <View style={styles.content}>

      <DisplayDate />

      <View style={styles.choreSectionTabs}>
        <SectionTabButton
          label="To-Do"
          selected={showToDo}
          onClick={() => setShowToDo(true)}
        />
        <SectionTabButton
          label="Completed"
          selected={!showToDo}
          onClick={() => setShowToDo(false)}
        />
      </View>

      <View style={styles.choreSection}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.centeredContent}
        >
          {loading ? (
            <LoadingVisual />
          ) : (
          <>
          {Object.keys(personalChoresToShow).length > 0 || Object.keys(groupChoresToShow).length > 0  ? (
            // If there are Chores To Show
            <>
            {/* personal chores */}
            {Object.keys(personalChoresToShow).map((chore_name) => {
              return (
                <ActiveChoreBlock
                  user={username}
                  key={chore_name}
                  choreName={chore_name}
                  tasks={personalChoresToShow[chore_name].tasks}
                  completed={personalChoresToShow[chore_name].is_completed}
                  recurrence={personalChoresToShow[chore_name].recurrence}
                  visible={visibleTasks[chore_name]}
                  onToggleVisibility={toggleVisibility}
                  refresh={refresh}
                />
              );
            })}

            {/* group chores */}
            {Object.keys(groupChoresToShow).map((group_chore_name) => (
              <ActiveGroupChoreBlock
                user={username}
                key={group_chore_name}
                group_id={groupChoresToShow[group_chore_name].group_id}
                choreName={group_chore_name}
                tasks={groupChoresToShow[group_chore_name].group_tasks}
                completed={groupChoresToShow[group_chore_name].is_completed}
                recurrence={groupChoresToShow[group_chore_name].recurrence}
                visible={visibleTasks[group_chore_name]}
                onToggleVisibility={toggleVisibility}
                refresh={refresh}
              />
            ))}
            </>
          ) : (
            // If NO chores To-Do
            <View style={styles.emptyChoresSection}>
              <Text style={styles.emptySectionText}>
                {emptyDisplayText}
              </Text>
            </View>
          )}
          </>
          )}
        </ScrollView>
      </View>

    </View>
  );
};

export default ChoresScreen;