import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChartContainerPropType } from './types';

const ChartContainer: React.FC<
  PropsWithChildren<ChartContainerPropType>
> = ({ onLayoutChart, children }) => {
  return (
    <View style={styles.container} onLayout={onLayoutChart}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: '50%',
    alignSelf: 'center',
  },
});

export default ChartContainer;
