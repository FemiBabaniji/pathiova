// LoadingSpinner.tsx (or LoadingSpinner.js)
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <Loader2 className="w-24 h-24 text-purple-600 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
