import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { MenuViewProps } from './types';
import useMenuViewModel from './useMenuViewModel';
import { CryptoAPIType } from '../../models/crypto/api/types';
import { filterCryptos } from '../../utils/filter/filterCryptos';

const POLLING_INTERVAL_MS = 3000;
const MAX_RETRIES = 3;

const useMenuViewController = (): MenuViewProps => {
  const {
    getCryptoData,
    getCryptoCache,
    setCryptoCache,
    navigateToCryptoDetail,
    isFocused,
  } = useMenuViewModel();
  const [cryptos, setCryptos] = useState<CryptoAPIType[]>(
    getCryptoCache() ?? [],
  );
  const [cryptosFiltered, setCryptosFiltered] = useState<CryptoAPIType[]>([]);
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorConnection, setErrorConnection] = useState<boolean>(false);
  const [isOnForeground, setIsOnForeground] = useState<boolean>(
    AppState.currentState === 'active',
  );
  const errorCounterRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (errorConnection || !isOnForeground || !isFocused) {
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
  }, [errorConnection, isOnForeground, isFocused]);

  useEffect(() => {
    handleFilterData(cryptos, text);
  }, [cryptos, text]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

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

  const handleChangeCryptosFiltered = (value: CryptoAPIType[]) => {
    setCryptosFiltered(value);
  };

  const handleChangeText = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setText(value);
    }, 500);
  };

  const handleFilterData = (cryptos: CryptoAPIType[], text: string) => {
    handleChangeCryptosFiltered(filterCryptos(cryptos, text));
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
      const cryptos = res.response;
      handleChangeCryptos(cryptos);
      handleChangeIsLoading(false);
      errorCounterRef.current = 0;
    } else {
      errorCounterRef.current += 1;
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

  return {
    cryptos,
    cryptosFiltered,
    text,
    isLoading,
    errorConnection,
    onPressRetry,
    onPressItem: navigateToCryptoDetail,
    onChangeText: handleChangeText,
  };
};

export default useMenuViewController;
