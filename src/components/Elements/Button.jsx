const colorMap = {
  softorange: 'bg-soft-orange hover:bg-soft-orange-400',
  softchocolate: 'bg-soft-chocolate hover:bg-soft-chocolate',
  paleyellow: 'bg-pale-yellow hover:bg-pale-yellow-400', 
  palewhite: 'bg-pale-white hover:bg-pale-white-400',
  white: 'bg-white hover:bg-slate-100',
  blue: 'bg-blue-600 hover:bg-blue-700',
  red: 'bg-red-500 hover:bg-red-600',
  redoutline: 'bg-red-100 hover:bg-red-500 border border-red-500 hover:text-white',
};

const Button = ({ children, onClick, font = 'font-semibold', color = '', type = 'button', className = '', rounded = 'rounded-md', txtcolor = "text-white" }) => {
  const colorClasses = colorMap[color] || colorMap['softorange'];
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 transition duration-300 cursor-pointer ${colorClasses} ${className} ${rounded} ${txtcolor} ${font}`}
    >
      {children}
    </button>
  );
};

export default Button;