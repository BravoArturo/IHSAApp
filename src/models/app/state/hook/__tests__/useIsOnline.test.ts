import { renderHook, act } from '@testing-library/react-native';
import { useNetInfo } from '@react-native-community/netinfo';

jest.mock('../../api/probe', () => ({
  probeInternet: jest.fn(),
}));

import { useIsOnline } from '../useIsOnline';
import { probeInternet } from '../../api/probe';
import { useAppStateStore } from '../../store/appStateStore';

const useNetInfoMock = useNetInfo as jest.Mock;
const probeInternetMock = probeInternet as jest.Mock;

describe('useIsOnline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStateStore.setState({ isOnline: true });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sets isOnline=true when isInternetReachable is true', () => {
    useNetInfoMock.mockReturnValue({
      isInternetReachable: true,
      isConnected: true,
    });

    const { result } = renderHook(() => useIsOnline());

    expect(result.current.isOnline).toBe(true);
  });

  it('sets isOnline=false when isInternetReachable is false', () => {
    useNetInfoMock.mockReturnValue({
      isInternetReachable: false,
      isConnected: true,
    });

    const { result } = renderHook(() => useIsOnline());

    expect(result.current.isOnline).toBe(false);
  });

  it('sets isOnline=false when isInternetReachable is null and isConnected is false', () => {
    useNetInfoMock.mockReturnValue({
      isInternetReachable: null,
      isConnected: false,
    });

    const { result } = renderHook(() => useIsOnline());

    expect(result.current.isOnline).toBe(false);
  });

  it('starts polling probeInternet when both flags are null', async () => {
    useNetInfoMock.mockReturnValue({
      isInternetReachable: null,
      isConnected: null,
    });
    probeInternetMock.mockResolvedValue(true);

    jest.useFakeTimers();

    renderHook(() => useIsOnline());

    expect(probeInternetMock).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(probeInternetMock).toHaveBeenCalledWith(4000);
  });

  it('updates isOnline based on probeInternet result during polling', async () => {
    useNetInfoMock.mockReturnValue({
      isInternetReachable: null,
      isConnected: null,
    });
    probeInternetMock.mockResolvedValue(false);

    jest.useFakeTimers();

    const { result } = renderHook(() => useIsOnline());

    await act(async () => {
      jest.advanceTimersByTime(3000);
      await Promise.resolve();
    });

    expect(result.current.isOnline).toBe(false);
  });

  it('cleans up the interval when the hook unmounts', () => {
    useNetInfoMock.mockReturnValue({
      isInternetReachable: null,
      isConnected: null,
    });

    jest.useFakeTimers();
    const clearSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useIsOnline());
    unmount();

    expect(clearSpy).toHaveBeenCalled();

    clearSpy.mockRestore();
  });
});
