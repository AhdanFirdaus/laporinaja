import { useState } from "react";
import LabelStatus from "../Elements/LabelStatus";

const statusLabels = {
  waiting: "Menunggu",
  processing: "Proses",
  done: "Selesai",
  reject: "Ditolak",
};

const CardComplaint = ({ complaint, actions = [], className = "" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const label = statusLabels[complaint.label] || "Menunggu";

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <li
      className={`h-fit relative border border-gray-200 p-6 mb-6 rounded-xl bg-white shadow hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{complaint.date}</span>
          <LabelStatus label={label} />
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
            <div key={index} className="relative">
              {action.label === "Ubah Status" ? (
                <>
                  <button
                    onClick={handleToggleDropdown}
                    className="text-sm font-medium text-soft-orange hover:text-soft-orange/90 transition-colors hover:underline cursor-pointer"
                  >
                    {action.label}
                  </button>
                  {isDropdownOpen && action.selectOptions && (
                    <div className="absolute top-full -right-20 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                      {action.selectOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            option.onSelect();
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-soft-orange/20 transition-colors cursor-pointer"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => action.onClick(complaint)}
                  className="text-sm font-medium text-soft-orange hover:text-soft-orange/90 transition-colors hover:underline cursor-pointer"
                >
                  {action.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </li>
  );
};

export default CardComplaint;