import { AxiosError } from 'axios';
import { CryptoAPIType } from '../../models/crypto/api/types';
import { ResponseAPIType } from '../../utils/typesResponse';
import { ErrorConnectionPropsType } from '../components/ErrorConnection/types';

export type MenuViewProps = ErrorConnectionPropsType & {
  cryptos: CryptoAPIType[];
  isLoading: boolean;
  errorConnection: boolean;
  onPressItem: (item: CryptoAPIType) => void;
};

export type MenuViewModelType = {
  getCryptoData: (
    signal?: AbortSignal,
  ) => Promise<ResponseAPIType<CryptoAPIType[], AxiosError | Error>>;
  getCryptoCache: () => CryptoAPIType[] | undefined;
  setCryptoCache: (data: CryptoAPIType[]) => void;
};
