import { useEffect, useState } from 'react';
import { useTheme } from '@/components/ui/theme-provider';

export function useTimeBasedTheme(isAutoEnabled: boolean = true) {
  const { setTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!isAutoEnabled) return;

    const updateTheme = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const hour = now.getHours();
      
      // Sunrise to sunset logic (6 AM to 6 PM = light mode)
      // 6 PM to 6 AM = dark mode
      if (hour >= 6 && hour < 18) {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    };

    // Update theme immediately
    updateTheme();

    // Update theme every minute
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, [setTheme, isAutoEnabled]);

  const isDay = currentTime.getHours() >= 6 && currentTime.getHours() < 18;

  return {
    isDay,
    currentTime,
  };
}

