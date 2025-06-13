const Textarea = ({
  label,
  name,
  value,
  onChange,
  required = false,
  rows = 4,
}) => {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border focus:border-soft-orange px-3 py-2 rounded-lg resize-none focus:outline-none focus:ring focus:ring-[var(--color-soft-orange)]"
        required={required}
        rows={rows}
      ></textarea>
    </div>
  );
};

export default Textarea;