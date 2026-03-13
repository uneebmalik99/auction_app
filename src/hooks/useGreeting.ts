import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';

export function useGreeting() {
  const { t } = useI18n();
  
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return t('home.greeting.morning');
    } else if (hour >= 12 && hour < 17) {
      return t('home.greeting.afternoon');
    } else {
      return t('home.greeting.evening');
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
  }, [greeting, t]);

  return greeting;
}
