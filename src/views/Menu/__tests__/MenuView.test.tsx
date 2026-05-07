import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MenuView from '../MenuView';
import { CryptoAPIType } from '../../../models/crypto/api/types';
import { MenuViewProps } from '../types';

const makeCrypto = (symbol: string): CryptoAPIType =>
  ({
    symbol,
    lastPrice: '100.50',
    priceChangePercent: '2.5',
  } as CryptoAPIType);

const buildProps = (overrides: Partial<MenuViewProps> = {}): MenuViewProps => ({
  cryptos: [],
  cryptosFiltered: [],
  text: '',
  isLoading: false,
  errorConnection: false,
  valueToggle: false,
  onToggle: jest.fn(),
  onPressRetry: jest.fn(),
  onPressItem: jest.fn(),
  onChangeText: jest.fn(),
  ...overrides,
});

describe('MenuView', () => {
  it('renders ErrorConnection when errorConnection is true', () => {
    const { getByText } = render(
      <MenuView {...buildProps({ errorConnection: true })} />,
    );

    expect(getByText('No connection')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('calls onPressRetry when Retry button is pressed', () => {
    const onPressRetry = jest.fn();
    const { getByText } = render(
      <MenuView {...buildProps({ errorConnection: true, onPressRetry })} />,
    );

    fireEvent.press(getByText('Retry'));

    expect(onPressRetry).toHaveBeenCalledTimes(1);
  });

  it('renders ActivityIndicator when loading and cryptos is empty', () => {
    const { UNSAFE_getByType } = render(
      <MenuView {...buildProps({ isLoading: true })} />,
    );

    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders NoData when text is non-empty and filtered list is empty', () => {
    const { getByText } = render(
      <MenuView
        {...buildProps({
          text: 'XYZ',
          cryptos: [makeCrypto('BTCUSDT')],
          cryptosFiltered: [],
        })}
      />,
    );

    expect(getByText('no data')).toBeTruthy();
  });

  it('renders CryptoList with all items when text is empty', () => {
    const cryptos = [makeCrypto('BTCUSDT'), makeCrypto('ETHUSDT')];
    const { getByText } = render(
      <MenuView {...buildProps({ cryptos, cryptosFiltered: [] })} />,
    );

    expect(getByText('BTCUSDT')).toBeTruthy();
    expect(getByText('ETHUSDT')).toBeTruthy();
  });

  it('renders only filtered items when cryptosFiltered has results', () => {
    const { getByText, queryByText } = render(
      <MenuView
        {...buildProps({
          cryptos: [makeCrypto('BTCUSDT'), makeCrypto('ETHUSDT')],
          cryptosFiltered: [makeCrypto('BTCUSDT')],
          text: 'btc',
        })}
      />,
    );

    expect(getByText('BTCUSDT')).toBeTruthy();
    expect(queryByText('ETHUSDT')).toBeNull();
  });

  it('calls onChangeText when input text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <MenuView {...buildProps({ onChangeText })} />,
    );

    fireEvent.changeText(getByPlaceholderText('filtrar por symbol'), 'btc');

    expect(onChangeText).toHaveBeenCalledWith('btc');
  });

  it('calls onPressItem when a list item is pressed', () => {
    const onPressItem = jest.fn();
    const crypto = makeCrypto('BTCUSDT');
    const { getByText } = render(
      <MenuView {...buildProps({ cryptos: [crypto], onPressItem })} />,
    );

    fireEvent.press(getByText('BTCUSDT'));

    expect(onPressItem).toHaveBeenCalledWith(crypto);
  });
});
