import { cn } from "@/lib/utils";

const CardTitles = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-gray-700 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export default CardTitles;
