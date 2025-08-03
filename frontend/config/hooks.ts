import { useRef } from "react";

export const useDebounceCallback = (
  callback: (...args: any[]) => void,
  delay: number = 500,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
