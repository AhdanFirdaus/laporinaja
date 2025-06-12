import { scroller } from "react-scroll";

const colorMap = {
  softorange: 'bg-soft-orange hover:bg-soft-orange-400',
  white: 'bg-white hover:bg-slate-100',
  red: 'bg-red-500 hover:bg-red-600',
  redoutline: 'bg-red-100 hover:bg-red-500 border border-red-500 hover:text-white',
};

const Button = ({
  children,
  onClick,
  color = 'softorange',
  type = 'button',
  className = '',
  rounded = 'rounded-md',
  txtcolor = 'text-white',
  font = 'font-semibold',
  href,
  target = '_self',
  to, // New prop for scroll target
  ...props
}) => {
  const colorClasses = colorMap[color] || colorMap.softorange;
  const baseClasses = `px-4 py-2 transition duration-300 cursor-pointer ${colorClasses} ${rounded} ${txtcolor} ${font} ${className}`;

  // Handle scroll to section
  const handleScroll = () => {
    if (to) {
      scroller.scrollTo(to, {
        smooth: true,
        duration: 500,
        offset: -80, // Match the offset used in Navbar
      });
    }
    if (onClick) {
      onClick(); // Call any additional onClick handler if provided
    }
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={`inline-block ${baseClasses}`}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={handleScroll}
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;