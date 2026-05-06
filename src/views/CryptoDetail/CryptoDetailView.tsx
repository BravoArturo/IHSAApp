import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CryptoDetailViewProps } from './types';
import Chart from './components/Chart/Chart';

const CryptoDetailView: React.FC<CryptoDetailViewProps> = ({
  item,
  klines,
  isChartLoading,
  chartError,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.row}>symbol: {item.symbol}</Text>
        <Text style={styles.row}>lastPrice: {item.lastPrice}</Text>
        <Text style={styles.row}>
          priceChangePercent: {item.priceChangePercent}
        </Text>
      </View>

      {isChartLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : chartError ? (
        <View style={styles.center}>
          <Text>Error al cargar el gráfico</Text>
        </View>
      ) : (
        <Chart klines={klines} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 16, borderWidth: StyleSheet.hairlineWidth },
  row: { paddingVertical: 4 },
  center: { paddingVertical: 32, alignItems: 'center' },
});

export default CryptoDetailView;
