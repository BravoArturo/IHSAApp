import { AxiosError } from 'axios';
import { MenuViewModelType } from './types';
import { getCryptoAPI } from '../../models/crypto/api/cryptoApi';
import { CryptoAPIType } from '../../models/crypto/api/types';
import { SYMBOLS } from '../../models/crypto/constants/cryptoConstants';
import { ResponseAPIType } from '../../utils/typesResponse';
import {
  getCryptoCache,
  setCryptoCache,
} from '../../models/crypto/storage/cryptoStorage';

const useMenuViewModel = (): MenuViewModelType => {
  const getCryptoData = async (
    signal?: AbortSignal,
  ): Promise<ResponseAPIType<CryptoAPIType[], AxiosError | Error>> => {
    try {
      const response = await getCryptoAPI(SYMBOLS, signal);
      return { message: 'success', response };
    } catch (error) {
      return { message: 'error', error: error as AxiosError | Error };
    }
  };

  return { getCryptoData, getCryptoCache, setCryptoCache };
};

export default useMenuViewModel;
