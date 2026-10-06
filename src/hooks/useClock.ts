import { useState, useEffect } from 'react';
import { MONTHS } from '../utils/dateUtils';

export function useClock(timeFormat24: boolean, showSeconds: boolean) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Update every second aligned to clock
    const update = () => setNow(new Date());
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const hoursRaw = now.getHours();
  const minutesRaw = now.getMinutes();
  const secondsRaw = now.getSeconds();

  const period = hoursRaw >= 12 ? 'PM' : 'AM';
  
  let hoursDisplay: string;
  if (timeFormat24) {
    hoursDisplay = String(hoursRaw).padStart(2, '0');
  } else {
    const h12 = hoursRaw % 12 || 12;
    hoursDisplay = String(h12);
  }

  const minutesDisplay = String(minutesRaw).padStart(2, '0');
  const secondsDisplay = String(secondsRaw).padStart(2, '0');

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[now.getDay()];
  const monthName = MONTHS[now.getMonth()];
  const dateNum = now.getDate();
  const year = now.getFullYear();

  const formattedDate = `${dayName}, ${monthName} ${dateNum}`;
  const fullDateWithYear = `${formattedDate}, ${year}`;

  return {
    now,
    hours: hoursDisplay,
    minutes: minutesDisplay,
    seconds: secondsDisplay,
    period: timeFormat24 ? null : period,
    dayName,
    monthName,
    dateNum,
    year,
    formattedDate,
    fullDateWithYear,
  };
}
