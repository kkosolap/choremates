// functions.js

import axios from 'axios';
import { API_URL } from '../config';


const completeChore = async (user, chore) => {
    try {
        // add the chore to the database -KK
        await axios.post(`${API_URL}complete_chore`, {
            chore_name: chore,
            username: user,    
        });

        const response = await axios.post(`${API_URL}get_tasks`, {
            chore_name: chore,
            username: user,
        });
        const tasks = response.data;
        
        // iterate through each task for the chore to toggle completed status -KK
        await Promise.all(tasks.map(task =>
            axios.post(`${API_URL}match_task`, {
                chore_name: chore,
                task_name: task.task_name,
                username: user,
            })
        ));
    } catch (error) {
        console.error(error);
    }
};

const completeTask = async (user, chore, task) => {
    try {
        // add the chore to the database -KK
        await axios.post(`${API_URL}complete_task`, {
            chore_name: chore,
            task_name: task,
            username: user,    
        });
    } catch (error) {
        console.error(error);
    }
};


export { completeChore, completeTask };