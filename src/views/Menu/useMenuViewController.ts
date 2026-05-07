import { useCallback, useEffect, useRef, useState } from 'react';
import { MenuViewProps } from './types';
import useMenuViewModel from './useMenuViewModel';
import { CryptoAPIType } from '../../models/crypto/api/types';
import { filterCryptos } from '../../utils/filter/filterCryptos';
import { sortAlphabetically } from '../../utils/sort/sortAlphabetically';

const POLLING_INTERVAL_MS = 5000;
const MAX_RETRIES = 3;
const VISIBLE_COUNT_INITIAL = 10;
const VISIBLE_COUNT_INCREMENT = 10;

const useMenuViewController = (): MenuViewProps => {
  const {
    getCryptoData,
    getCryptoCache,
    setCryptoCache,
    navigateToCryptoDetail,
    isFocused,
    isOnForeground,
  } = useMenuViewModel();
  const [cryptos, setCryptos] = useState<CryptoAPIType[]>(
    getCryptoCache() ?? [],
  );
  const [cryptosFiltered, setCryptosFiltered] = useState<CryptoAPIType[]>([]);
  const [text, setText] = useState<string>('');
  const [alphabetical, setAlphabetical] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(
    VISIBLE_COUNT_INITIAL,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorConnection, setErrorConnection] = useState<boolean>(false);
  const errorCounterRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    handleFilterData(cryptos, text, alphabetical, visibleCount);
  }, [cryptos, text, alphabetical, visibleCount]);

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

  const handleChangeCryptosFiltered = (value: CryptoAPIType[]) => {
    setCryptosFiltered(value);
  };

  const handleChangeVisibleCount = (value: number) => {
    setVisibleCount(value);
  };

  const handleChangeText = useCallback((value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setText(value);
    }, 500);
  }, []);

  const handleChangeAlphabetical = useCallback((value: boolean) => {
    setAlphabetical(value);
  }, []);

  const handleFilterData = (
    cryptos: CryptoAPIType[],
    text: string,
    alphabetical: boolean,
    visibleCount: number,
  ) => {
    const filtered = filterCryptos(cryptos, text);
    const base = text === '' ? cryptos : filtered;
    const sorted = sortAlphabetically(base, alphabetical);
    const final =
      visibleCount >= cryptos.length ? sorted : sorted.slice(0, visibleCount);
    handleChangeCryptosFiltered(final);
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

  const onEndReached = useCallback(() => {
    if (visibleCount >= cryptos.length) return;
    setTimeout(() => {
      handleChangeVisibleCount(visibleCount + VISIBLE_COUNT_INCREMENT);
    }, 1500);
  }, [visibleCount, cryptos.length]);

  return {
    cryptosFiltered,
    text,
    isLoading,
    errorConnection,
    valueToggle: alphabetical,
    onToggle: handleChangeAlphabetical,
    onPressRetry,
    onPressItem: navigateToCryptoDetail,
    onChangeText: handleChangeText,
    onEndReached,
  };
};

export default useMenuViewController;
