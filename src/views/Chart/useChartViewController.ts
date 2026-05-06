import { ChartViewProps } from './types';
import useChartViewModel from './useChartViewModel';

const useChartViewController = (): ChartViewProps => {
  const {} = useChartViewModel();

  return {};
};

export default useChartViewController;
