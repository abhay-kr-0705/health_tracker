import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import styled from 'styled-components';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartWrapperProps {
  type: 'line' | 'bar';
  data: ChartData<'line' | 'bar'>;
  options?: ChartOptions<'line' | 'bar'>;
  height?: number;
  title?: string;
}

const ChartContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 1rem 0;
  color: #2c3e50;
  text-align: center;
`;

const ChartWrapper: React.FC<ChartWrapperProps> = ({
  type,
  data,
  options,
  height = 300,
  title,
}) => {
  const defaultOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartOptions = options ? { ...defaultOptions, ...options } : defaultOptions;

  return (
    <ChartContainer>
      {title && <ChartTitle>{title}</ChartTitle>}
      <div style={{ height: `${height}px` }}>
        {type === 'line' ? (
          <Line data={data as ChartData<'line'>} options={chartOptions} />
        ) : (
          <Bar data={data as ChartData<'bar'>} options={chartOptions} />
        )}
      </div>
    </ChartContainer>
  );
};

export default ChartWrapper; 