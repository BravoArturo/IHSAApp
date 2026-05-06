import { createMMKV } from 'react-native-mmkv';
import { CryptoAPIType } from '../api/types';

const storage = createMMKV();

const CRYPTO_CACHE_KEY = 'cryptoCache';

export const getCryptoCache = (): CryptoAPIType[] | undefined => {
  const raw = storage.getString(CRYPTO_CACHE_KEY);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as CryptoAPIType[];
  } catch {
    return undefined;
  }
};

export const setCryptoCache = (data: CryptoAPIType[]): void => {
  storage.set(CRYPTO_CACHE_KEY, JSON.stringify(data));
};
