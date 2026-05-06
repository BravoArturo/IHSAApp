import { filterCryptos } from '../filterCryptos';
import { CryptoAPIType } from '../../../models/crypto/api/types';

const makeCrypto = (symbol: string): CryptoAPIType =>
  ({ symbol } as CryptoAPIType);

describe('filterCryptos', () => {
  const cryptos: CryptoAPIType[] = [
    makeCrypto('BTCUSDT'),
    makeCrypto('ETHUSDT'),
    makeCrypto('SOLUSDT'),
    makeCrypto('ADAUSDT'),
  ];

  it('returns empty array when text is empty string', () => {
    const result = filterCryptos(cryptos, '');
    expect(result).toEqual([]);
  });

  it('filters cryptos whose symbol includes the text (case-insensitive)', () => {
    const result = filterCryptos(cryptos, 'btc');
    expect(result).toEqual([makeCrypto('BTCUSDT')]);
  });

  it('matches multiple cryptos when text appears in several symbols', () => {
    const result = filterCryptos(cryptos, 'USDT');
    expect(result).toHaveLength(4);
  });

  it('returns empty array when no symbol matches', () => {
    const result = filterCryptos(cryptos, 'XYZ');
    expect(result).toEqual([]);
  });

  it('returns empty array when input array is empty', () => {
    const result = filterCryptos([], 'btc');
    expect(result).toEqual([]);
  });

  it('does not mutate the original array', () => {
    const original = [...cryptos];
    filterCryptos(cryptos, 'btc');
    expect(cryptos).toEqual(original);
  });
});
