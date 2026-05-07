import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppStateStore } from '../../../app/state/store/appStateStore';
import { BinanceTradeEvent, UseCryptoTradeStreamReturn } from '../types';
import {
  BASE_RECONNECT_DELAY_MS,
  BINANCE_WS_BASE,
  MAX_RETRIES,
} from '../constants';

export function useCryptoTradeStream(
  symbol: string,
): UseCryptoTradeStreamReturn {
  const isOnline = useAppStateStore(state => state.isOnline);
  const [livePrice, setLivePrice] = useState<string | null>(null);
  const [errorConnection, setErrorConnection] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const errorCounterRef = useRef<number>(0);

  const handleChangeLivePrice = useCallback((value: string) => {
    setLivePrice(value);
  }, []);

  const handleChangeErrorConnection = useCallback((value: boolean) => {
    setErrorConnection(value);
  }, []);

  const onPressRetry = useCallback(() => {
    errorCounterRef.current = 0;
    handleChangeErrorConnection(false);
  }, [handleChangeErrorConnection]);

  useEffect(() => {
    if (!symbol || !isOnline || errorConnection) {
      return;
    }

    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      const url = `${BINANCE_WS_BASE}/${symbol.toLowerCase()}@trade`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('se abrio');

        if (cancelled) return;
        errorCounterRef.current = 0;
      };

      ws.onmessage = event => {
        if (cancelled) return;
        try {
          const data: BinanceTradeEvent = JSON.parse(event.data);
          handleChangeLivePrice(data.p);
        } catch {}
      };

      ws.onerror = () => {};

      ws.onclose = () => {
        if (cancelled) return;
        errorCounterRef.current += 1;
        if (errorCounterRef.current < MAX_RETRIES) {
          const backoffMs =
            BASE_RECONNECT_DELAY_MS * 2 ** (errorCounterRef.current - 1);
          reconnectTimeoutRef.current = setTimeout(connect, backoffMs);
        } else {
          handleChangeErrorConnection(true);
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.onopen = null;
        wsRef.current.onmessage = null;
        wsRef.current.onerror = null;
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [
    symbol,
    isOnline,
    errorConnection,
    handleChangeLivePrice,
    handleChangeErrorConnection,
  ]);

  return { livePrice, errorConnection, onPressRetry };
}
