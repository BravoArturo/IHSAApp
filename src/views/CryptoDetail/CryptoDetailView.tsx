import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CryptoDetailViewProps } from './types';
import Chart from './components/Chart/Chart';
import ChartContainer from './components/ChartContainer/ChartContainer';
import SkeletonChart from './components/SkeletonChart/SkeletonChart';
import ErrorConnection from '../components/ErrorConnection/ErrorConnection';

const CryptoDetailView: React.FC<CryptoDetailViewProps> = ({
  item,
  klines,
  isChartLoading,
  chartError,
  livePrice,
  errorConnection,
  widthChart,
  heightChart,
  onPressRetry,
  onLayoutChart,
}) => {
  if (errorConnection) {
    return <ErrorConnection onPressRetry={onPressRetry} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.liveBar}>
        <Text style={styles.liveLabel}>● Live: {livePrice ?? '—'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.row}>symbol: {item.symbol}</Text>
        <Text style={styles.row}>lastPrice: {item.lastPrice}</Text>
        <Text style={styles.row}>
          priceChangePercent: {item.priceChangePercent}
        </Text>
      </View>

      <ChartContainer onLayoutChart={onLayoutChart}>
        {chartError ? (
          <View style={styles.center}>
            <Text>Error al cargar el gráfico</Text>
          </View>
        ) : !isChartLoading && widthChart > 0 && heightChart > 0 ? (
          <Chart
            klines={klines}
            widthChart={widthChart}
            heightChart={heightChart}
          />
        ) : (
          <SkeletonChart />
        )}
      </ChartContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  liveBar: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  liveLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  card: { padding: 16, borderWidth: StyleSheet.hairlineWidth },
  row: { paddingVertical: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default CryptoDetailView;
