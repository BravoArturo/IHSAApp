import { useEffect, useRef, useState } from 'react';
import { MenuViewProps } from './types';
import useMenuViewModel from './useMenuViewModel';
import { CryptoAPIType } from '../../models/crypto/api/types';

const POLLING_INTERVAL_MS = 3000;
const MAX_RETRIES = 3;

const useMenuViewController = (): MenuViewProps => {
  const { getCryptoData } = useMenuViewModel();
  const [cryptos, setCryptos] = useState<CryptoAPIType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorConnection, setErrorConnection] = useState<boolean>(false);
  const errorCounterRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleChangeCryptos = (value: CryptoAPIType[]) => {
    setCryptos(value);
  };

  const handleChangeIsLoading = (value: boolean) => {
    setIsLoading(value);
  };

  const handleChangeErrorConnection = (value: boolean) => {
    setErrorConnection(value);
  };

  const clearPollingInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getAndSetData = async () => {
    const res = await getCryptoData();
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

  useEffect(() => {
    if (errorConnection) {
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
  }, [errorConnection]);

  return { cryptos, isLoading, errorConnection, onPressRetry };
};

export default useMenuViewController;
