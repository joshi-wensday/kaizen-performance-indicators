import { v4 as uuidv4 } from 'uuid';
import { FlexibleDate } from './flexibleDate';

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

export class Log {
  readonly id: string;
  date: FlexibleDate;
  patchVersion: string;
  entries: LogEntry[];

  constructor(data: LogData) {
    this.id = uuidv4();
    this.date = data.date;
    this.patchVersion = data.patchVersion;
    this.entries = data.entries;
  }

  addEntry(entry: LogEntry): void {
    const existingIndex = this.entries.findIndex(e => e.kpiId === entry.kpiId);
    if (existingIndex !== -1) {
      this.entries[existingIndex] = entry;
    } else {
      this.entries.push(entry);
    }
  }

  updateEntry(kpiId: string, value: any, attributes?: { [key: string]: any }): void {
    const index = this.entries.findIndex(e => e.kpiId === kpiId);
    if (index !== -1) {
      this.entries[index] = { ...this.entries[index], value, attributes };
    } else {
      this.addEntry({ kpiId, value, attributes });
    }
  }

  deleteEntry(kpiId: string): boolean {
    const initialLength = this.entries.length;
    this.entries = this.entries.filter(e => e.kpiId !== kpiId);
    return this.entries.length !== initialLength;
  }

  getEntry(kpiId: string): LogEntry | undefined {
    return this.entries.find(e => e.kpiId === kpiId);
  }

  toJSON(): object {
    return {
      id: this.id,
      date: this.date,
      patchVersion: this.patchVersion,
      entries: this.entries,
    };
  }
}