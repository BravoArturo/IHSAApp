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

  const change = Number(item.priceChangePercent);
  const isPositive = !Number.isNaN(change) && change >= 0;
  const changeColor = isPositive ? '#0ECB81' : '#F6465D';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Detalle del par</Text>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.lastPrice}</Text>
          <Text style={[styles.change, { color: changeColor }]}>
            {isPositive ? '+' : ''}
            {item.priceChangePercent}%
          </Text>
        </View>
        <Text style={styles.priceCaption}>Último precio · variación 24h</Text>
      </View>

      <View style={styles.liveBar}>
        <View style={styles.liveDot} />
        <Text style={styles.liveLabel}>
          Precio en vivo · Binance WebSocket
        </Text>
        <Text style={styles.liveValue}>{livePrice ?? '—'}</Text>
      </View>

      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Histórico de precio</Text>
        <Text style={styles.chartSubtitle}>
          Última hora · velas de 1 minuto
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
    gap: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceCaption: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  liveBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F6F8',
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0ECB81',
  },
  liveLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  liveValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default CryptoDetailView;
