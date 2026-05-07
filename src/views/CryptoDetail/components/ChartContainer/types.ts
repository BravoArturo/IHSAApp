import { LayoutChangeEvent } from 'react-native';

export type ChartContainerPropType = {
  onLayoutChart: (event: LayoutChangeEvent) => void;
};
