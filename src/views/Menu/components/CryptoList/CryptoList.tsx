import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import CryptoListItem from '../CryptoListItem/CryptoListItem';
import { CryptoItem } from '../CryptoListItem/types';
import { CryptoListPropsType } from './types';

const keyExtractor = (item: CryptoItem) => item.symbol;

const CryptoList: React.FC<CryptoListPropsType> = ({
  cryptos,
  onPressItem,
  onEndReached,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: CryptoItem }) => (
      <CryptoListItem item={item} onPress={onPressItem} />
    ),
    [onPressItem],
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={cryptos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default memo(CryptoList);
