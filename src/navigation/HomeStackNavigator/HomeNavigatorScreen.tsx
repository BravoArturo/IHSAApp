import { View, Text } from 'react-native';
import React from 'react';
import useHomeNavigatorViewController from './useHomeNavigatorViewController';
import HomeNavigatorView from './HomeNavigatorView';

const HomeNavigatorScreen = () => {
  const props = useHomeNavigatorViewController();
  return <HomeNavigatorView {...props} />;
};

export default HomeNavigatorScreen;
