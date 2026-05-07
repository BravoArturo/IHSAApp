import { sortAlphabetically } from '../sortAlphabetically';
import { CryptoAPIType } from '../../../models/crypto/api/types';

const makeCrypto = (symbol: string): CryptoAPIType =>
  ({ symbol } as CryptoAPIType);

describe('sortAlphabetically', () => {
  const cryptos: CryptoAPIType[] = [
    makeCrypto('ETHUSDT'),
    makeCrypto('BTCUSDT'),
    makeCrypto('SOLUSDT'),
    makeCrypto('ADAUSDT'),
  ];

  it('returns the same array when enabled is false', () => {
    const result = sortAlphabetically(cryptos, false);
    expect(result).toBe(cryptos);
  });

  it('returns a new array sorted by symbol when enabled is true', () => {
    const result = sortAlphabetically(cryptos, true);
    expect(result.map(c => c.symbol)).toEqual([
      'ADAUSDT',
      'BTCUSDT',
      'ETHUSDT',
      'SOLUSDT',
    ]);
  });

  it('does not mutate the original array when enabled is true', () => {
    const original = cryptos.map(c => c.symbol);
    sortAlphabetically(cryptos, true);
    expect(cryptos.map(c => c.symbol)).toEqual(original);
  });

  it('returns empty array when input is empty regardless of flag', () => {
    expect(sortAlphabetically([], true)).toEqual([]);
    expect(sortAlphabetically([], false)).toEqual([]);
  });

  it('keeps already-sorted input stable when enabled is true', () => {
    const sorted = [makeCrypto('ADAUSDT'), makeCrypto('BTCUSDT')];
    const result = sortAlphabetically(sorted, true);
    expect(result.map(c => c.symbol)).toEqual(['ADAUSDT', 'BTCUSDT']);
  });
});
