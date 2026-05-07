import React, { memo } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { InputFilterPropsType } from './types';

const InputFilter: React.FC<InputFilterPropsType> = ({ onChangeText }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder="Buscar par (ej. BTCUSDT)"
      placeholderTextColor="#9CA3AF"
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111',
    backgroundColor: '#FFFFFF',
  },
});

export default memo(InputFilter);
