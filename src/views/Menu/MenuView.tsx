import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { MenuViewProps } from './types';
import ErrorConnection from '../components/ErrorConnection/ErrorConnection';
import CryptoList from './components/CryptoList/CryptoList';
import InputFilter from './components/InputFilter/InputFilter';
import NoData from './components/NoData/NoData';

const MenuView: React.FC<MenuViewProps> = ({
  cryptos,
  cryptosFiltered,
  text,
  isLoading,
  errorConnection,
  onPressRetry,
  onPressItem,
  onChangeText,
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

  return (
    <>
      <InputFilter onChangeText={onChangeText} />
      {text !== '' && cryptosFiltered.length === 0 ? (
        <NoData />
      ) : (
        <CryptoList
          cryptos={cryptosFiltered.length !== 0 ? cryptosFiltered : cryptos}
          onPressItem={onPressItem}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuView;
