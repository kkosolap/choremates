// functions.js

import axios from 'axios';
import { API_URL } from '../config';


const completeChore = async (chore) => {
    try {
        // add the chore to the database -KK
        await axios.post(`${API_URL}complete_chore`, {
            chore_name: chore,
            username: "kat",    
        });

        const response = await axios.post(`${API_URL}get_tasks`, {
            chore_name: chore,
            username: "kat",
        });
        const tasks = response.data;
        
        console.log("UI functions.js: tasks for mapping are ", tasks);

        // iterate through each task for the chore to toggle completed status -KK
        await Promise.all(tasks.map(task =>
            axios.post(`${API_URL}match_task`, {
                chore_name: chore,
                task_name: task.task_name,
                username: "kat",
            })
        ));
    } catch (error) {
        console.error(error);
    }
};

const completeTask = async (chore, task) => {
    try {
        // add the chore to the database -KK
        await axios.post(`${API_URL}complete_task`, {
            chore_name: chore,
            task_name: task,
            username: "kat",    
        });
    } catch (error) {
        console.error(error);
    }
};

export { completeChore, completeTask };