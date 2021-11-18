import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import ApexChart from 'react-apexcharts';

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(
    ['ohlcv', coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    },
  );
  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: 'Price',
              data: data?.map((price) => price.close),
            },
          ]}
          options={{
            theme: {
              mode: 'dark',
            },
            chart: {
              height: 500,
              width: 500,
              background: 'transparent',
            },
            grid: {
              show: false,
            },
            stroke: {
              curve: 'smooth',
              width: 3,
            },
            xaxis: {
              axisTicks: { show: false },
              type: 'datetime',
              categories: data?.map((price) => price.time_close),
            },
            yaxis: {
              labels: {
                formatter: (value) => `$${value.toFixed(0)}`,
              },
              axisBorder: { show: true },
            },
            fill: { type: 'gradient', gradient: { gradientToColors: ['red'], stops: [0, 100] } },
            colors: ['blue'],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(3)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;