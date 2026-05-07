import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NoInternetPropsType } from './types';

const NoInternet: React.FC<NoInternetPropsType> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sin conexión a internet</Text>
      <Text style={styles.subtitle}>
        Revisá tu Wi-Fi o datos móviles. Volveremos a intentar
        automáticamente.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default NoInternet;
