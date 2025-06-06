const Select = ({ label, name, value, onChange, options = [], required = false }) => {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border focus:border-soft-orange px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-[var(--color-soft-orange)]"
        required={required}
      >
        <option value="">-- Pilih {label} --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;