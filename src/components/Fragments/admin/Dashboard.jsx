import Button from "../../Elements/Button";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler, // Import Filler plugin
} from "chart.js";
import { FiUsers, FiAlertCircle, FiClock, FiCheckCircle } from "react-icons/fi";

// Register Chart.js components, including Filler
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler // Register Filler plugin
);

const Dashboard = () => {
  // Updated cards array with react-icons
  const cards = [
    {
      title: "Pengguna",
      value: "30",
      button: "Lihat Pengguna",
      color: "bg-blue-100",
      icon: <FiUsers className="text-3xl text-blue-600" />,
    },
    {
      title: "Total Keluhan",
      value: "17",
      button: "Lihat Keluhan",
      color: "bg-red-100",
      icon: <FiAlertCircle className="text-3xl text-red-600" />,
    },
    {
      title: "Keluhan Belum Diproses",
      value: "7",
      button: "Lihat Keluhan",
      color: "bg-yellow-100",
      icon: <FiClock className="text-3xl text-yellow-600" />,
    },
    {
      title: "Keluhan Terselesaikan",
      value: "12",
      button: "Lihat Status",
      color: "bg-green-100",
      icon: <FiCheckCircle className="text-3xl text-green-600" />,
    },
  ];

  // Chart data for Pengunjung (Visitors)
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Pengunjung",
        data: [120, 150, 180, 200, 170, 200],
        borderColor: "rgba(255, 99, 71, 1)",
        backgroundColor: "rgba(255, 99, 71, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Statistik Pengunjung",
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-md p-4 sm:p-6 ${card.color} text-center flex flex-col justify-between transform hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                {card.icon}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-700 mb-2">
                {card.title}
              </h2>
              <p className="text-xl sm:text-3xl font-bold text-gray-800">
                {card.value}
              </p>
              <Button className="mt-3 sm:mt-4">{card.button}</Button>
            </div>
          ))}
        </div>

        {/* Visitor Chart */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 h-80 sm:h-96">
          <div className="h-full">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <Button>Lihat Statistik Lengkap</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;