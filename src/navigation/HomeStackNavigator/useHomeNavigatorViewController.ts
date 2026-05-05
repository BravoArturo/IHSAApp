import React from 'react';
import { HomeNavigatorViewProps, HomeStackRoutes } from './types';

function useHomeNavigatorViewController(): HomeNavigatorViewProps {
  const routes: HomeStackRoutes = [
    // {
    //   // name: 'Menu',
    //   // component: IHSAMenu,
    // },
  ];
  return { routes };
}

export default useHomeNavigatorViewController;
