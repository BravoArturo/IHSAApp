import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';
import { ChartPropsType } from './types';

const CHART_HEIGHT = 200;

const Chart: React.FC<ChartPropsType> = ({ klines }) => {
  return (
    <View style={styles.container}>
      <LineChart.Provider data={klines}>
        <LineChart height={CHART_HEIGHT}>
          <LineChart.Path />
        </LineChart>
      </LineChart.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});

export default memo(Chart);
