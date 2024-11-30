// colors.js

// constant colors
const baseTheme = {
  background: '#f2f4fc',
  text1: '#1F222B',   // titles + main text
  text2: '#444956',   // subtitles
  text3: '#656975',   // completed chores (same color as gray below)
  white: '#ffffff',
  lightGray: '#e2e2e2',
  gray: '#656975',
  black: '#000000',
  red: '#D56765',
  inactive: '#d3d3d3', // Light gray
  active: '#4caf50', // Green
};

const pinkTheme = {
  ...baseTheme,
  main: '#DE6AAA',
  lighter: '#ED98C7',
  lightest: '#F0B8D7',
  desaturated: '#EDDAE5',
  name: "pink",
};

const yellowTheme = {
  ...baseTheme,
  main: '#DFBD60',
  lighter: '#E3D190',
  lightest: '#F2E0B4',
  desaturated: '#EDE9DA',
  name: "yellow",
};

const greenTheme = {
  ...baseTheme,
  main: '#58AE66',
  lighter: '#84CD86',
  lightest: '#A3E1A5',
  desaturated: '#C7DFD2',
  name: "green",
};

const blueTheme = {
  ...baseTheme,
  main: '#5AA6DC',
  lighter: '#89C9E9',
  lightest: '#A2DEFC',
  desaturated: '#D2E0E8',
  name: "blue",
};

const purpleTheme = {
  ...baseTheme,
  main: '#6B86DF',
  lighter: '#98AAED',
  lightest: '#B6C8F7',
  desaturated: '#DADFED',
  name: "purple",
};

// all themes
const themes = {
  pink: pinkTheme,
  yellow: yellowTheme,
  green: greenTheme,
  blue: blueTheme,
  purple: purpleTheme,
};

export default themes;