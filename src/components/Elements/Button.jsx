const colorMap = {
  softorange: 'bg-soft-orange hover:bg-soft-orange-400',
  softchocolate: 'bg-soft-chocolate hover:bg-soft-chocolate',
  paleyellow: 'bg-pale-yellow hover:bg-pale-yellow-400',
  palewhite: 'bg-pale-white hover:bg-pale-white-400',
  white: 'bg-white hover:bg-slate-100',
};

const Button = ({
  children,
  onClick,
  color = 'softorange',
  type = 'button',
  className = '',
  rounded = 'rounded-md',
  txtcolor = 'text-white',
  href,
  target = '_self',
  ...props
}) => {
  const colorClasses = colorMap[color] || colorMap.softorange;
  const baseClasses = `px-4 py-2 font-semibold transition duration-300 cursor-pointer ${colorClasses} ${rounded} ${txtcolor} ${className}`;

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
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;