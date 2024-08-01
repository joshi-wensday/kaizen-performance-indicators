import {
    KPIManager,
    PatchManager,
    LogManager,
    CalculationEngine,
    Aggregator,
    KPI,
    KPIData,
    Patch,
    PatchData,
    Log,
    LogData,
    FlexibleDate
  } from './index';
  
  /**
   * Main class for managing KPIs, logs, patches, and performing calculations and aggregations.
   * Provides a high-level interface for interacting with the Kaizen-PIs Library.
   */
  export class KPILibrary {
    private kpiManager: KPIManager;
    private patchManager: PatchManager;
    private logManager: LogManager;
    private calculationEngine: CalculationEngine;
    private aggregator: Aggregator;
  
    constructor() {
      this.kpiManager = new KPIManager();
      this.patchManager = new PatchManager();
      this.logManager = new LogManager();
      this.calculationEngine = new CalculationEngine();
      this.aggregator = new Aggregator(this.calculationEngine);
    }
  
    /**
     * Creates a new KPI.
     * @param data - The data for the new KPI.
     * @returns The created KPI.
     * @throws Error if the KPI data is invalid or if a KPI with the same ID already exists.
     */
    createKPI(data: KPIData): KPI {
      if (!data.id || !data.name || !data.category || !data.dataType || !data.conversionRule || !data.patchVersion) {
        throw new Error('Invalid KPI data: missing required fields');
      }
      if (this.kpiManager.getKPI(data.id)) {
        throw new Error(`KPI with id ${data.id} already exists`);
      }
      return this.kpiManager.createKPI(data);
    }
  
    /**
     * Retrieves a KPI by its ID.
     * @param id - The ID of the KPI to retrieve.
     * @returns The KPI if found, undefined otherwise.
     */
    getKPI(id: string): KPI | undefined {
      return this.kpiManager.getKPI(id);
    }
  
    /**
     * Updates an existing KPI.
     * @param id - The ID of the KPI to update.
     * @param data - The data to update the KPI with.
     * @returns The updated KPI if found, undefined otherwise.
     * @throws Error if the KPI is not found.
     */
    updateKPI(id: string, data: Partial<KPIData>): KPI | undefined {
      const kpi = this.kpiManager.getKPI(id);
      if (!kpi) {
        throw new Error(`KPI with id ${id} not found`);
      }
      return this.kpiManager.updateKPI(id, data);
    }
  
    /**
     * Deletes a KPI.
     * @param id - The ID of the KPI to delete.
     * @returns True if the KPI was deleted, false otherwise.
     * @throws Error if the KPI is not found.
     */
    deleteKPI(id: string): boolean {
      if (!this.kpiManager.getKPI(id)) {
        throw new Error(`KPI with id ${id} not found`);
      }
      return this.kpiManager.deleteKPI(id);
    }
  
    /**
     * Retrieves all KPIs.
     * @returns An array of all KPIs.
     */
    getAllKPIs(): KPI[] {
      return this.kpiManager.getAllKPIs();
    }
  
    /**
     * Retrieves all KPIs in a specific category.
     * @param category - The category to filter KPIs by.
     * @returns An array of KPIs in the specified category.
     */
    getKPIsByCategory(category: string): KPI[] {
      return this.getAllKPIs().filter(kpi => kpi.category === category);
    }
  
    /**
     * Retrieves all KPIs associated with a specific patch version.
     * @param patchVersion - The patch version to filter KPIs by.
     * @returns An array of KPIs associated with the specified patch version.
     */
    getKPIsByPatch(patchVersion: string): KPI[] {
      return this.getAllKPIs().filter(kpi => kpi.patchVersion === patchVersion);
    }
  
    /**
     * Retrieves all categories and their subcategories.
     * @param patchVersion - Optional patch version to filter categories by.
     * @returns An object with categories as keys and arrays of subcategories as values.
     */
    getAllCategories(patchVersion?: string): { [category: string]: string[] } {
      return this.kpiManager.getAllCategories(patchVersion);
    }
  
    /**
     * Applies a patch to the KPIs.
     * @param patch - The patch to apply.
     * @throws Error if the change type is unknown.
     */
    applyPatch(patch: Patch): void {
      for (const change of patch.changes) {
        switch (change.type) {
          case 'add':
            this.createKPI(change.details as KPIData);
            break;
          case 'modify':
            this.updateKPI(change.kpiId, change.details);
            break;
          case 'remove':
            this.deleteKPI(change.kpiId);
            break;
          default:
            throw new Error(`Unknown change type: ${(change as any).type}`);
        }
      }
    }
  
    /**
     * Creates a new patch and applies it.
     * @param data - The data for the new patch.
     * @returns The created patch.
     * @throws Error if the patch data is invalid or if a referenced KPI doesn't exist.
     */
    createPatch(data: PatchData): Patch {
      if (!data.season || data.majorVersion === undefined || data.minorVersion === undefined) {
        throw new Error('Invalid Patch data: missing required fields');
      }
      for (const change of data.changes) {
        if (!this.kpiManager.getKPI(change.kpiId)) {
          throw new Error(`Invalid Patch data: KPI with id ${change.kpiId} not found`);
        }
      }
      const patch = this.patchManager.createPatch(data);
      this.applyPatch(patch);
      return patch;
    }
  
    /**
     * Retrieves a patch by its ID.
     * @param id - The ID of the patch to retrieve.
     * @returns The patch if found, undefined otherwise.
     */
    getPatch(id: string): Patch | undefined {
      return this.patchManager.getPatch(id);
    }
  
    /**
     * Retrieves the most recent patch.
     * @returns The most recent patch, or null if no patches exist.
     */
    getCurrentPatch(): Patch | null {
      return this.patchManager.getCurrentPatch();
    }
  
    /**
     * Retrieves the full history of patches.
     * @returns An array of all patches in chronological order.
     */
    getPatchHistory(): Patch[] {
      return this.patchManager.getPatchHistory();
    }
  
    /**
     * Creates a new log entry.
     * @param data - The data for the new log.
     * @returns The created log.
     * @throws Error if the log data is invalid or if a referenced KPI doesn't exist.
     */
    createLog(data: LogData): Log {
      if (!data.date || !data.patchVersion || !data.entries) {
        throw new Error('Invalid Log data: missing required fields');
      }
      for (const entry of data.entries) {
        if (!this.kpiManager.getKPI(entry.kpiId)) {
          throw new Error(`Invalid Log data: KPI with id ${entry.kpiId} not found`);
        }
      }
      return this.logManager.createLog(data);
    }
  
    /**
     * Updates an existing log.
     * @param id - The ID of the log to update.
     * @param data - The data to update the log with.
     * @returns The updated log if found, undefined otherwise.
     * @throws Error if the log is not found.
     */
    updateLog(id: string, data: Partial<LogData>): Log | undefined {
      const log = this.logManager.getLog(id);
      if (!log) {
        throw new Error(`Log with id ${id} not found`);
      }
      return this.logManager.updateLog(id, data);
    }
  
    /**
     * Retrieves a log by its ID.
     * @param id - The ID of the log to retrieve.
     * @returns The log if found, undefined otherwise.
     */
    getLog(id: string): Log | undefined {
      return this.logManager.getLog(id);
    }
  
    /**
     * Deletes a log.
     * @param id - The ID of the log to delete.
     * @returns True if the log was deleted, false otherwise.
     * @throws Error if the log is not found.
     */
    deleteLog(id: string): boolean {
      if (!this.logManager.getLog(id)) {
        throw new Error(`Log with id ${id} not found`);
      }
      return this.logManager.deleteLog(id);
    }
  
    /**
     * Retrieves the most recent log entry.
     * @returns The most recent log, or undefined if no logs exist.
     */
    getLatestLog(): Log | undefined {
      const allLogs = this.logManager.getAllLogs();
      return allLogs.length > 0 ? allLogs[allLogs.length - 1] : undefined;
    }
  
    /**
     * Retrieves all logs within a specified date range.
     * @param startDate - The start date of the range.
     * @param endDate - The end date of the range.
     * @returns An array of logs within the specified date range.
     */
    getLogsByDateRange(startDate: FlexibleDate, endDate: FlexibleDate): Log[] {
      return this.logManager.getLogsByDateRange(startDate, endDate);
    }
  
    /**
     * Calculates the score for a single KPI log entry.
     * @param kpi - The KPI object.
     * @param logEntry - The log entry to calculate the score for.
     * @returns The calculated score.
     */
    calculateScore(kpi: KPI, logEntry: Log['entries'][0]): number {
      return this.calculationEngine.calculateScore(kpi, logEntry);
    }
  
    /**
     * Calculates the total score for all KPIs in a log.
     * @param log - The log to calculate the total score for.
     * @returns The calculated total score.
     */
    calculateTotalScore(log: Log): number {
      return this.calculationEngine.calculateTotalScore(this.getAllKPIs(), log);
    }
  
    /**
     * Summarizes scores by category across multiple logs.
     * @param logs - An array of logs to summarize.
     * @returns An object with categories as keys and total scores as values.
     */
    summarizeByCategory(logs: Log[]): { [category: string]: number } {
      return this.aggregator.summarizeByCategory(this.getAllKPIs(), logs);
    }
  
    /**
     * Summarizes scores over a time range.
     * @param startDate - The start date of the range.
     * @param endDate - The end date of the range.
     * @returns An array of objects containing dates and total scores.
     */
    summarizeByTimeRange(startDate: FlexibleDate, endDate: FlexibleDate): { date: FlexibleDate; totalScore: number }[] {
      const logs = this.getLogsByDateRange(startDate, endDate);
      return this.aggregator.summarizeByTimeRange(this.getAllKPIs(), logs, startDate, endDate);
    }
  
    /**
     * Calculates the average score by category across multiple logs.
     * @param logs - An array of logs to calculate averages for.
     * @returns An object with categories as keys and average scores as values.
     */
    getAverageScoreByCategory(logs: Log[]): { [category: string]: number } {
      return this.aggregator.getAverageScoreByCategory(this.getAllKPIs(), logs);
    }
  
    /**
     * Retrieves the top performing KPIs within a date range.
     * @param count - The number of top KPIs to retrieve.
     * @param startDate - The start date of the range.
     * @param endDate - The end date of the range.
     * @returns An array of objects containing KPIs and their scores, sorted by score in descending order.
     */
    getTopPerformingKPIs(count: number, startDate: FlexibleDate, endDate: FlexibleDate): { kpi: KPI, score: number }[] {
      const logs = this.getLogsByDateRange(startDate, endDate);
      const kpiScores = this.getAllKPIs().map(kpi => ({
        kpi,
        score: logs.reduce((total, log) => {
          const entry = log.entries.find(e => e.kpiId === kpi.id);
          return total + (entry ? this.calculateScore(kpi, entry) : 0);
        }, 0)
      }));
      return kpiScores.sort((a, b) => b.score - a.score).slice(0, count);
    }
  
    /**
     * Retrieves the trend data for a specific KPI within a date range.
     * @param kpiId - The ID of the KPI to get trends for.
     * @param startDate - The start date of the range.
     * @param endDate - The end date of the range.
     * @returns An array of objects containing dates and values for the specified KPI.
     * @throws Error if the KPI is not found.
     */
    getTrends(kpiId: string, startDate: FlexibleDate, endDate: FlexibleDate): { date: FlexibleDate, value: number }[] {
      const kpi = this.getKPI(kpiId);
      if (!kpi) {
        throw new Error(`KPI with id ${kpiId} not found`);
      }
      const logs = this.getLogsByDateRange(startDate, endDate);
      return logs.map(log => ({
        date: log.date,
        value: log.entries.find(e => e.kpiId === kpiId)?.value || 0
      }));
    }
  
  /**
   * Compares the performance of a KPI between two time periods.
   * @param kpiId - The ID of the KPI to compare.
   * @param period1 - The first time period to compare.
   * @param period2 - The second time period to compare.
   * @returns An object containing the scores for each period and the percentage change.
   * @throws Error if the KPI is not found.
   */
  comparePerformance(kpiId: string, period1: { start: FlexibleDate, end: FlexibleDate }, period2: { start: FlexibleDate, end: FlexibleDate }): { period1Score: number, period2Score: number, percentageChange: number } {
    const kpi = this.getKPI(kpiId);
    if (!kpi) {
      throw new Error(`KPI with id ${kpiId} not found`);
    }
    const calculatePeriodScore = (start: FlexibleDate, end: FlexibleDate) => {
      const logs = this.getLogsByDateRange(start, end);
      return logs.reduce((total, log) => {
        const entry = log.entries.find(e => e.kpiId === kpiId);
        return total + (entry ? this.calculateScore(kpi, entry) : 0);
      }, 0);
    };
    const period1Score = calculatePeriodScore(period1.start, period1.end);
    const period2Score = calculatePeriodScore(period2.start, period2.end);
    const percentageChange = ((period2Score - period1Score) / period1Score) * 100;
    return { period1Score, period2Score, percentageChange };
  }

  /**
   * Exports KPI, patch, and log data within a specified date range.
   * @param startDate - The start date of the range for log data.
   * @param endDate - The end date of the range for log data.
   * @returns A JSON string containing all KPIs, patches, and logs within the specified date range.
   */
  exportData(startDate: FlexibleDate, endDate: FlexibleDate): string {
    const kpis = this.getAllKPIs();
    const patches = this.getPatchHistory();
    const logs = this.getLogsByDateRange(startDate, endDate);
    return JSON.stringify({ kpis, patches, logs });
  }

  /**
   * Imports KPI, patch, and log data from a JSON string.
   * @param jsonString - A JSON string containing KPIs, patches, and logs to import.
   * @throws Error if the JSON string is invalid or if there are issues creating KPIs, patches, or logs.
   */
  importData(jsonString: string): void {
    const data = JSON.parse(jsonString);
    data.kpis.forEach((kpi: KPIData) => this.createKPI(kpi));
    data.patches.forEach((patch: PatchData) => this.createPatch(patch));
    data.logs.forEach((log: LogData) => this.createLog(log));
  }
}