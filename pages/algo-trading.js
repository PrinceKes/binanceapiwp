import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AlgoTrading = ({ prices }) => {
  const [darkTheme, setDarkTheme] = useState(true);
  const [btcData, setBtcData] = useState([]);

  useEffect(() => {
    // Fetch BTC price history for chart (you can use a different API endpoint)
    axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30')
      .then(response => {
        const data = response.data.map(item => ({
          time: new Date(item[0]).toLocaleDateString(),
          price: parseFloat(item[4]), // Closing price
        }));
        setBtcData(data);
      });
  }, []);

  const chartData = {
    labels: btcData.map((d) => d.time),
    datasets: [
      {
        label: 'BTC/USDT',
        data: btcData.map((d) => d.price),
        borderColor: '#f0b90b',
        backgroundColor: 'rgba(240, 185, 11, 0.5)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { ticks: { color: '#fff' } },
      y: { ticks: { color: '#fff' } },
    },
    plugins: {
      legend: { labels: { color: '#fff' } },
    },
  };

  return (
    <div
      style={{
        backgroundColor: darkTheme ? '#121212' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1
        style={{
          color: '#f0b90b',
          fontWeight: 'bold',
          fontSize: '24px',
        }}
      >
        Algo Trading - Live Binance Prices
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: '#222831',
            padding: '10px',
            borderRadius: '8px',
            color: '#fff',
            width: '30%',
          }}
        >
          <h3>BTC/USDT</h3>
          <p style={{ fontSize: '24px', color: '#0ECB81' }}>
            {parseFloat(prices.find((p) => p.symbol === 'BTCUSDT')?.price).toFixed(2)}
          </p>
        </div>
        <div
          style={{
            backgroundColor: '#222831',
            padding: '10px',
            borderRadius: '8px',
            color: '#fff',
            width: '30%',
          }}
        >
          <h3>ETH/USDT</h3>
          <p style={{ fontSize: '24px', color: '#0ECB81' }}>
            {parseFloat(prices.find((p) => p.symbol === 'ETHUSDT')?.price).toFixed(2)}
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: '#222831', padding: '20px', borderRadius: '8px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#222831' }}>
            <th style={{ padding: '12px 8px', borderBottom: '1px solid #333', color: '#f0b90b' }}>Symbol</th>
            <th style={{ padding: '12px 8px', borderBottom: '1px solid #333', color: '#f0b90b' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((pair) => (
            <tr key={pair.symbol} style={{ backgroundColor: '#393E46' }}>
              <td style={{ padding: '12px 8px', borderBottom: '1px solid #333' }}>{pair.symbol}</td>
              <td style={{ padding: '12px 8px', borderBottom: '1px solid #333' }}>
                {parseFloat(pair.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


async function fetchWithRetry(url, retries = 3, delay = 1000) {
  try {
    const res = await axios.get(url, { timeout: 5000 });
    return res.data;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying request... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
      return fetchWithRetry(url, retries - 1, delay);
    } else {
      throw error;
    }
  }
}

export const getServerSideProps = async () => {
  try {
    const prices = await fetchWithRetry('https://api.binance.com/api/v3/ticker/price');
    return {
      props: {
        prices,
      },
    };
  } catch (error) {
    console.error('Error fetching Binance API data:', error);
    return {
      props: {
        prices: [],
      },
    };
  }
};


// export const getServerSideProps = async () => {
//     try {
//       const res = await axios.get('https://api.binance.com/api/v3/ticker/price', {
//         timeout: 5000,
//       });
//       const prices = res.data;
  
//       return {
//         props: {
//           prices,
//         },
//       };
//     } catch (error) {
//       console.error('Error fetching Binance API data:', error);
//       return {
//         props: {
//           prices: [], 
//         },
//       };
//     }
//   };
  

export default AlgoTrading;
