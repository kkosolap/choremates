// colors.js

// constant colors
const baseTheme = {
  background: '#f2f4fc',
  text1: '#1F222B',   // titles + main text
  text2: '#444956',   // subtitles
  text3: '#656975',   // completed chores (same color as gray below)
  white: '#ffffff',
  gray: '#656975',
  black: '#000000',
  red: '#D56765',
};

const yellowTheme = {
  ...baseTheme,
  main: '#DFBD60',
  lighter: '#E3D190',
  lightest: '#F2E0B4',
  desaturated: '#EDE9DA',
};

const greenTheme = {
  ...baseTheme,
  main: '#58AE66',
  lighter: '#84CD86',
  lightest: '#A3E1A5',
  desaturated: '#C7DFD2',
};

const blueTheme = {
  ...baseTheme,
  main: '#5AA6DC',
  lighter: '#89C9E9',
  lightest: '#A2DEFC',
  desaturated: '#D2E0E8',
};

const purpleTheme = {
  ...baseTheme,
  main: '#6B86DF',
  lighter: '#98AAED',
  lightest: '#B6C8F7',
  desaturated: '#DADFED',
};

const pinkTheme = {
  ...baseTheme,
  main: '#DE6AAA',
  lighter: '#ED98C7',
  lightest: '#F0B8D7',
  desaturated: '#EDDAE5',
};

// all themes
const themes = {
  yellow: yellowTheme,
  green: greenTheme,
  blue: blueTheme,
  purple: purpleTheme,
  pink: pinkTheme,
};

export default themes;
