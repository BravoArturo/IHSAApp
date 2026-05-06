import { KlineRawType } from '../../models/crypto/api/types';
import { KlinePointType } from '../../views/CryptoDetail/types';

export const parseKlines = (raw: KlineRawType[]): KlinePointType[] => {
  return raw.map(([openTime, , , , close]) => ({
    timestamp: openTime,
    value: parseFloat(close),
  }));
};
