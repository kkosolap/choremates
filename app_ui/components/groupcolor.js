// groupColors.js

import axios from 'axios';
import { API_URL } from '../config';

// Function to fetch group color for a given user and group
export const getGroupColor = async (username, group) => {
  try {
    // Fetch user ID based on the username
    const response = await axios.post(`${API_URL}get-user-id`, { username });
    const userId = response.data.id;

    if (!userId || !group.group_id) {
      console.error("groupColors.js: userId or groupId is undefined");
      return 'purple';
    }

    // Fetch group color using user ID and group ID
    const colorResponse = await axios.get(`${API_URL}get-group-color`, {
      params: { user_id: userId, group_id: group.group_id },
    });

    return colorResponse.data.group_color || 'purple';
  } catch (error) {
    console.error("groupColors.js: Error fetching group color:", error);
    return 'purple';                                            // Default color if error occurs -VA
  }
};
