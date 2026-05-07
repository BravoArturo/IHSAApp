import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
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
    <View style={styles.screen}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Binance API</Text>
        <Text style={styles.screenSubtitle}>Mercado de criptomonedas</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <InputFilter onChangeText={onChangeText} />
        </View>
        <SortToggle valueToggle={valueToggle} onToggle={onToggle} />
      </View>

      {text !== '' && cryptosFiltered.length === 0 ? (
        <NoData />
      ) : (
        <View style={styles.listCard}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Par</Text>
            <Text style={styles.tableHeaderCell}>Precio</Text>
            <Text style={styles.tableHeaderCell}>24h %</Text>
            <View style={styles.tableHeaderSpacer} />
          </View>
          <CryptoList
            cryptos={cryptosFiltered.length !== 0 ? cryptosFiltered : cryptos}
            onPressItem={onPressItem}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
  },
  screenHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
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
  listCard: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F3',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableHeaderSpacer: {
    width: 16,
  },
});

export default MenuView;
