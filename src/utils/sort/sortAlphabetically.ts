import { CryptoAPIType } from '../../models/crypto/api/types';

export const sortAlphabetically = (
  cryptos: CryptoAPIType[],
  enabled: boolean,
): CryptoAPIType[] => {
  if (!enabled) return cryptos;
  return [...cryptos].sort((a, b) => a.symbol.localeCompare(b.symbol));
};
