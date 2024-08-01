/**
 * Represents a flexible date that can be used across different calendar systems.
 */
export interface FlexibleDate {
    year: number;
    month: number;
    day: number;
    calendar: string;
  }
  
  /**
 * Creates a new FlexibleDate object.
 *
 * @param year - The year of the date
 * @param month - The month of the date (1-12)
 * @param day - The day of the date
 * @param calendar - The calendar system (default: 'gregorian')
 * @returns A new FlexibleDate object
 */
  export function createFlexibleDate(year: number, month: number, day: number, calendar: string = 'gregorian'): FlexibleDate {
    // Simply return an object with the provided values
    return { year, month, day, calendar };
  }
  
  /**
 * Converts a FlexibleDate object to a string representation.
 *
 * @param date - The FlexibleDate object to convert
 * @returns A string representation of the date in the format "YYYY-MM-DD (calendar)"
 */
  export function flexibleDateToString(date: FlexibleDate): string {
    // Format year as is, pad month and day with leading zeros if necessary
    const formattedMonth = date.month.toString().padStart(2, '0');
    const formattedDay = date.day.toString().padStart(2, '0');
    
    // Combine all parts into a single string
    return `${date.year}-${formattedMonth}-${formattedDay} (${date.calendar})`;
  }
  
  /**
 * Compares two FlexibleDate objects.
 *
 * @param date1 - The first FlexibleDate object to compare
 * @param date2 - The second FlexibleDate object to compare
 * @returns A number indicating the relative order of the dates: 
 *          negative if date1 is earlier, positive if date1 is later, or zero if they are the same
 * @throws Error if the dates are from different calendar systems
 */
  export function compareFlexibleDates(date1: FlexibleDate, date2: FlexibleDate): number {
    // Check if the calendars are the same before comparing
    if (date1.calendar !== date2.calendar) {
      throw new Error('Cannot compare dates from different calendar systems');
    }
    
    // Compare years first
    if (date1.year !== date2.year) return date1.year - date2.year;
    // If years are the same, compare months
    if (date1.month !== date2.month) return date1.month - date2.month;
    // If months are the same, compare days
    return date1.day - date2.day;
  }