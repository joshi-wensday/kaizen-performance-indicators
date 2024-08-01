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

  // KPI Methods
  createKPI(data: KPIData): KPI {
    if (!data.id || !data.name || !data.category || !data.dataType || !data.conversionRule || !data.patchVersion) {
      throw new Error('Invalid KPI data: missing required fields');
    }
    if (this.kpiManager.getKPI(data.id)) {
      throw new Error(`KPI with id ${data.id} already exists`);
    }
    return this.kpiManager.createKPI(data);
  }

  getKPI(id: string): KPI | undefined {
    return this.kpiManager.getKPI(id);
  }

  updateKPI(id: string, data: Partial<KPIData>): KPI | undefined {
    const kpi = this.kpiManager.getKPI(id);
    if (!kpi) {
      throw new Error(`KPI with id ${id} not found`);
    }
    return this.kpiManager.updateKPI(id, data);
  }

  deleteKPI(id: string): boolean {
    if (!this.kpiManager.getKPI(id)) {
      throw new Error(`KPI with id ${id} not found`);
    }
    return this.kpiManager.deleteKPI(id);
  }

  getAllKPIs(): KPI[] {
    return this.kpiManager.getAllKPIs();
  }

  getKPIsByCategory(category: string): KPI[] {
    return this.getAllKPIs().filter(kpi => kpi.category === category);
  }

  getKPIsByPatch(patchVersion: string): KPI[] {
    return this.getAllKPIs().filter(kpi => kpi.patchVersion === patchVersion);
  }

  getAllCategories(patchVersion?: string): { [category: string]: string[] } {
    return this.kpiManager.getAllCategories(patchVersion);
  }

  // Patch Methods
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

  createPatch(data: PatchData): Patch {
    if (!data.season || data.majorVersion === undefined || data.minorVersion === undefined) {
      throw new Error('Invalid Patch data: missing required fields');
    }
    // Check if all KPIs in the patch changes exist
    for (const change of data.changes) {
      if (!this.kpiManager.getKPI(change.kpiId)) {
        throw new Error(`Invalid Patch data: KPI with id ${change.kpiId} not found`);
      }
    }
    const patch = this.patchManager.createPatch(data);
    this.applyPatch(patch);
    return patch;
  }

  getPatch(id: string): Patch | undefined {
    return this.patchManager.getPatch(id);
  }

  getCurrentPatch(): Patch | null {
    return this.patchManager.getCurrentPatch();
  }

  getPatchHistory(): Patch[] {
    return this.patchManager.getPatchHistory();
  }

  // Log Methods
  createLog(data: LogData): Log {
    if (!data.date || !data.patchVersion || !data.entries) {
      throw new Error('Invalid Log data: missing required fields');
    }
    // Check if all KPIs in the log entries exist
    for (const entry of data.entries) {
      if (!this.kpiManager.getKPI(entry.kpiId)) {
        throw new Error(`Invalid Log data: KPI with id ${entry.kpiId} not found`);
      }
    }
    return this.logManager.createLog(data);
  }

  updateLog(id: string, data: Partial<LogData>): Log | undefined {
    const log = this.logManager.getLog(id);
    if (!log) {
      throw new Error(`Log with id ${id} not found`);
    }
    return this.logManager.updateLog(id, data);
  }

  getLog(id: string): Log | undefined {
    return this.logManager.getLog(id);
  }

  deleteLog(id: string): boolean {
    if (!this.logManager.getLog(id)) {
      throw new Error(`Log with id ${id} not found`);
    }
    return this.logManager.deleteLog(id);
  }

  getLatestLog(): Log | undefined {
    const allLogs = this.logManager.getAllLogs();
    return allLogs.length > 0 ? allLogs[allLogs.length - 1] : undefined;
  }

  getLogsByDateRange(startDate: FlexibleDate, endDate: FlexibleDate): Log[] {
    return this.logManager.getLogsByDateRange(startDate, endDate);
  }

  // Calculation Methods
  calculateScore(kpi: KPI, logEntry: Log['entries'][0]): number {
    return this.calculationEngine.calculateScore(kpi, logEntry);
  }

  calculateTotalScore(log: Log): number {
    return this.calculationEngine.calculateTotalScore(this.getAllKPIs(), log);
  }

  // Aggregation Methods
  summarizeByCategory(logs: Log[]): { [category: string]: number } {
    return this.aggregator.summarizeByCategory(this.getAllKPIs(), logs);
  }

  summarizeByTimeRange(startDate: FlexibleDate, endDate: FlexibleDate): { date: FlexibleDate; totalScore: number }[] {
    const logs = this.getLogsByDateRange(startDate, endDate);
    return this.aggregator.summarizeByTimeRange(this.getAllKPIs(), logs, startDate, endDate);
  }

  getAverageScoreByCategory(logs: Log[]): { [category: string]: number } {
    return this.aggregator.getAverageScoreByCategory(this.getAllKPIs(), logs);
  }

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

  exportData(startDate: FlexibleDate, endDate: FlexibleDate): string {
    const kpis = this.getAllKPIs();
    const patches = this.getPatchHistory();
    const logs = this.getLogsByDateRange(startDate, endDate);
    return JSON.stringify({ kpis, patches, logs });
  }

  importData(jsonString: string): void {
    const data = JSON.parse(jsonString);
    data.kpis.forEach((kpi: KPIData) => this.createKPI(kpi));
    data.patches.forEach((patch: PatchData) => this.createPatch(patch));
    data.logs.forEach((log: LogData) => this.createLog(log));
  }
}