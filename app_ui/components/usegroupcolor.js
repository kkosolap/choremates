// usegroupcolor.js

import { useEffect, useState } from 'react';
import { getGroupColor } from './groupcolor';
import { API_URL } from '../config';

import axios from 'axios';

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
