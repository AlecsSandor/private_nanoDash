import { useState, useEffect } from "react";

type WindowSize = {
  width: number;
  height: number;
};

export const useWindowResize = (
  callback?: () => void,
  debounce = 50
): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let timeoutId: number;

    function handleResize() {
      clearTimeout(timeoutId);

      timeoutId = window.setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });

        if (callback) callback();
      }, debounce);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);

      clearTimeout(timeoutId);
    };
  }, [debounce]);

  return windowSize;
};
