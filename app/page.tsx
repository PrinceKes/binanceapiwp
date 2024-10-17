"use client";

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Price {
  symbol: string;
  price: string;
}

interface BtcData {
  time: string;
  price: number;
}

const AlgoTrading = ({ prices }: { prices: Price[] }) => {
  const [darkTheme, setDarkTheme] = useState(true);
  const [btcData, setBtcData] = useState<BtcData[]>([]);

  useEffect(() => {
    // Fetch BTC price history for chart
    const fetchBtcData = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30');
        const data = response.data.map((item: any) => ({
          time: new Date(item[0]).toLocaleDateString(),
          price: parseFloat(item[4]), // Closing price
        }));
        setBtcData(data);
      } catch (error) {
        console.error('Error fetching BTC data:', error);
      }
    };

    fetchBtcData();
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
        {Array.isArray(prices) && prices.length > 0 ? (
          prices.map((pair) => (
            <div
              key={pair.symbol}
              style={{
                backgroundColor: '#222831',
                padding: '10px',
                borderRadius: '8px',
                color: '#fff',
                width: '30%',
              }}
            >
              <h3>{pair.symbol}</h3>
              <p style={{ fontSize: '24px', color: '#0ECB81' }}>
                {parseFloat(pair.price).toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: '#fff' }}>Loading prices...</p>
        )}
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
          {Array.isArray(prices) && prices.length > 0 ? (
            prices.map((pair) => (
              <tr key={pair.symbol} style={{ backgroundColor: '#393E46' }}>
                <td style={{ padding: '12px 8px', borderBottom: '1px solid #333' }}>{pair.symbol}</td>
                <td style={{ padding: '12px 8px', borderBottom: '1px solid #333' }}>
                  {parseFloat(pair.price).toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} style={{ textAlign: 'center', padding: '12px 8px', color: '#fff' }}>
                Loading prices...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlgoTrading;
