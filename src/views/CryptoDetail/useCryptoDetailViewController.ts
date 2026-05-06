import { useEffect, useRef, useState } from 'react';
import { CryptoDetailViewProps, KlinePointType } from './types';
import useCryptoDetailViewModel from './useCryptoDetailViewModel';
import { parseKlines } from '../../utils/klines/parseKlines';

const useCryptoDetailViewController = (): CryptoDetailViewProps => {
  const { params, getCryptoKlinesData } = useCryptoDetailViewModel();
  const [klines, setKlines] = useState<KlinePointType[]>([]);
  const [isChartLoading, setIsChartLoading] = useState<boolean>(true);
  const [chartError, setChartError] = useState<boolean>(false);
  const fetchControllerRef = useRef<AbortController | null>(null);

  const handleChangeKlines = (value: KlinePointType[]) => {
    setKlines(value);
  };

  const handleChangeIsChartLoading = (value: boolean) => {
    setIsChartLoading(value);
  };

  const handleChangeChartError = (value: boolean) => {
    setChartError(value);
  };

  const getAndSetKlines = async () => {
    fetchControllerRef.current?.abort();
    const controller = new AbortController();
    fetchControllerRef.current = controller;

    const res = await getCryptoKlinesData(
      params.item.symbol,
      controller.signal,
    );

    if (controller.signal.aborted) return;

    if (res.message === 'success') {
      handleChangeKlines(parseKlines(res.response));
      handleChangeChartError(false);
    } else {
      handleChangeChartError(true);
    }
    handleChangeIsChartLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getAndSetKlines();
    })();
    return () => {
      fetchControllerRef.current?.abort();
    };
  }, []);

  return {
    item: params.item,
    klines,
    isChartLoading,
    chartError,
  };
};

export default useCryptoDetailViewController;
