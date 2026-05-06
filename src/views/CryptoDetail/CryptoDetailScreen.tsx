import React from 'react';
import useCryptoDetailViewController from './useCryptoDetailViewController';
import CryptoDetailView from './CryptoDetailView';

const CryptoDetailScreen: React.FC = () => {
  const props = useCryptoDetailViewController();
  return <CryptoDetailView {...props} />;
};

export default CryptoDetailScreen;
