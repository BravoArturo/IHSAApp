import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAppStateStore } from '../../../../app/state/store/appStateStore';
import { useCryptoTradeStream } from '../useCryptoTradeStream';
import { BASE_RECONNECT_DELAY_MS, MAX_RETRIES } from '../../constants';

type MockWS = {
  url: string;
  onopen: ((ev?: unknown) => void) | null;
  onmessage: ((ev: { data: string }) => void) | null;
  onerror: ((ev?: unknown) => void) | null;
  onclose: ((ev?: unknown) => void) | null;
  close: jest.Mock;
};

const wsInstances: MockWS[] = [];

beforeAll(() => {
  (globalThis as unknown as { WebSocket: jest.Mock }).WebSocket = jest.fn(
    (url: string) => {
      const instance: MockWS = {
        url,
        onopen: null,
        onmessage: null,
        onerror: null,
        onclose: null,
        close: jest.fn(),
      };
      wsInstances.push(instance);
      return instance;
    },
  ) as unknown as jest.Mock;
});

const lastWS = (): MockWS => wsInstances[wsInstances.length - 1];

describe('useCryptoTradeStream', () => {
  beforeEach(() => {
    wsInstances.length = 0;
    useAppStateStore.setState({ isOnline: true });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not open a WebSocket when symbol is empty', () => {
    renderHook(() => useCryptoTradeStream(''));
    expect(wsInstances).toHaveLength(0);
  });

  it('does not open a WebSocket when offline', () => {
    useAppStateStore.setState({ isOnline: false });
    renderHook(() => useCryptoTradeStream('BTCUSDT'));
    expect(wsInstances).toHaveLength(0);
  });

  it('opens the WebSocket using lowercase symbol on the @trade stream', () => {
    renderHook(() => useCryptoTradeStream('BTCUSDT'));

    expect(wsInstances).toHaveLength(1);
    expect(lastWS().url).toContain('btcusdt@trade');
  });

  it('updates livePrice from incoming trade events', () => {
    const { result } = renderHook(() => useCryptoTradeStream('BTCUSDT'));

    expect(result.current.livePrice).toBeNull();

    act(() => {
      lastWS().onmessage?.({
        data: JSON.stringify({
          e: 'trade',
          s: 'BTCUSDT',
          p: '42000.50',
          q: '0.1',
        }),
      });
    });

    expect(result.current.livePrice).toBe('42000.50');
  });

  it('ignores malformed messages without crashing', () => {
    const { result } = renderHook(() => useCryptoTradeStream('BTCUSDT'));

    act(() => {
      lastWS().onmessage?.({ data: 'not-json' });
    });

    expect(result.current.livePrice).toBeNull();
  });

  it('reconnects with exponential backoff after onclose', () => {
    jest.useFakeTimers();
    renderHook(() => useCryptoTradeStream('BTCUSDT'));

    expect(wsInstances).toHaveLength(1);

    act(() => {
      lastWS().onclose?.();
    });

    act(() => {
      jest.advanceTimersByTime(BASE_RECONNECT_DELAY_MS);
    });

    expect(wsInstances).toHaveLength(2);

    act(() => {
      lastWS().onclose?.();
    });

    act(() => {
      jest.advanceTimersByTime(BASE_RECONNECT_DELAY_MS * 2);
    });

    expect(wsInstances).toHaveLength(3);
  });

  it('sets errorConnection=true after MAX_RETRIES failed attempts', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useCryptoTradeStream('BTCUSDT'));

    for (let i = 0; i < MAX_RETRIES; i++) {
      act(() => {
        lastWS().onclose?.();
      });
      act(() => {
        jest.advanceTimersByTime(BASE_RECONNECT_DELAY_MS * 2 ** i);
      });
    }

    await waitFor(() => {
      expect(result.current.errorConnection).toBe(true);
    });
  });

  it('clears the error and reconnects when onPressRetry is called', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useCryptoTradeStream('BTCUSDT'));

    for (let i = 0; i < MAX_RETRIES; i++) {
      act(() => {
        lastWS().onclose?.();
      });
      act(() => {
        jest.advanceTimersByTime(BASE_RECONNECT_DELAY_MS * 2 ** i);
      });
    }

    await waitFor(() => {
      expect(result.current.errorConnection).toBe(true);
    });

    const wsCountBefore = wsInstances.length;

    act(() => {
      result.current.onPressRetry();
    });

    await waitFor(() => {
      expect(result.current.errorConnection).toBe(false);
    });
    expect(wsInstances.length).toBeGreaterThan(wsCountBefore);
  });

  it('closes the WebSocket and clears handlers on unmount', () => {
    const { unmount } = renderHook(() => useCryptoTradeStream('BTCUSDT'));
    const ws = lastWS();

    unmount();

    expect(ws.close).toHaveBeenCalled();
    expect(ws.onopen).toBeNull();
    expect(ws.onmessage).toBeNull();
    expect(ws.onerror).toBeNull();
    expect(ws.onclose).toBeNull();
  });
});
