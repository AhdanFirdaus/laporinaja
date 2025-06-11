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
  Filler,
} from "chart.js";
import { FiUsers, FiAlertCircle, FiClock, FiCheckCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import supabase from "../../../../supabaseClient";

// Register Chart.js components, including Filler
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler
);

const Dashboard = ({ setView }) => {
  const [userCount, setUserCount] = useState(0);
  const [totalKeluhan, setTotalKeluhan] = useState(0);
  const [waitingKeluhan, setWaitingKeluhan] = useState(0);
  const [doneKeluhan, setDoneKeluhan] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      // User count
      const { count: userCountData } = await supabase
        .from("user")
        .select("*", { count: "exact", head: true });

      // Total keluhan
      const { count: totalKeluhanData } = await supabase
        .from("keluhan")
        .select("*", { count: "exact", head: true });

      // Keluhan with status = waiting
      const { count: waitingCount } = await supabase
        .from("keluhan")
        .select("*", { count: "exact", head: true })
        .eq("status", "waiting");

      // Keluhan with status = done
      const { count: doneCount } = await supabase
        .from("keluhan")
        .select("*", { count: "exact", head: true })
        .eq("status", "done");

      setUserCount(userCountData || 0);
      setTotalKeluhan(totalKeluhanData || 0);
      setWaitingKeluhan(waitingCount || 0);
      setDoneKeluhan(doneCount || 0);
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Pengguna",
      value: userCount,
      button: "Lihat Pengguna",
      color: "bg-blue-100",
      icon: <FiUsers className="text-3xl text-blue-600" />,
      onClick: () => setView("users"),
    },
    {
      title: "Total Keluhan",
      value: totalKeluhan,
      button: "Lihat Semua",
      color: "bg-yellow-100",
      icon: <FiAlertCircle className="text-3xl text-yellow-600" />,
      onClick: () => setView("complaints"),
    },
    {
      title: "Keluhan Menunggu",
      value: waitingKeluhan,
      button: "Keluhan Waiting",
      color: "bg-orange-100",
      icon: <FiClock className="text-3xl text-orange-600" />,
      onClick: () => setView("complaints"),
    },
    {
      title: "Keluhan Selesai",
      value: doneKeluhan,
      button: "Keluhan Done",
      color: "bg-green-100",
      icon: <FiCheckCircle className="text-3xl text-green-600" />,
      onClick: () => setView("complaints"),
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
              className={`rounded-xl shadow p-4 sm:p-6 ${card.color} text-center flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 cursor-pointer`}
              onClick={card.onClick} // Card click handler
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
              <Button
                className="mt-3 sm:mt-4"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card's onClick from firing
                  card.onClick(); // Trigger the specific card's onClick
                }}
              >
                {card.button}
              </Button>
            </div>
          ))}
        </div>

        {/* Visitor Chart */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 h-80 sm:h-96">
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