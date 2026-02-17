import { useEffect, useState } from 'react';

export function useGreeting() {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const [greeting, setGreeting] = useState(getGreeting());

  // Optional: Update greeting at midnight or when hour changes
  useEffect(() => {
    const updateGreeting = () => {
      const newGreeting = getGreeting();
      if (newGreeting !== greeting) {
        setGreeting(newGreeting);
      }
    };

    // Check every minute
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, [greeting]);

  return greeting;
}
