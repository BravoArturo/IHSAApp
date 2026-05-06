import { AxiosError } from 'axios';
import { CryptoItem } from '../Menu/components/CryptoListItem/types';
import { KlineRawType } from '../../models/crypto/api/types';
import { ResponseAPIType } from '../../utils/typesResponse';

export type KlinePointType = {
  timestamp: number;
  value: number;
};

export type CryptoDetailViewProps = {
  item: CryptoItem;
  klines: KlinePointType[];
  isChartLoading: boolean;
  chartError: boolean;
};

export type CryptoDetailViewModelType = {
  params: { item: CryptoItem };
  getCryptoKlinesData: (
    symbol: string,
    signal?: AbortSignal,
  ) => Promise<ResponseAPIType<KlineRawType[], AxiosError | Error>>;
};
