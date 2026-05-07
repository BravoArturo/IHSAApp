import React, { memo } from 'react';
import { LineChart } from 'react-native-wagmi-charts';
import { ChartPropsType } from './types';

const Chart: React.FC<ChartPropsType> = ({
  klines,
  widthChart,
  heightChart,
}) => {
  return (
    <LineChart.Provider data={klines}>
      <LineChart width={widthChart} height={heightChart}>
        <LineChart.Path color="#10B981" width={2}>
          <LineChart.Gradient />
        </LineChart.Path>
      </LineChart>
    </LineChart.Provider>
  );
};

export default memo(Chart);
