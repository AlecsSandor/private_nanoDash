import { useEffect, useState } from "react";

export const useTimeoutData = <T,>(value: T, delay: number): T | null => {
  const [result, setResult] = useState<T | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResult(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return result;
};

export default useTimeoutData;
