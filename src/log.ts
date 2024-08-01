import { v4 as uuidv4 } from 'uuid';
import { FlexibleDate } from './index';

export interface LogEntry {
  kpiId: string;
  value: any;
  attributes?: { [key: string]: any };
}

export interface LogData {
  date: FlexibleDate;
  patchVersion: string;
  entries: LogEntry[];
}

/**
 * Represents a log of KPI entries for a specific date and patch version.
 */
export class Log {
  readonly id: string;
  date: FlexibleDate;
  patchVersion: string;
  entries: LogEntry[];

  /**
   * Creates a new Log instance.
   * 
   * @param data - The initial data for the log
   */
  constructor(data: LogData) {
    // Generate a unique identifier for each log instance
    this.id = uuidv4();
    // Initialize log data from the provided data
    this.date = data.date;
    this.patchVersion = data.patchVersion;
    this.entries = data.entries;
  }

   /**
   * Adds a new entry to the log or updates an existing one.
   * 
   * @param entry - The log entry to add or update
   */
  addEntry(entry: LogEntry): void {
    // Check if an entry with the same kpiId already exists
    const existingIndex = this.entries.findIndex(e => e.kpiId === entry.kpiId);
    if (existingIndex !== -1) {
      // Update the existing entry if found
      this.entries[existingIndex] = entry;
    } else {
      // Add a new entry if not found
      this.entries.push(entry);
    }
  }

  /**
   * Updates an existing entry or adds a new one if it doesn't exist.
   * 
   * @param kpiId - The ID of the KPI to update
   * @param value - The new value for the KPI
   * @param attributes - Optional attributes for the KPI
   */
  updateEntry(kpiId: string, value: any, attributes?: { [key: string]: any }): void {
    // Find the index of the entry with the given kpiId
    const index = this.entries.findIndex(e => e.kpiId === kpiId);
    if (index !== -1) {
      // Update the existing entry, preserving other properties
      this.entries[index] = { ...this.entries[index], value, attributes };
    } else {
      // If the entry doesn't exist, add it as a new entry
      this.addEntry({ kpiId, value, attributes });
    }
  }

   /**
   * Deletes an entry from the log.
   * 
   * @param kpiId - The ID of the KPI to delete
   * @returns True if an entry was deleted, false otherwise
   */
  deleteEntry(kpiId: string): boolean {
    // Store the initial length of the entries array
    const initialLength = this.entries.length;
    // Filter out the entry with the given kpiId
    this.entries = this.entries.filter(e => e.kpiId !== kpiId);
    // Return true if an entry was deleted, false otherwise
    return this.entries.length !== initialLength;
  }

  /**
   * Retrieves an entry from the log.
   * 
   * @param kpiId - The ID of the KPI to retrieve
   * @returns The log entry if found, undefined otherwise
   */
  getEntry(kpiId: string): LogEntry | undefined {
    return this.entries.find(e => e.kpiId === kpiId);
  }

  /**
   * Converts the Log instance to a plain JavaScript object.
   * 
   * @returns A plain object representation of the Log
   */
  toJSON(): object {
    // Return a plain object representation of the Log instance
    return {
      id: this.id,
      date: this.date,
      patchVersion: this.patchVersion,
      entries: this.entries,
    };
  }
}