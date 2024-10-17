import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define props interface
interface LineChartProps {
  data: ChartData<"line">["datasets"];
  labels: string[];
  options?: any;
}

// Reusable LineChart component
const LineChart: React.FC<LineChartProps> = ({ data, labels, options }) => {
  const chartData: ChartData<"line"> = {
    labels,
    datasets: data,
  };

  return (
    <Line
      data={chartData}
      options={options}
      style={{
        borderRadius: "8px",
        backgroundColor: "white",
        marginBottom: 16,
        padding: 8,
      }}
    />
  );
};

export default LineChart;
