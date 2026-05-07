import { renderHook, act } from '@testing-library/react-native';
import { AxiosError } from 'axios';
import { useRoute } from '@react-navigation/native';

jest.mock('../../../models/crypto/api/cryptoApi', () => ({
  getCryptoKlinesAPI: jest.fn(),
}));

jest.mock('../../../models/crypto/websocket/hook/useCryptoTradeStream', () => ({
  useCryptoTradeStream: jest.fn(),
}));

import { getCryptoKlinesAPI } from '../../../models/crypto/api/cryptoApi';
import { useCryptoTradeStream } from '../../../models/crypto/websocket/hook/useCryptoTradeStream';
import { useChartStore } from '../../../models/chart/store/chartStore';
import useCryptoDetailViewModel from '../useCryptoDetailViewModel';
import { CryptoItem } from '../../Menu/components/CryptoListItem/types';
import { KlineRawType } from '../../../models/crypto/api/types';

const getCryptoKlinesAPIMock = getCryptoKlinesAPI as jest.Mock;
const useCryptoTradeStreamMock = useCryptoTradeStream as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

const fakeItem: CryptoItem = {
  symbol: 'BTCUSDT',
  lastPrice: '42000',
  priceChangePercent: '1.5',
} as CryptoItem;

const makeKline = (closeTime: number, close: string): KlineRawType =>
  [0, '0', '0', '0', close, '0', closeTime, '0', 0, '0', '0', '0'] as KlineRawType;

describe('useCryptoDetailViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useChartStore.setState({ widthChart: 0, heightChart: 0 });
    useRouteMock.mockReturnValue({ params: { item: fakeItem } });
    useCryptoTradeStreamMock.mockReturnValue({
      livePrice: null,
      errorConnection: false,
      onPressRetry: jest.fn(),
    });
  });

  it('returns route params with the selected crypto item', () => {
    const { result } = renderHook(() => useCryptoDetailViewModel());

    expect(result.current.params.item).toEqual(fakeItem);
  });

  it('forwards livePrice and errorConnection from the trade stream hook', () => {
    const onPressRetry = jest.fn();
    useCryptoTradeStreamMock.mockReturnValue({
      livePrice: '42500.10',
      errorConnection: true,
      onPressRetry,
    });

    const { result } = renderHook(() => useCryptoDetailViewModel());

    expect(result.current.livePrice).toBe('42500.10');
    expect(result.current.errorConnection).toBe(true);
    expect(result.current.onPressRetry).toBe(onPressRetry);
  });

  it('subscribes the trade stream to the routed symbol', () => {
    renderHook(() => useCryptoDetailViewModel());

    expect(useCryptoTradeStreamMock).toHaveBeenCalledWith('BTCUSDT');
  });

  describe('getCryptoKlinesData', () => {
    it('returns success wrapper with klines when the API resolves', async () => {
      const fakeKlines = [makeKline(1, '100'), makeKline(2, '110')];
      getCryptoKlinesAPIMock.mockResolvedValueOnce(fakeKlines);

      const { result } = renderHook(() => useCryptoDetailViewModel());
      const response = await result.current.getCryptoKlinesData('BTCUSDT');

      expect(response).toEqual({ message: 'success', response: fakeKlines });
    });

    it('returns error wrapper when the API rejects', async () => {
      const fakeError = new Error('network down');
      getCryptoKlinesAPIMock.mockRejectedValueOnce(fakeError);

      const { result } = renderHook(() => useCryptoDetailViewModel());
      const response = await result.current.getCryptoKlinesData('BTCUSDT');

      expect(response).toMatchObject({ message: 'error', error: fakeError });
    });

    it('forwards the AbortSignal to the API', async () => {
      getCryptoKlinesAPIMock.mockResolvedValueOnce([]);
      const controller = new AbortController();

      const { result } = renderHook(() => useCryptoDetailViewModel());
      await result.current.getCryptoKlinesData('ETHUSDT', controller.signal);

      expect(getCryptoKlinesAPIMock).toHaveBeenCalledWith(
        'ETHUSDT',
        controller.signal,
      );
    });

    it('returns an AxiosError shape when the API rejects with one', async () => {
      const axiosError = new Error('Request failed') as AxiosError;
      axiosError.isAxiosError = true;
      getCryptoKlinesAPIMock.mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useCryptoDetailViewModel());
      const response = await result.current.getCryptoKlinesData('BTCUSDT');

      if (response.message === 'error') {
        expect(response.error).toBe(axiosError);
      } else {
        throw new Error('expected error response');
      }
    });
  });

  describe('chart store integration', () => {
    it('exposes initial width/height from the chart store', () => {
      const { result } = renderHook(() => useCryptoDetailViewModel());

      expect(result.current.widthChart).toBe(0);
      expect(result.current.heightChart).toBe(0);
    });

    it('updates widthChart and heightChart through store actions', () => {
      const { result } = renderHook(() => useCryptoDetailViewModel());

      act(() => {
        result.current.changeWidthChart(320);
        result.current.changeHeightChart(180);
      });

      expect(result.current.widthChart).toBe(320);
      expect(result.current.heightChart).toBe(180);
    });
  });
});
