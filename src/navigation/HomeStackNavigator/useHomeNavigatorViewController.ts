import React from 'react';
import { HomeNavigatorViewProps, HomeStackRoutes } from './types';
import MenuScreen from '../../views/Menu/MenuScreen';
function useHomeNavigatorViewController(): HomeNavigatorViewProps {
  const routes: HomeStackRoutes = [
    {
      name: 'Menu',
      component: MenuScreen,
    },
  ];
  return { routes };
}

export default useHomeNavigatorViewController;
