import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { MenuViewProps } from './types';
import useMenuViewModel from './useMenuViewModel';
import { CryptoAPIType } from '../../models/crypto/api/types';

const POLLING_INTERVAL_MS = 3000;
const MAX_RETRIES = 3;

const useMenuViewController = (): MenuViewProps => {
  const { getCryptoData, getCryptoCache, setCryptoCache } = useMenuViewModel();
  const [cryptos, setCryptos] = useState<CryptoAPIType[]>(
    getCryptoCache() ?? [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorConnection, setErrorConnection] = useState<boolean>(false);
  const [isOnForeground, setIsOnForeground] = useState<boolean>(
    AppState.currentState === 'active',
  );
  const errorCounterRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchControllerRef = useRef<AbortController | null>(null);

  const handleChangeCryptos = (value: CryptoAPIType[]) => {
    setCryptos(value);
    setCryptoCache(value);
  };

  const handleChangeIsLoading = (value: boolean) => {
    setIsLoading(value);
  };

  const handleChangeErrorConnection = (value: boolean) => {
    setErrorConnection(value);
  };

  const handleChangeIsOnForeground = (value: boolean) => {
    setIsOnForeground(value);
  };

  const clearPollingInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    fetchControllerRef.current?.abort();
  };

  const getAndSetData = async () => {
    fetchControllerRef.current?.abort();
    const controller = new AbortController();
    fetchControllerRef.current = controller;

    const res = await getCryptoData(controller.signal);

    if (controller.signal.aborted) return;

    if (res.message === 'success') {
      handleChangeCryptos(res.response);
      handleChangeIsLoading(false);
      errorCounterRef.current = 0;
      console.log('cryptos:', res.response);
    } else {
      errorCounterRef.current += 1;
      console.log('error attempt:', errorCounterRef.current, res.error);
      if (errorCounterRef.current < MAX_RETRIES) {
        await getAndSetData();
      } else {
        clearPollingInterval();
        handleChangeErrorConnection(true);
      }
    }
  };

  const onPressRetry = () => {
    handleChangeIsLoading(true);
    handleChangeErrorConnection(false);
  };

  const handlePressItem = useCallback((item: CryptoAPIType) => {
    console.log(item);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        handleChangeIsOnForeground(state === 'active');
      },
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (errorConnection || !isOnForeground) {
      return;
    }
    getAndSetData();
    intervalRef.current = setInterval(() => {
      getAndSetData();
    }, POLLING_INTERVAL_MS);

    return () => {
      clearPollingInterval();
      errorCounterRef.current = 0;
    };
  }, [errorConnection, isOnForeground]);

  return {
    cryptos,
    isLoading,
    errorConnection,
    onPressRetry,
    onPressItem: handlePressItem,
  };
};

export default useMenuViewController;
