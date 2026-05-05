import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList, HomeNavigatorViewProps } from './types';

const Stack = createStackNavigator<HomeStackParamList>();
const HomeNavigatorView: React.FC<HomeNavigatorViewProps> = ({ routes }) => {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      {routes.map(routeConfig => (
        <Stack.Screen key={routeConfig.name} {...routeConfig} />
      ))}
    </Stack.Navigator>
  );
};

export default HomeNavigatorView;
