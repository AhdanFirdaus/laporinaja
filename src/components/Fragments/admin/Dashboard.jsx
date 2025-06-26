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
  const [visitCounts, setVisitCounts] = useState(Array(12).fill(0));

  useEffect(() => {
    const fetchStats = async () => {
      const { count: userCountData } = await supabase
        .from("user")
        .select("*", { count: "exact", head: true })
        .neq("id", "0340bc90-20c4-40c4-828c-6b89b8924d8d");

      const { count: totalKeluhanData } = await supabase
        .from("keluhan")
        .select("*", { count: "exact", head: true });

      const { count: waitingCount } = await supabase
        .from("keluhan")
        .select("*", { count: "exact", head: true })
        .eq("status", "waiting");

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

  useEffect(() => {
    const fetchVisits = async () => {
      const { data, error } = await supabase.from("visits").select("month");

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data Kunjungan",
          text:
            error?.message ||
            "Terjadi kesalahan saat mengambil data kunjungan.",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
      const counts = Array(12).fill(0);
      data.forEach(({ month }) => {
        const monthIndex = parseInt(month.split("-")[1], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          counts[monthIndex]++;
        }
      });

      setVisitCounts(counts);
    };

    fetchVisits();
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
      button: "Keluhan Menunggu",
      color: "bg-orange-100",
      icon: <FiClock className="text-3xl text-orange-600" />,
      onClick: () => setView("complaints"),
    },
    {
      title: "Keluhan Selesai",
      value: doneKeluhan,
      button: "Keluhan Selesai",
      color: "bg-green-100",
      icon: <FiCheckCircle className="text-3xl text-green-600" />,
      onClick: () => setView("complaints"),
    },
  ];

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Pengunjung",
        data: visitCounts,
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
      legend: { position: "top" },
      title: {
        display: true,
        text: "Statistik Pengunjung",
        font: { size: 18 },
      },
    },
    scales: {
      y: { beginAtZero: true },
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
              onClick={card.onClick}
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
                  e.stopPropagation();
                  card.onClick();
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
