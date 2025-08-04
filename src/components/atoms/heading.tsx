type headingProps = {
  children: React.ReactNode;
  className?: string;
};

export const Heading = ({ className = '', children }: headingProps) => (
  <h1 className={`${className} font-bold text-center font-lexend`}>{children}</h1>
);
