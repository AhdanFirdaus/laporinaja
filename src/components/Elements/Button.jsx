const colorMap = {
  green: 'bg-green-500 hover:bg-green-600',
  goldenbrown: 'bg-[#9F691E] hover:bg-rose-600',
  blue: 'bg-blue-500 hover:bg-blue-600',
};

const Button = ({ children, onClick, color = '', type = 'button', className = '', rounded = 'rounded-md', txtcolor = "text-white" }) => {
  const colorClasses = colorMap[color] || colorMap['green']; // default ke hijau
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 transition duration-300 font-semibold cursor-pointer ${colorClasses} ${className} ${rounded} ${txtcolor}`}
    >
      {children}
    </button>
  );
};

export default Button;