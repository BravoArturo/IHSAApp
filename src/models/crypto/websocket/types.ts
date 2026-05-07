export type BinanceTradeEvent = {
  e: 'trade';
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  T: number;
  m: boolean;
  M: boolean;
};

export type UseCryptoTradeStreamReturn = {
  livePrice: string | null;
  errorConnection: boolean;
  onPressRetry: () => void;
};
