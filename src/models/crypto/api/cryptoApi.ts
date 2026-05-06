import axios from 'axios';
import { CryptoAPIType } from './types';

export const getCryptoAPI = async (
  symbol: string[],
): Promise<CryptoAPIType[]> => {
  return new Promise(async (resolve, reject) => {
    const symbolsParam = encodeURIComponent(JSON.stringify(symbol));
    const URL = `https://data-api.binance.vision/api/v3/ticker/24hr?symbols=${symbolsParam}`;
    try {
      const response = await axios.get(URL);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
