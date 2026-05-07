import axios from 'axios';
import { CryptoAPIType, KlineRawType } from './types';
import { KLINE_INTERVAL, KLINE_LIMIT } from '../constants/cryptoConstants';

export const getCryptoAPI = async (
  signal?: AbortSignal,
): Promise<CryptoAPIType[]> => {
  const URL = 'https://data-api.binance.vision/api/v3/ticker/24hr';
  const response = await axios.get<CryptoAPIType[]>(URL, { signal });
  return response.data.filter(({ symbol }) => symbol.endsWith('USDT'));
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
