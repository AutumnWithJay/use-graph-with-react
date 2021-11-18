import ApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import { IHistorical, PriceProps } from '../interfaces';

function Price({ coinId }: PriceProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(
    ['price_ohlcv', coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    },
  );
  console.log(data);
  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: data?.map((data) => [
                data.time_open,
                data.open.toFixed(3),
                data.high.toFixed(3),
                data.low.toFixed(3),
                data.close.toFixed(3),
              ]),
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
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              type: 'datetime',
              categories: data?.map((price) => price.time_close),
            },
            yaxis: {
              labels: {
                formatter: (value) => `$${value.toFixed(0)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Price;
