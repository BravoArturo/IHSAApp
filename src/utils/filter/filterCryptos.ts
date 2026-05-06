import { CryptoAPIType } from '../../models/crypto/api/types';

export const filterCryptos = (
  cryptos: CryptoAPIType[],
  text: string,
): CryptoAPIType[] => {
  if (text === '') {
    return [];
  }
  return cryptos.filter(({ symbol }) =>
    symbol.toLowerCase().includes(text.toLowerCase()),
  );
};
