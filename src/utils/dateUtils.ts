import { format, parseISO, isBefore, addMonths, isValid } from 'date-fns';

// Format date for display
export const formatDate = (dateString: string, formatString: string = 'MMM dd, yyyy'): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

// Format date and time for display
export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return 'Invalid date';
  }
};

// Check if a date is in the past
export const isPastDate = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return false;
    return isBefore(date, new Date());
  } catch (error) {
    return false;
  }
};

// Get time ago for display
export const getTimeAgo = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  } catch (error) {
    return 'Invalid date';
  }
};

// Calculate next maintenance date (6 months from last maintenance)
export const calculateNextMaintenanceDate = (lastMaintenanceDate: string): string => {
  try {
    const date = parseISO(lastMaintenanceDate);
    if (!isValid(date)) return '';
    
    const nextDate = addMonths(date, 6);
    return nextDate.toISOString();
  } catch (error) {
    return '';
  }
};

// Group dates by month for charting
export const groupDatesByMonth = (dates: string[]): Record<string, number> => {
  const grouped: Record<string, number> = {};
  
  dates.forEach(dateString => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return;
      
      const monthKey = format(date, 'MMM yyyy');
      grouped[monthKey] = (grouped[monthKey] || 0) + 1;
    } catch {
      // Skip invalid dates
    }
  });
  
  return grouped;
};

// Generate dates for calendar view
export const generateCalendarDates = (month: Date): Date[] => {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
  // Get the first day of the month
  const firstDay = start.getDay();
  
  // Get the number of days in the month
  const daysInMonth = end.getDate();
  
  // Create array with dates
  const dates: Date[] = [];
  
  // Add days from previous month to fill the first week
  const lastMonthEnd = new Date(month.getFullYear(), month.getMonth(), 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push(new Date(month.getFullYear(), month.getMonth() - 1, lastMonthEnd - i));
  }
  
  // Add days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(month.getFullYear(), month.getMonth(), i));
  }
  
  // Add days from next month to fill the last week
  const remainingDays = 7 - (dates.length % 7 || 7);
  for (let i = 1; i <= remainingDays; i++) {
    dates.push(new Date(month.getFullYear(), month.getMonth() + 1, i));
  }
  
  return dates;
};