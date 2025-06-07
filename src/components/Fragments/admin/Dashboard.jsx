import Button from "../../Elements/Button";

const Dashboard = () => {
  const cards = [
    {
      title: "Selamat Datang",
      value: "admin",
      button: "Update Profile",
    },
    {
      title: "Pengguna",
      value: "30",
      button: "Lihat Pengguna",
    },
    {
      title: "Total Keluhan",
      value: "17",
      button: "Lihat Keluhan",
    },
    {
      title: "Keluhan Belum Diproses",
      value: "7",
      button: "Lihat Keluhan",
    },
    {
      title: "Keluhan Terselesaikan",
      value: "12",
      button: "Lihat Status",
    },
    {
      title: "Pengunjung",
      value: "200",
      button: "Lihat Statistik",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-xl shadow-md border border-gray-200 p-6 text-center flex flex-col justify-between bg-white hover:shadow-lg transition-shadow duration-300"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h2>
            <p className="text-2xl font-bold text-[color:var(--color-soft-chocolate)]">
              {card.value}
            </p>
          </div>
          <Button
            className="mt-6 w-full text-base py-2.5"
            color="softorange"
            rounded="rounded-lg"
          >
            {card.button}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
