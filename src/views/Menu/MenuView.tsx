import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { MenuViewProps } from './types';
import ErrorConnection from '../components/ErrorConnection/ErrorConnection';
import CryptoList from './components/CryptoList/CryptoList';

const MenuView: React.FC<MenuViewProps> = ({
  cryptos,
  isLoading,
  errorConnection,
  onPressRetry,
  onPressItem,
}) => {
  if (errorConnection) {
    return <ErrorConnection onPressRetry={onPressRetry} />;
  }

  if (isLoading && cryptos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <CryptoList cryptos={cryptos} onPressItem={onPressItem} />;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuView;
