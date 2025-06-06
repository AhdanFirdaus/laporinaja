const CardComplaint = ({ complaint, actions = [] }) => {
  const label = complaint.label || "Menunggu";

  return (
    <li
      className="border border-gray-200 p-6 mb-6 rounded-xl bg-white shadow hover:shadow-md transition-shadow duration-300"
      style={{ height: "fit-content" }}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{complaint.date}</span>
          <span
            className={`text-sm font-medium py-1 px-3 rounded-full ${
              label === "Menunggu"
                ? "bg-yellow-100 text-yellow-800"
                : label === "Proses"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {label}
          </span>
        </div>

        <span className="text-md text-gray-600">
          <h3 className="line-clamp-2 break-all font-semibold">
            {complaint.title}
          </h3>
        </span>

        {complaint.note && (
          <p className="text-md text-gray-600 my-4">
            <span className="line-clamp-3 break-all">{complaint.note}</span>
          </p>
        )}

        <div className="flex gap-4 justify-end flex-wrap">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => action.onClick(complaint)}
              className="text-sm font-medium text-soft-orange hover:text-soft-orange/90 transition-colors hover:underline cursor-pointer"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </li>
  );
};

export default CardComplaint;