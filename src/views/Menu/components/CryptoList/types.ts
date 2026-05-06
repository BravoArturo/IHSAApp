import { CryptoItem } from '../CryptoListItem/types';

export type CryptoListPropsType = {
  cryptos: CryptoItem[];
  onPressItem: (item: CryptoItem) => void;
};
