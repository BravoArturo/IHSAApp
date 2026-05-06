import { CryptoAPIType } from '../../../../models/crypto/api/types';

export type CryptoItem = CryptoAPIType;

export type CryptoListItemPropsType = {
  item: CryptoItem;
  onPress: (item: CryptoItem) => void;
};
