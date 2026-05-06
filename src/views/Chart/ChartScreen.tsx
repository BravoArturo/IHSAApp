import React from 'react';
import useChartViewController from './useChartViewController';
import ChartView from './ChartView';

const ChartScreen: React.FC = () => {
  const props = useChartViewController();
  return <ChartView {...props} />;
};

export default ChartScreen;
