// Presets.js


const KitchenChores = [
  {
    chore_name: "Wash the dishes",
    recurrence: { label: 'Daily', value: 'Daily' }
  },
  {
    chore_name: "Wipe kitchen counters",
    recurrence: { label: 'Daily', value: 'Daily' }
  },
  {
    chore_name: "Wipe dining table",
    recurrence: { label: 'Daily', value: 'Daily' }
  },
  {
    chore_name: "Clear old leftovers out of fridge",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Clean microwave",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Scrub kitchen sink",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Take out the trash",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Sweep kitchen",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Clean stovetop",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Clean stovehood",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Empty crumbs out of toaster",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Organize pantry",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
];

const BathroomChores = [
  {
    chore_name: "Wipe bathroom counter and sink",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Clean and scrub shower",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Clean mirror",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Clean and disinfect toilet",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Sweep bathroom floor",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Empty bathroom trash",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
];

const LivingRoomChores = [
  {
    chore_name: "Sweep living room floor",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Vacuum living room floor",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Clean living room windows",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Dust living room surfaces",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
];

const BedroomChores = [
  {
    chore_name: "Make bed",
    recurrence: { label: 'Daily', value: 'Daily' }
  },
  {
    chore_name: "Clean desk",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Clean bedroom window",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Dust lampshade",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Vacuum carpet",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Empty bedroom trash",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Change bedsheets",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Clean/organize wardrobe",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
];

const LaundryRoomChores = [
  {
    chore_name: "Launder clothes",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Launder bedsheets and blankets",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
];

const PetChores = [
  {
    chore_name: "Feed fish",
    recurrence: { label: 'Daily', value: 'Daily' }
  },
  {
    chore_name: "Feed and water pets",
    recurrence: { label: 'Daily', value: 'Daily' }
  },
  {
    chore_name: "Scoop litter box",
    recurrence: { label: 'Daily', value: 'Daily' }
  },
  {
    chore_name: "Clean litter box and replace litter",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Vacuum pet bedding",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Wash pet bowls",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
];

const MiscChores = [
  {
    chore_name: "Dust stairs and landings",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Water plants",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Wash car",
    recurrence: { label: 'Weekly', value: 'Weekly' }
  },
  {
    chore_name: "Sweep porch",
    recurrence: { label: 'Weekly', value: 'Weekly' }
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
