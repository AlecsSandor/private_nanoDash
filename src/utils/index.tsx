export const timeAgo = (timestamp: number) => {
  const now: number = Date.now();
  const diff: number = now - timestamp;

  const units = [
    { label: "year", value: 1000 * 60 * 60 * 24 * 365 },
    { label: "month", value: 1000 * 60 * 60 * 24 * 30 },
    { label: "week", value: 1000 * 60 * 60 * 24 * 7 },
    { label: "day", value: 1000 * 60 * 60 * 24 },
    { label: "hour", value: 1000 * 60 * 60 },
  ];

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const count = Math.floor(diff / unit.value);
    if (count > 0) {
      return `${count} ${unit.label}${count > 1 ? "s" : ""}`;
    }
  }

  return "Just now";
};

export const easeInOutCubic = (x: number): number => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

// Input validation utilities
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username.trim()) {
    return "Username is required";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }
  return null;
};


// export default {
//   initPerformanceMonitoring,
//   optimizeImageSrc,
//   preloadCriticalResources,
// }
