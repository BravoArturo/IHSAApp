import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import SortToggle from '../SortToggle';

describe('SortToggle', () => {
  it('renders the A-Z label', () => {
    const { getByText } = render(
      <SortToggle valueToggle={false} onToggle={jest.fn()} />,
    );
    expect(getByText('A-Z')).toBeTruthy();
  });

  it('calls onToggle with the inverted value when pressed (off → on)', () => {
    const onToggle = jest.fn();
    const { getByTestId } = render(
      <SortToggle valueToggle={false} onToggle={onToggle} />,
    );
    fireEvent.press(getByTestId('sort-toggle'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('calls onToggle with the inverted value when pressed (on → off)', () => {
    const onToggle = jest.fn();
    const { getByTestId } = render(
      <SortToggle valueToggle={true} onToggle={onToggle} />,
    );
    fireEvent.press(getByTestId('sort-toggle'));
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
