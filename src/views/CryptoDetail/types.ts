import { AxiosError } from 'axios';
import { CryptoItem } from '../Menu/components/CryptoListItem/types';
import { KlineRawType } from '../../models/crypto/api/types';
import { ResponseAPIType } from '../../utils/typesResponse';
import { ErrorConnectionPropsType } from '../components/ErrorConnection/types';
import { ChartPropsType } from './components/Chart/types';
import { ChartContainerPropType } from './components/ChartContainer/types';

export type KlinePointType = {
  timestamp: number;
  value: number;
};

export type CryptoDetailViewProps = ErrorConnectionPropsType &
  ChartPropsType &
  ChartContainerPropType & {
    item: CryptoItem;
    isChartLoading: boolean;
    chartError: boolean;
    livePrice: string | null;
    errorConnection: boolean;
  };

export type CryptoDetailViewModelType = {
  params: { item: CryptoItem };
  getCryptoKlinesData: (
    symbol: string,
    signal?: AbortSignal,
  ) => Promise<ResponseAPIType<KlineRawType[], AxiosError | Error>>;
  livePrice: string | null;
  errorConnection: boolean;
  onPressRetry: () => void;
  widthChart: number;
  heightChart: number;
  changeWidthChart: (value: number) => void;
  changeHeightChart: (value: number) => void;
};
