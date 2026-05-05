import { View, Text } from 'react-native';
import React from 'react';
import AppNavigatorView from './AppNavigatorView';
import useAppNavigatorViewController from './useAppNavigatorViewController';

const AppNavigatorScreen = () => {
  const props = useAppNavigatorViewController();
  return <AppNavigatorView />;
};

export default AppNavigatorScreen;
