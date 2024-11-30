// Presets.js

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../contexts/ThemeProvider.js';
import createStyles from '../style/styles';
import { ScreenHeader } from '../components/headers.js';

import axios from 'axios';
import { API_URL } from '../config';


const KitchenChores = [
  {
    chore_name: "Wash the dishes",
    recurrence: "Daily"
  },
  {
    chore_name: "Wipe kitchen counters",
    recurrence: "Daily"
  },
  {
    chore_name: "Wipe dining table",
    recurrence: "Daily"
  },
  {
    chore_name: "Take leftovers out of fridge",
    recurrence: "Weekly"
  },
  {
    chore_name: "Clean microwave",
    recurrence: "Weekly"
  },
  {
    chore_name: "Scrub kitchen sink",
    recurrence: "Weekly"
  },
  {
    chore_name: "Take out the trash",
    recurrence: "Weekly"
  },
  {
    chore_name: "Sweep kitchen",
    recurrence: "Weekly"
  },
  {
    chore_name: "Clean stovetop",
    recurrence: "Weekly"
  },
  {
    chore_name: "Clean stovehood",
    recurrence: "Weekly"
  },
  {
    chore_name: "Empty crumbs out of toaster",
    recurrence: "Weekly"
  },
  {
    chore_name: "Organize pantry",
    recurrence: "Weekly"
  },
];

const BathroomChores = [
  {
    chore_name: "Wipe bathroom countertop and sink",
    recurrence: "Weekly"
  },
  {
    chore_name: "Clean and scrub shower",
    recurrence: "Weekly"
  },
  {
    chore_name: "Clean mirror",
    recurrence: "Weekly"
  },
  {
    chore_name: "Clean and disinfect toilet",
    recurrence: "Weekly"
  },
  {
    chore_name: "Sweep bathroom floor",
    recurrence: "Weekly"
  },
  {
    chore_name: "Empty bathroom trash",
    recurrence: "Weekly"
  },
];

const LivingRoomChores = [
  {
    chore_name: "Sweep living room floor",
    recurrence: "Weekly"
  },
  {
    chore_name: "Vacuum living room floor",
    recurrence: "Weekly"
  },
  {
    chore_name: "Clean living room windows",
    recurrence: "Weekly"
  },
  {
    chore_name: "Dust living room surfaces and furniture",
    recurrence: "Weekly"
  },
];

const BedroomChores = [
  {
    chore_name: "Make the bed",
    recurrence: "Daily"
  },
  {
    chore_name: "Clean desk",
    recurrence: "Weekly"
  },
  {
    chore_name: "Clean bedroom window",
    recurrence: "Weekly"
  },
  {
    chore_name: "Dust lampshade",
    recurrence: "Weekly"
  },
  {
    chore_name: "Vacuum carpet",
    recurrence: "Weekly"
  },
  {
    chore_name: "Empty bedroom trash",
    recurrence: "Weekly"
  },
  {
    chore_name: "Change bedsheets",
    recurrence: "Weekly"
  },
  {
    chore_name: "Clean/organize wardrobe",
    recurrence: "Weekly"
  },
];

const LaundryRoomChores = [
  {
    chore_name: "Launder clothes",
    recurrence: "Weekly"
  },
  {
    chore_name: "Launder bedsheets and blankets",
    recurrence: "Weekly"
  },
];

const PetChores = [
  {
    chore_name: "Feed fish",
    recurrence: "Daily"
  },
  {
    chore_name: "Feed and water pets",
    recurrence: "Daily"
  },
  {
    chore_name: "Scoop litter box",
    recurrence: "Daily"
  },
  {
    chore_name: "Clean litter box and replace litter",
    recurrence: "Weekly"
  },
  {
    chore_name: "Vacuum pet bedding",
    recurrence: "Weekly"
  },
  {
    chore_name: "Wash pet bowls",
    recurrence: "Weekly"
  },
];

const MiscChores = [
  {
    chore_name: "Dust stairs and landings",
    recurrence: "Weekly"
  },
  {
    chore_name: "Water plants",
    recurrence: "Weekly"
  },
  {
    chore_name: "Wash car",
    recurrence: "Weekly"
  },
  {
    chore_name: "Sweep porch",
    recurrence: "Weekly"
  },
];

const AllChores = [
  {
    name: "Kitchen Chores",
    list: KitchenChores
  },
  {
    name: "Bathroom Chores",
    list: BathroomChores
  },
  {
    name: "Living Room Chores",
    list: LivingRoomChores
  },
  {
    name: "Bedroom Chores",
    list: BedroomChores
  },
  {
    name: "Laundry Room Chores",
    list: LaundryRoomChores
  },
  {
    name: "Pet Chores",
    list: PetChores
  },
  {
    name: "Misc Chores",
    list: MiscChores
  }
];

export default AllChores;
