type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export const Button = ({ children, onClick, variant = 'primary', className = '' }: ButtonProps) => {
  const baseStyle = 'rounded-full px-6 py-2 font-semibold';
  const variants = {
    primary: 'bg-green-500 text-white hover:bg-green-600',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300',
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
