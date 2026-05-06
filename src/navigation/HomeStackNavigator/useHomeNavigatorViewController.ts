import React from 'react';
import { HomeNavigatorViewProps, HomeStackRoutes } from './types';
import MenuScreen from '../../views/Menu/MenuScreen';
import CryptoDetailScreen from '../../views/CryptoDetail/CryptoDetailScreen';
function useHomeNavigatorViewController(): HomeNavigatorViewProps {
  const routes: HomeStackRoutes = [
    {
      name: 'Menu',
      component: MenuScreen,
    },
    {
      name: 'CryptoDetail',
      component: CryptoDetailScreen,
    },
  ];
  return { routes };
}

export default useHomeNavigatorViewController;
