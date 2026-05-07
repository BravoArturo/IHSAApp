import { useCallback } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';
import { MenuViewModelType } from './types';
import { getCryptoAPI } from '../../models/crypto/api/cryptoApi';
import { CryptoAPIType } from '../../models/crypto/api/types';
import { ResponseAPIType } from '../../utils/typesResponse';
import {
  getCryptoCache,
  setCryptoCache,
} from '../../models/crypto/storage/cryptoStorage';
import { HomeStackNavigationProps } from '../../navigation/HomeStackNavigator/types';
import { CryptoItem } from './components/CryptoListItem/types';
import { useAppStateStore } from '../../models/app/state/store/appStateStore';

const useMenuViewModel = (): MenuViewModelType => {
  const navigation = useNavigation<HomeStackNavigationProps<'Menu'>>();
  const isFocused = useIsFocused();
  const isOnForeground = useAppStateStore(state => state.isOnForeground);

  const getCryptoData = async (
    signal?: AbortSignal,
  ): Promise<ResponseAPIType<CryptoAPIType[], AxiosError | Error>> => {
    try {
      const response = await getCryptoAPI(signal);
      return { message: 'success', response };
    } catch (error) {
      return { message: 'error', error: error as AxiosError | Error };
    }
  };

  const navigateToCryptoDetail = useCallback(
    (item: CryptoItem) => {
      navigation.navigate('CryptoDetail', { item });
    },
    [navigation],
  );

  return {
    getCryptoData,
    getCryptoCache,
    setCryptoCache,
    navigateToCryptoDetail,
    isFocused,
    isOnForeground,
  };
};

export default useMenuViewModel;
