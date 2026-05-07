export type appStateStoreType = {
  isOnline: boolean;
  changeIsOnline: (value: boolean) => void;
  isOnForeground: boolean;
  changeIsOnForeground: (value: boolean) => void;
};
