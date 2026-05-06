import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { MenuViewProps } from './types';
import ErrorConnection from '../components/ErrorConnection/ErrorConnection';

const MenuView: React.FC<MenuViewProps> = ({
  isLoading,
  errorConnection,
  onPressRetry,
}) => {
  if (errorConnection) {
    return <ErrorConnection onPressRetry={onPressRetry} />;
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuView;
