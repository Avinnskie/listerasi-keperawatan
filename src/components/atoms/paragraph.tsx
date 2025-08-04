type paragraphProps = {
  className?: string;
  children: React.ReactNode;
};

export const Paragraph = ({ className = '', children }: paragraphProps) => (
  <p className={`${className} text-lg text-gray-700 text-center max-w-3xl mx-auto mt-4`}>
    {children}
  </p>
);
