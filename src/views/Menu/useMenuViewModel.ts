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
  const getCryptoData = async (): Promise<
    ResponseAPIType<CryptoAPIType[], unknown>
  > => {
    //uso el unknown pq no tengo tiempo para probar todos los escenarios y posibles respuestas
    try {
      const response = await getCryptoAPI(SYMBOLS);
      return { message: 'success', response };
    } catch (error) {
      return { message: 'error', error };
    }
  };

  return { getCryptoData, getCryptoCache, setCryptoCache };
};

export default useMenuViewModel;
