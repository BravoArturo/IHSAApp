import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { MenuViewProps } from './types';
import ErrorConnection from '../components/ErrorConnection/ErrorConnection';
import CryptoList from './components/CryptoList/CryptoList';
import InputFilter from './components/InputFilter/InputFilter';
import NoData from './components/NoData/NoData';
import SortToggle from './components/SortToggle/SortToggle';

const MenuView: React.FC<MenuViewProps> = ({
  cryptos,
  cryptosFiltered,
  text,
  isLoading,
  errorConnection,
  valueToggle,
  onToggle,
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
      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <InputFilter onChangeText={onChangeText} />
        </View>
        <SortToggle valueToggle={valueToggle} onToggle={onToggle} />
      </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
});

export default MenuView;
