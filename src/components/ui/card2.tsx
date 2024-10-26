import { cn } from "@/lib/utils";

const Card2 = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-6 bg-grey-200 flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 border border-gray-300",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Card2;
