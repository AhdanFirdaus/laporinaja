import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={type === "password" && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border focus:border-soft-orange px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-soft-orange"
          required={required}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            {showPassword ? (
              <FiEye className="w-5 h-5" />
            ) : (
              <FiEyeOff className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;