import { useRoute } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import { AxiosError } from 'axios';
import { CryptoDetailViewModelType } from './types';
import { HomeStackRouteProps } from '../../navigation/HomeStackNavigator/types';
import { getCryptoKlinesAPI } from '../../models/crypto/api/cryptoApi';
import { KlineRawType } from '../../models/crypto/api/types';
import { ResponseAPIType } from '../../utils/typesResponse';
import { useCryptoTradeStream } from '../../models/crypto/websocket/hook/useCryptoTradeStream';
import { useChartStore } from '../../models/chart/store/chartStore';

const useCryptoDetailViewModel = (): CryptoDetailViewModelType => {
  const route = useRoute<HomeStackRouteProps<'CryptoDetail'>>();
  const { params } = route;
  const { livePrice, errorConnection, onPressRetry } = useCryptoTradeStream(
    params.item.symbol,
  );
  const { widthChart, heightChart, changeWidthChart, changeHeightChart } =
    useChartStore(
      useShallow(state => ({
        widthChart: state.widthChart,
        heightChart: state.heightChart,
        changeWidthChart: state.changeWidthChart,
        changeHeightChart: state.changeHeightChart,
      })),
    );

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

  return {
    params,
    getCryptoKlinesData,
    livePrice,
    errorConnection,
    onPressRetry,
    widthChart,
    heightChart,
    changeWidthChart,
    changeHeightChart,
  };
};

export default useCryptoDetailViewModel;
