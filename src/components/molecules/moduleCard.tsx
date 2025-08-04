type ModuleCardProps = {
  classname?: string;
  imageUrl: string;
};

export const ModuleCard = ({ classname = '', imageUrl }: ModuleCardProps) => (
  <div className={`${classname} hover:scale-105 transition`}>
    <img src={imageUrl} alt={'image module'} className="w-full h-max object-cover" />
  </div>
);
