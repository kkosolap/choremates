// groupColor.js

import { useEffect, useState } from 'react';
import { API_URL } from '../config';

import axios from 'axios';

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

export const useGroupColors = (user) => {
  const [groups, setGroups] = useState([]);
  const [groupColors, setGroupColors] = useState({});

  // Fetch all groups for the user
  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        try {
          const response = await axios.post(`${API_URL}get-all-groups-for-user`, {
            username: user,
          });
          setGroups(response.data);
        } catch (error) {
          console.error("usergroupcolor.js: Error fetching groups:", error);
        }
      }
    };
    fetchGroups();
  }, [user]);

  // Fetch colors for each group
  useEffect(() => {
    const fetchGroupColors = async () => {
      if (user && groups.length > 0) {
        const colorMap = {};
        for (const group of groups) {
          const color = await getGroupColor(user, group);
          colorMap[group.group_id] = color;
        }
        setGroupColors(colorMap);
      }
    };
    fetchGroupColors();
  }, [user, groups]);

  return { groupColors, groups };
};
