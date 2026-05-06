import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ErrorConnectionPropsType } from './types';

const ErrorConnection: React.FC<ErrorConnectionPropsType> = ({
  onPressRetry,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No connection</Text>
      <Text style={styles.subtitle}>
        Check your internet and try again.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onPressRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ErrorConnection;
