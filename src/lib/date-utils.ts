// Date utility functions for CRM application

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

export const getTimeString = (date: Date = new Date()): string => {
  return date.toTimeString().split(' ')[0].substring(0, 5);
};

export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
};

export const isThisWeek = (date: string | Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  return checkDate >= startOfWeek && checkDate <= endOfWeek;
};

export const isThisMonth = (date: string | Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
};

export const getWeekStart = (date: Date = new Date()): Date => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getWeekEnd = (date: Date = new Date()): Date => {
  const end = new Date(date);
  end.setDate(date.getDate() + (6 - date.getDay()));
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getMonthStart = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getMonthEnd = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getPreviousMonth = (date: Date = new Date()): { start: Date; end: Date } => {
  const prevMonth = new Date(date);
  prevMonth.setMonth(date.getMonth() - 1);
  
  return {
    start: getMonthStart(prevMonth),
    end: getMonthEnd(prevMonth)
  };
};

export const getNextWeek = (date: Date = new Date()): { start: Date; end: Date } => {
  const nextWeek = new Date(date);
  nextWeek.setDate(date.getDate() + 7);
  
  return {
    start: getWeekStart(nextWeek),
    end: getWeekEnd(nextWeek)
  };
};

export const getDaysInMonth = (date: Date = new Date()): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getWorkingDaysInMonth = (date: Date = new Date()): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(date);
  let workingDays = 0;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay();
    // Exclude weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }
  
  return workingDays;
};

export const calculateWorkingHours = (checkIn: string, checkOut: string): number => {
  const checkInTime = new Date(checkIn);
  const checkOutTime = new Date(checkOut);
  const diffInMs = checkOutTime.getTime() - checkInTime.getTime();
  return Math.round((diffInMs / (1000 * 60 * 60)) * 100) / 100;
};

export const getDateRange = (startDate: string | Date, endDate: string | Date): Date[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: Date[] = [];
  
  const currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

export const getRelativeTimeString = (date: string | Date): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else {
    return formatDate(targetDate);
  }
};

export const isOverdue = (date: string | Date): boolean => {
  const now = new Date();
  const targetDate = new Date(date);
  return targetDate < now;
};

export const getDaysUntil = (date: string | Date): number => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = targetDate.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min${minutes === 1 ? '' : 's'}`;
  } else if (hours < 24) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours} hr${wholeHours === 1 ? '' : 's'}`;
    }
    return `${wholeHours}h ${minutes}m`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    if (remainingHours === 0) {
      return `${days} day${days === 1 ? '' : 's'}`;
    }
    return `${days}d ${remainingHours}h`;
  }
};

export const getCalendarWeeks = (date: Date = new Date()): Date[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  // Add empty cells for days before the first day of the month
  const startDay = firstDay.getDay();
  for (let i = 0; i < startDay; i++) {
    const emptyDate = new Date(year, month, 1 - (startDay - i));
    currentWeek.push(emptyDate);
  }
  
  // Add all days of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(new Date(year, month, day));
  }
  
  // Add empty cells for days after the last day of the month
  while (currentWeek.length < 7) {
    const nextMonthDay = currentWeek.length - lastDay.getDate() - startDay + 1;
    currentWeek.push(new Date(year, month + 1, nextMonthDay));
  }
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return weeks;
};

export const formatDateForInput = (date: string | Date): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const formatTimeForInput = (date: string | Date): string => {
  const d = new Date(date);
  return d.toTimeString().split(' ')[0].substring(0, 5);
};

export const combineDateAndTime = (date: string, time: string): string => {
  return `${date}T${time}:00.000Z`;
};

export const getQuarter = (date: Date = new Date()): number => {
  return Math.floor(date.getMonth() / 3) + 1;
};

export const getQuarterStart = (date: Date = new Date()): Date => {
  const quarter = getQuarter(date);
  const startMonth = (quarter - 1) * 3;
  return new Date(date.getFullYear(), startMonth, 1);
};

export const getQuarterEnd = (date: Date = new Date()): Date => {
  const quarter = getQuarter(date);
  const endMonth = quarter * 3;
  return new Date(date.getFullYear(), endMonth, 0);
};
