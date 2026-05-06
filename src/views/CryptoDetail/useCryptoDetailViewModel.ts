import { useRoute } from '@react-navigation/native';
import { AxiosError } from 'axios';
import { CryptoDetailViewModelType } from './types';
import { HomeStackRouteProps } from '../../navigation/HomeStackNavigator/types';
import { getCryptoKlinesAPI } from '../../models/crypto/api/cryptoApi';
import { KlineRawType } from '../../models/crypto/api/types';
import { ResponseAPIType } from '../../utils/typesResponse';

const useCryptoDetailViewModel = (): CryptoDetailViewModelType => {
  const route = useRoute<HomeStackRouteProps<'CryptoDetail'>>();
  const { params } = route;

  const getCryptoKlinesData = async (
    symbol: string,
    signal?: AbortSignal,
  ): Promise<ResponseAPIType<KlineRawType[], AxiosError | Error>> => {
    try {
      const response = await getCryptoKlinesAPI(symbol, signal);
      return { message: 'success', response };
    } catch (error) {
      return { message: 'error', error: error as AxiosError | Error };
    }
  };

  return { params, getCryptoKlinesData };
};

export default useCryptoDetailViewModel;
