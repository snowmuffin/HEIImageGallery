import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
const appConfig = require('./app.json');
const appName = appConfig.expo.name;
const Index = () => {
  return <App />;
};

AppRegistry.registerComponent(appName, () => Index);

export default Index; 
