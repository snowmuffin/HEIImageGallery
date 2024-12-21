import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App'; // App 컴포넌트 가져오기
import { name as appName } from '../app.json'; // app.json에서 앱 이름 가져오기

const Index = () => {
  return <App />;
};

AppRegistry.registerComponent(appName, () => Index);

export default Index; // 기본 내보내기 추가
