// markCompleted.js

import axios from 'axios';
import { API_URL } from '../config';


const completeChore = async (user, chore) => {
    try {
        // add the chore to the database -KK
        await axios.post(`${API_URL}complete-chore`, {
            chore_name: chore,
            username: user,    
        });

        const response = await axios.post(`${API_URL}get-tasks`, {
            chore_name: chore,
            username: user,
        });
        const tasks = response.data;
        
        // iterate through each task for the chore to toggle completed status -KK
        await Promise.all(tasks.map(task =>
            axios.post(`${API_URL}match-task`, {
                chore_name: chore,
                task_name: task.task_name,
                username: user,
            })
        ));
    } catch (error) {
        console.error(error);
    }
};

const completeGroupChore = async (group_id, chore) => {
    try {
        // add the chore to the database -KK
        await axios.post(`${API_URL}complete-group-chore`, {
            group_chore_name: chore,
            group_id,    
        });

        const response = await axios.post(`${API_URL}get-group-tasks`, {
            group_chore_name: chore,
            group_id
        });
        const tasks = response.data;
        
        // iterate through each task for the chore to toggle completed status -KK
        await Promise.all(tasks.map(task =>
            axios.post(`${API_URL}match-group-task`, {
                group_chore_name: chore,
                group_task_name: task.group_task_name,
                group_id,
            })
        ));
    } catch (error) {
        console.error(error);
    }
};

const completeTask = async (user, chore, task, completed) => {
    try {
        await axios.post(`${API_URL}complete-task`, {
            chore_name: chore,
            task_name: task,
            username: user,    
        });
        if(completed){
            await axios.post(`${API_URL}complete-chore`, {
                chore_name: chore,
                username: user,    
            });
        }
    } catch (error) {
        console.error(error);
    }
};

const completeGroupTask = async (group_id, chore, task, completed) => {
    try {
        await axios.post(`${API_URL}complete-group-task`, {
            group_chore_name: chore,
            group_task_name: task,
            group_id    
        });
        if(completed){
            await axios.post(`${API_URL}complete-group-chore`, {
                group_chore_name: chore,
                group_id,    
            });
        }
    } catch (error) {
        console.error(error);
    }
};


export { completeChore, completeTask, completeGroupChore, completeGroupTask };