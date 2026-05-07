import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { ChartStatsType, CryptoDetailViewProps, KlinePointType } from './types';
import useCryptoDetailViewModel from './useCryptoDetailViewModel';
import { parseKlines } from '../../utils/klines/parseKlines';

const useCryptoDetailViewController = (): CryptoDetailViewProps => {
  const {
    params,
    getCryptoKlinesData,
    livePrice,
    errorConnection,
    onPressRetry,
    widthChart,
    heightChart,
    changeWidthChart,
    changeHeightChart,
  } = useCryptoDetailViewModel();
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

  const onLayoutChart = useCallback(
    (event: LayoutChangeEvent) => {
      changeWidthChart(event.nativeEvent.layout.width);
      changeHeightChart(event.nativeEvent.layout.height);
    },
    [changeWidthChart, changeHeightChart],
  );

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
    setTimeout(() => {
      handleChangeIsChartLoading(false);
    }, 2500);
  };

  useEffect(() => {
    (async () => {
      await getAndSetKlines();
    })();
    return () => {
      fetchControllerRef.current?.abort();
    };
  }, []);

  const stats = useMemo<ChartStatsType | null>(() => {
    if (klines.length === 0) return null;
    const values = klines.map(k => k.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const first = klines[0].value;
    const last = klines[klines.length - 1].value;
    const variation = first === 0 ? 0 : ((last - first) / first) * 100;
    return { max, min, variation };
  }, [klines]);

  return {
    item: params.item,
    klines,
    isChartLoading,
    chartError,
    livePrice,
    errorConnection,
    onPressRetry,
    widthChart,
    heightChart,
    onLayoutChart,
    stats,
  };
};

export default useCryptoDetailViewController;
