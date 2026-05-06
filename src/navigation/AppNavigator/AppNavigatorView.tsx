import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeNavigatorScreen from '../HomeStackNavigator/HomeNavigatorScreen';
import NoInternet from '../../views/components/NoInternet/NoInternet';
import { AppNavigatorViewProps } from './types';

const AppNavigatorView: React.FC<AppNavigatorViewProps> = ({ isOnline }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {isOnline ? (
        <NavigationContainer>
          <HomeNavigatorScreen />
        </NavigationContainer>
      ) : (
        <NoInternet />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppNavigatorView;
