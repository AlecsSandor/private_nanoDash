import { useEffect, useState } from "react";

export interface DeviceType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// setting the initial
const initialState: DeviceType = {
  isMobile: false,
  isTablet: false,
  isDesktop: false,
};

export const useDevice = (): DeviceType => {
  // set the initial state to already have correct values
  // for immediate ui feedback
  const [deviceType, setDeviceType] = useState<DeviceType>({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1200,
    isDesktop: window.innerWidth >= 1200,
  });

  useEffect(() => {
    const handleResize = (): void => {
      const width = window.innerWidth;
      if (width <= 767) {
        setDeviceType({
          ...initialState,
          isMobile: true,
        });
      } else if (width <= 1199) {
        setDeviceType({
          ...initialState,
          isTablet: true,
        });
      } else {
        setDeviceType({
          ...initialState,
          isDesktop: true,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceType;
};

export default useDevice;
