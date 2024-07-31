import { Log, LogData } from './log';
import { FlexibleDate, compareFlexibleDates } from './flexibleDate';

export class LogManager {
  private logs: Map<string, Log> = new Map();

  createLog(data: LogData): Log {
    const log = new Log(data);
    this.logs.set(log.id, log);
    return log;
  }

  getLog(id: string): Log | undefined {
    return this.logs.get(id);
  }

  getLogsByDateRange(startDate: FlexibleDate, endDate: FlexibleDate): Log[] {
    return Array.from(this.logs.values()).filter(log => 
      compareFlexibleDates(log.date, startDate) >= 0 && 
      compareFlexibleDates(log.date, endDate) <= 0
    ).sort((a, b) => compareFlexibleDates(a.date, b.date));
  }

  updateLog(id: string, data: Partial<LogData>): Log | undefined {
    const log = this.logs.get(id);
    if (log) {
      Object.assign(log, data);
      return log;
    }
    return undefined;
  }

  deleteLog(id: string): boolean {
    return this.logs.delete(id);
  }

  getAllLogs(): Log[] {
    return Array.from(this.logs.values()).sort((a, b) => compareFlexibleDates(a.date, b.date));
  }
}