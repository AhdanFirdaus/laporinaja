const colorMap = {
  softorange: 'bg-soft-orange hover:bg-soft-orange-400',
  softchocolate: 'bg-soft-chocolate hover:bg-soft-chocolate',
  paleyellow: 'bg-pale-yellow hover:bg-pale-yellow-400', 
  palewhite: 'bg-pale-white hover:bg-pale-white-400'
};

const Button = ({ children, onClick, color = '', type = 'button', className = '', rounded = 'rounded-md', txtcolor = "text-white" }) => {
  const colorClasses = colorMap[color] || colorMap['softorange'];
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