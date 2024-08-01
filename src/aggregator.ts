import { KPI, Log, FlexibleDate, compareFlexibleDates, CalculationEngine } from './index';


export class Aggregator {
  private calculationEngine: CalculationEngine;

  constructor(calculationEngine: CalculationEngine) {
    this.calculationEngine = calculationEngine;
  }

  summarizeByCategory(kpis: KPI[], logs: Log[]): { [category: string]: number } {
    const summary: { [category: string]: number } = {};

    logs.forEach(log => {
      const scores = this.calculationEngine.calculateScoresByCategory(kpis, log);
      Object.entries(scores).forEach(([category, score]) => {
        summary[category] = (summary[category] || 0) + score;
      });
    });

    return summary;
  }

  summarizeByTimeRange(kpis: KPI[], logs: Log[], startDate: FlexibleDate, endDate: FlexibleDate): { date: FlexibleDate; totalScore: number }[] {
    return logs
      .filter(log => compareFlexibleDates(log.date, startDate) >= 0 && compareFlexibleDates(log.date, endDate) <= 0)
      .map(log => ({
        date: log.date,
        totalScore: this.calculationEngine.calculateTotalScore(kpis, log)
      }))
      .sort((a, b) => compareFlexibleDates(a.date, b.date));
  }

  getAverageScoreByCategory(kpis: KPI[], logs: Log[]): { [category: string]: number } {
    const summary = this.summarizeByCategory(kpis, logs);
    const logCount = logs.length;

    return Object.fromEntries(
      Object.entries(summary).map(([category, totalScore]) => [
        category,
        totalScore / logCount
      ])
    );
  }
}