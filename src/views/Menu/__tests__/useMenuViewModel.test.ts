import { renderHook } from '@testing-library/react-native';
import { AxiosError } from 'axios';

jest.mock('../../../models/crypto/api/cryptoApi');
jest.mock('../../../models/crypto/storage/cryptoStorage', () => ({
  getCryptoCache: jest.fn(),
  setCryptoCache: jest.fn(),
}));

import { getCryptoAPI } from '../../../models/crypto/api/cryptoApi';
import useMenuViewModel from '../useMenuViewModel';
import { CryptoAPIType } from '../../../models/crypto/api/types';

const getCryptoAPIMock = getCryptoAPI as jest.Mock;

const makeCrypto = (symbol: string): CryptoAPIType =>
  ({ symbol, lastPrice: '100' } as CryptoAPIType);

describe('useMenuViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCryptoData', () => {
    it('returns success with response when API resolves', async () => {
      const fakeData = [makeCrypto('BTCUSDT'), makeCrypto('ETHUSDT')];
      getCryptoAPIMock.mockResolvedValueOnce(fakeData);

      const { result } = renderHook(() => useMenuViewModel());
      const response = await result.current.getCryptoData();

      expect(response).toEqual({
        message: 'success',
        response: fakeData,
      });
    });

    it('returns error wrapper when API rejects', async () => {
      const fakeError = new Error('network down');
      getCryptoAPIMock.mockRejectedValueOnce(fakeError);

      const { result } = renderHook(() => useMenuViewModel());
      const response = await result.current.getCryptoData();

      expect(response).toMatchObject({
        message: 'error',
        error: fakeError,
      });
    });

    it('passes the SYMBOLS constant to getCryptoAPI', async () => {
      getCryptoAPIMock.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useMenuViewModel());
      await result.current.getCryptoData();

      expect(getCryptoAPIMock).toHaveBeenCalledWith(
        expect.arrayContaining(['BTCUSDT', 'ETHUSDT', 'BNBUSDT']),
        undefined,
      );
    });

    it('forwards the AbortSignal to getCryptoAPI', async () => {
      getCryptoAPIMock.mockResolvedValueOnce([]);
      const controller = new AbortController();

      const { result } = renderHook(() => useMenuViewModel());
      await result.current.getCryptoData(controller.signal);

      expect(getCryptoAPIMock).toHaveBeenCalledWith(
        expect.any(Array),
        controller.signal,
      );
    });

    it('returns AxiosError shape when API rejects with one', async () => {
      const axiosError = new Error('Request failed') as AxiosError;
      axiosError.isAxiosError = true;
      getCryptoAPIMock.mockRejectedValueOnce(axiosError);

      const { result } = renderHook(() => useMenuViewModel());
      const response = await result.current.getCryptoData();

      if (response.message === 'error') {
        expect(response.error).toBe(axiosError);
      } else {
        throw new Error('expected error response');
      }
    });
  });
});
