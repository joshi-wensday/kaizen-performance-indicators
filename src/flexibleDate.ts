export interface FlexibleDate {
    year: number;
    month: number;
    day: number;
    calendar: string;
  }
  
  export function createFlexibleDate(year: number, month: number, day: number, calendar: string = 'gregorian'): FlexibleDate {
    return { year, month, day, calendar };
  }
  
  export function flexibleDateToString(date: FlexibleDate): string {
    return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')} (${date.calendar})`;
  }
  
  export function compareFlexibleDates(date1: FlexibleDate, date2: FlexibleDate): number {
    if (date1.calendar !== date2.calendar) {
      throw new Error('Cannot compare dates from different calendar systems');
    }
    
    if (date1.year !== date2.year) return date1.year - date2.year;
    if (date1.month !== date2.month) return date1.month - date2.month;
    return date1.day - date2.day;
  }