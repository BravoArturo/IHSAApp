export type CryptoAPIType = {
  symbol: string;

  priceChange: string;
  priceChangePercent: string;

  weightedAvgPrice: string;

  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;

  bidPrice: string;
  bidQty: string;

  askPrice: string;
  askQty: string;

  openPrice: string;
  highPrice: string;
  lowPrice: string;

  volume: string;
  quoteVolume: string;

  openTime: number;
  closeTime: number;

  firstId: number;
  lastId: number;
  count: number;
};

export type KlineRawType = [
  number, // openTime
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  number, // closeTime
  string, // quoteAssetVolume
  number, // numberOfTrades
  string, // takerBuyBaseAssetVolume
  string, // takerBuyQuoteAssetVolume
  string, // unused
];
