import axios from 'axios';
import { CryptoAPIType, KlineRawType } from './types';
import { KLINE_INTERVAL, KLINE_LIMIT } from '../constants/cryptoConstants';

export const getCryptoAPI = async (
  symbol: string[],
  signal?: AbortSignal,
): Promise<CryptoAPIType[]> => {
  return new Promise(async (resolve, reject) => {
    const symbolsParam = encodeURIComponent(JSON.stringify(symbol));
    const URL = `https://data-api.binance.vision/api/v3/ticker/24hr?symbols=${symbolsParam}`;
    try {
      const response = await axios.get(URL, { signal });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCryptoKlinesAPI = async (
  symbol: string,
  signal?: AbortSignal,
): Promise<KlineRawType[]> => {
  return new Promise(async (resolve, reject) => {
    const URL = `https://data-api.binance.vision/api/v3/klines?symbol=${symbol}&interval=${KLINE_INTERVAL}&limit=${KLINE_LIMIT}`;
    try {
      const response = await axios.get(URL, { signal });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
