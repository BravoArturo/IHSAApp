import { useEffect } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { useAppStateStore } from '../store/appStateStore';
import { probeInternet } from '../api/probe';
import { UseIsOnlineReturn } from './types';

const PROBE_TIMEOUT_MS = 4000;
const POLL_INTERVAL_MS = 3000;

export function useIsOnline(): UseIsOnlineReturn {
  const isOnline = useAppStateStore(state => state.isOnline);
  const changeIsOnline = useAppStateStore(state => state.changeIsOnline);
  const { isInternetReachable, isConnected } = useNetInfo();

  useEffect(() => {
    if (isInternetReachable !== null) {
      changeIsOnline(isInternetReachable);
      return;
    }
    if (isConnected === false) {
      changeIsOnline(false);
      return;
    }

    const intervalId = setInterval(async () => {
      const result = await probeInternet(PROBE_TIMEOUT_MS);
      changeIsOnline(result);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isInternetReachable, isConnected]);

  return { isOnline };
}
