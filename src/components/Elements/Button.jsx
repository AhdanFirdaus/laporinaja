const Button = ({ children, variant = "primary", ...props }) => {
  const base = "px-4 py-2 rounded font-medium transition";
  const variants = {
    primary: `${base} bg-[var(--color-soft-orange)] text-[var(--color-pale-white)] hover:bg-opacity-90`,
    outline: `${base} border border-[var(--color-soft-orange)] text-[var(--color-soft-orange)] hover:bg-[var(--color-pale-white)] hover:text-[var(--color-soft-orange)]`
  };

  return <button className={variants[variant]} {...props}>{children}</button>;
};

export default Button;