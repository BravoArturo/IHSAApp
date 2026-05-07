import React, { memo } from 'react';
import { TextInput } from 'react-native';
import { InputFilterPropsType } from './types';

const InputFilter: React.FC<InputFilterPropsType> = ({ onChangeText }) => {
  return (
    <TextInput placeholder="filtrar por symbol" onChangeText={onChangeText} />
  );
};

export default memo(InputFilter);
