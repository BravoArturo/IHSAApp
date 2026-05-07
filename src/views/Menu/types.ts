import { AxiosError } from 'axios';
import { CryptoAPIType } from '../../models/crypto/api/types';
import { ResponseAPIType } from '../../utils/typesResponse';
import { ErrorConnectionPropsType } from '../components/ErrorConnection/types';
import { InputFilterPropsType } from './components/InputFilter/types';
import { CryptoItem } from './components/CryptoListItem/types';
import { SortTogglePropsType } from './components/SortToggle/types';

export type MenuViewProps = ErrorConnectionPropsType &
  InputFilterPropsType &
  SortTogglePropsType & {
    cryptosFiltered: CryptoAPIType[];
    text: string;
    isLoading: boolean;
    errorConnection: boolean;
    onPressItem: (item: CryptoAPIType) => void;
    onEndReached: () => void;
  };

export type MenuViewModelType = {
  getCryptoData: (
    signal?: AbortSignal,
  ) => Promise<ResponseAPIType<CryptoAPIType[], AxiosError | Error>>;
  getCryptoCache: () => CryptoAPIType[] | undefined;
  setCryptoCache: (data: CryptoAPIType[]) => void;
  navigateToCryptoDetail: (item: CryptoItem) => void;
  isFocused: boolean;
  isOnForeground: boolean;
};
