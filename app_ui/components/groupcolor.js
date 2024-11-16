// utils/groupColors.js

import axios from 'axios';
import { API_URL } from '../config';

// Function to fetch group color for a given user and group
export const getGroupColor = async (username, group) => {
  try {
    // Fetch user ID based on the username
    const response = await axios.post(`${API_URL}get-id`, { username });
    const userId = response.data.id;

    if (!userId || !group.group_id) {
      console.error("getGroupColor: userId or groupId is undefined");
      return 'purple'; // Default color if there's an issue
    }

    // Fetch group color using user ID and group ID
    const colorResponse = await axios.get(`${API_URL}get-group-color`, {
      params: { user_id: userId, group_id: group.group_id },
    });

    // console.log("Returning data: " + colorResponse.data.group_color);
    return colorResponse.data.group_color || 'purple'; // Default to purple if color not found
  } catch (error) {
    console.error("Error fetching group color:", error);
    return 'purple'; // Default color if error occurs
  }
};
