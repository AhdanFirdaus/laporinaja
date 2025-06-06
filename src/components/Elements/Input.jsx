const Input = ({ label, name, value, onChange, type = "text", required = false }) => {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border focus:border-soft-orange px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-soft-orange"
        required={required}
      />
    </div>
  );
};

export default Input;