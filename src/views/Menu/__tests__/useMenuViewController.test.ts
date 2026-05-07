import { renderHook, act, waitFor } from '@testing-library/react-native';

jest.mock('../useMenuViewModel', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useMenuViewController from '../useMenuViewController';
import useMenuViewModel from '../useMenuViewModel';
import { CryptoAPIType } from '../../../models/crypto/api/types';

const useMenuViewModelMock = useMenuViewModel as jest.Mock;

const mockViewModel = (
  getCryptoData: jest.Mock,
  cache: CryptoAPIType[] | undefined = undefined,
) => {
  useMenuViewModelMock.mockReturnValue({
    getCryptoData,
    getCryptoCache: jest.fn(() => cache),
    setCryptoCache: jest.fn(),
    navigateToCryptoDetail: jest.fn(),
    isFocused: true,
    isOnForeground: true,
  });
};

const makeCrypto = (symbol: string): CryptoAPIType =>
  ({ symbol, lastPrice: '100' } as CryptoAPIType);

describe('useMenuViewController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('populates cryptosFiltered and turns off loading on successful fetch', async () => {
    const fakeData = [makeCrypto('BTCUSDT'), makeCrypto('ETHUSDT')];
    const getCryptoData = jest
      .fn()
      .mockResolvedValue({ message: 'success', response: fakeData });
    mockViewModel(getCryptoData);

    const { result } = renderHook(() => useMenuViewController());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.cryptosFiltered).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.cryptosFiltered).toEqual(fakeData);
  });

  it('sets errorConnection=true after MAX_RETRIES (3) consecutive failures', async () => {
    const error = new Error('network');
    const getCryptoData = jest
      .fn()
      .mockResolvedValue({ message: 'error', error });
    mockViewModel(getCryptoData);

    const { result } = renderHook(() => useMenuViewController());

    await waitFor(() => {
      expect(getCryptoData).toHaveBeenCalledTimes(3);
    });

    await waitFor(() => {
      expect(result.current.errorConnection).toBe(true);
    });
  });

  it('resets errorConnection when onPressRetry is called', async () => {
    const getCryptoData = jest
      .fn()
      .mockResolvedValue({ message: 'error', error: new Error('boom') });
    mockViewModel(getCryptoData);

    const { result } = renderHook(() => useMenuViewController());

    await waitFor(() => {
      expect(result.current.errorConnection).toBe(true);
    });

    getCryptoData.mockResolvedValue({
      message: 'success',
      response: [makeCrypto('BTCUSDT')],
    });

    await act(async () => {
      result.current.onPressRetry();
    });

    await waitFor(() => {
      expect(result.current.errorConnection).toBe(false);
    });
    await waitFor(() => {
      expect(result.current.cryptosFiltered).toEqual([makeCrypto('BTCUSDT')]);
    });
  });

  it('uses cached cryptos as initial state when cache exists', async () => {
    const cached = [makeCrypto('CACHEDUSDT')];
    const getCryptoData = jest.fn(() => new Promise(() => {}));
    mockViewModel(getCryptoData, cached);

    const { result } = renderHook(() => useMenuViewController());

    await waitFor(() => {
      expect(result.current.cryptosFiltered).toEqual(cached);
    });
  });

  it('exposes onChangeText that updates the text state after debounce', () => {
    jest.useFakeTimers();
    const getCryptoData = jest.fn(() => new Promise(() => {}));
    mockViewModel(getCryptoData);

    const { result } = renderHook(() => useMenuViewController());

    expect(result.current.text).toBe('');

    act(() => {
      result.current.onChangeText('btc');
    });

    expect(result.current.text).toBe('');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.text).toBe('btc');
  });

  it('exposes valueToggle=false initially and updates when onToggle is called', () => {
    const getCryptoData = jest.fn(() => new Promise(() => {}));
    mockViewModel(getCryptoData);

    const { result } = renderHook(() => useMenuViewController());

    expect(result.current.valueToggle).toBe(false);

    act(() => {
      result.current.onToggle(true);
    });

    expect(result.current.valueToggle).toBe(true);
  });

  it('sorts cryptosFiltered alphabetically when valueToggle is true and text is empty', async () => {
    const fakeData = [
      makeCrypto('ETHUSDT'),
      makeCrypto('BTCUSDT'),
      makeCrypto('ADAUSDT'),
    ];
    const getCryptoData = jest
      .fn()
      .mockResolvedValue({ message: 'success', response: fakeData });
    mockViewModel(getCryptoData);

    const { result } = renderHook(() => useMenuViewController());

    await waitFor(() => {
      expect(result.current.cryptosFiltered).toEqual(fakeData);
    });

    act(() => {
      result.current.onToggle(true);
    });

    await waitFor(() => {
      expect(result.current.cryptosFiltered.map(c => c.symbol)).toEqual([
        'ADAUSDT',
        'BTCUSDT',
        'ETHUSDT',
      ]);
    });
  });

  it('exposes onEndReached as a function', () => {
    const getCryptoData = jest.fn(() => new Promise(() => {}));
    mockViewModel(getCryptoData);

    const { result } = renderHook(() => useMenuViewController());

    expect(typeof result.current.onEndReached).toBe('function');
  });
});
