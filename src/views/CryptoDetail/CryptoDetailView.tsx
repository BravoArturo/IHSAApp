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
  stats,
  onPressRetry,
  onLayoutChart,
}) => {
  if (errorConnection) {
    return <ErrorConnection onPressRetry={onPressRetry} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Detalle del par</Text>
        <Text style={styles.symbol}>{item.symbol}</Text>
      </View>

      <View style={styles.liveBar}>
        <View style={styles.liveLabelRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveLabel}>
            Precio en vivo · Binance WebSocket
          </Text>
        </View>
        <Text style={styles.liveValue}>{livePrice ?? '—'}</Text>
      </View>

      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Histórico de precio</Text>
        <Text style={styles.chartSubtitle}>
          Última hora · velas de 1 minuto
        </Text>
      </View>

      {stats && !isChartLoading && !chartError && (
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Máx</Text>
            <Text style={styles.statValue}>{stats.max.toFixed(2)}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Mín</Text>
            <Text style={styles.statValue}>{stats.min.toFixed(2)}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Variación</Text>
            <Text
              style={[
                styles.statValue,
                {
                  color: stats.variation >= 0 ? '#0ECB81' : '#F6465D',
                },
              ]}
            >
              {stats.variation >= 0 ? '+' : ''}
              {stats.variation.toFixed(2)}%
            </Text>
          </View>
        </View>
      )}

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
  header: {
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  symbol: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginTop: 2,
  },
  liveBar: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    marginBottom: 16,
  },
  liveLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0ECB81',
  },
  liveLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  liveValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginTop: 6,
  },
  chartHeader: {
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  statCell: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginTop: 2,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default CryptoDetailView;
