type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export const Button = ({ children, onClick, variant = 'primary', className = '' }: ButtonProps) => {
  const baseStyle = 'rounded-md px-6 py-2 font-semibold';
  const variants = {
    primary: 'bg-[#38E078] text-white hover:bg-green-600',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300',
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className} w-max`}>
      {children}
    </button>
  );
};
