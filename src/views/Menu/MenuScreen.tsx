import React from 'react';
import useMenuViewController from './useMenuViewController';
import MenuView from './MenuView';

const MenuScreen: React.FC = () => {
  const props = useMenuViewController();
  return <MenuView {...props} />;
};

export default MenuScreen;
