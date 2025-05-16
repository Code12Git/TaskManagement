import { useEffect } from "react";
import toast from "react-hot-toast";

const ErrorDisplay = ({ error }: { error: string | null }) => {
  useEffect(() => {
    if (error) {
      toast.error(error || "An error occurred");
    }
  }, [error]);

  return null; 
};

export default ErrorDisplay;
