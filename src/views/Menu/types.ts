import { CryptoAPIType } from '../../models/crypto/api/types';
import { ResponseAPIType } from '../../utils/typesResponse';
import { ErrorConnectionPropsType } from '../components/ErrorConnection/types';

export type MenuViewProps = ErrorConnectionPropsType & {
  cryptos: CryptoAPIType[];
  isLoading: boolean;
  errorConnection: boolean;
};

export type MenuViewModelType = {
  getCryptoData: () => Promise<ResponseAPIType<CryptoAPIType[], unknown>>;
};
