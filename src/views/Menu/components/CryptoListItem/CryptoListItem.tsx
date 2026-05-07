import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { CryptoListItemPropsType } from './types';

const CryptoListItem: React.FC<CryptoListItemPropsType> = ({
  item,
  onPress,
}) => {
  const change = Number(item.priceChangePercent);
  const isPositive = !Number.isNaN(change) && change >= 0;
  const changeColor = isPositive ? '#0ECB81' : '#F6465D';

  return (
    <Pressable style={styles.container} onPress={() => onPress(item)}>
      <Text style={styles.cell} numberOfLines={1}>
        {item.symbol}
      </Text>
      <Text style={styles.cell} numberOfLines={1}>
        {item.lastPrice}
      </Text>
      <Text style={[styles.cell, { color: changeColor }]} numberOfLines={1}>
        {item.priceChangePercent}
      </Text>
      <View style={styles.chevron}>
        <Svg width={12} height={12} viewBox="0 0 24 24">
          <Path
            d="M9 6l6 6-6 6"
            stroke="#9AA0A6"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cell: {
    flex: 1,
  },
  chevron: {
    width: 16,
    alignItems: 'flex-end',
  },
});

export default memo(CryptoListItem);
