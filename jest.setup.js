import '@testing-library/jest-native/extend-expect';
import { AppState } from 'react-native';

AppState.currentState = 'active';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
  })),
}));

jest.mock('react-native-mmkv', () => {
  const createInstance = () => {
    const store = new Map();
    return {
      set: (key, value) => store.set(key, value),
      getString: key => store.get(key),
      getNumber: key => store.get(key),
      getBoolean: key => store.get(key),
      delete: key => store.delete(key),
      clearAll: () => store.clear(),
      contains: key => store.has(key),
    };
  };
  return {
    MMKV: function MMKV() {
      return createInstance();
    },
    createMMKV: () => createInstance(),
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: jest.fn(() => ({
    isInternetReachable: true,
    isConnected: true,
  })),
  default: {
    fetch: jest.fn(() =>
      Promise.resolve({ isInternetReachable: true, isConnected: true }),
    ),
  },
}));

jest.mock('react-native-haptic-feedback', () => ({
  __esModule: true,
  default: { trigger: jest.fn() },
  trigger: jest.fn(),
}));

jest.mock('@shopify/flash-list', () => {
  const { FlatList } = require('react-native');
  return { FlashList: FlatList };
});

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
  };
});
