import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { CryptoListItemPropsType } from './types';

const CryptoListItem: React.FC<CryptoListItemPropsType> = ({
  item,
  onPress,
}) => {
  return (
    <Pressable style={styles.container} onPress={() => onPress(item)}>
      <Text style={styles.cell}>{item.symbol}</Text>
      <Text style={styles.cell}>{item.lastPrice}</Text>
      <Text style={styles.cell}>{item.priceChangePercent}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cell: {
    flex: 1,
  },
});

export default memo(CryptoListItem);
