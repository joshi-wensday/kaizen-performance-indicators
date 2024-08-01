import { KPI, Log, FlexibleDate, compareFlexibleDates, CalculationEngine } from './index';

/**
 * Aggregator class for summarizing and analyzing KPI data and logs.
 */
export class Aggregator {
  private calculationEngine: CalculationEngine;

  /**
   * Creates an instance of Aggregator.
   *
   * @param calculationEngine - The calculation engine to use for score calculations
   */
  constructor(calculationEngine: CalculationEngine) {
    this.calculationEngine = calculationEngine;
  }

  /**
   * Summarizes KPI scores by category for a set of logs.
   *
   * @param kpis - Array of KPIs to use for calculations
   * @param logs - Array of logs to summarize
   * @returns An object with categories as keys and total scores as values
   */
  summarizeByCategory(kpis: KPI[], logs: Log[]): { [category: string]: number } {
    const summary: { [category: string]: number } = {};

    logs.forEach(log => {
      // Calculate scores for each category using the calculation engine
      const scores = this.calculationEngine.calculateScoresByCategory(kpis, log);

      // Accumulate scores for each category
      Object.entries(scores).forEach(([category, score]) => {
        summary[category] = (summary[category] || 0) + score;
      });
    });

    return summary;
  }

  /**
   * Summarizes KPI scores within a specified time range.
   *
   * @param kpis - Array of KPIs to use for calculations
   * @param logs - Array of logs to summarize
   * @param startDate - The start date of the time range
   * @param endDate - The end date of the time range
   * @returns An array of objects containing dates and total scores, sorted by date
   */
  summarizeByTimeRange(kpis: KPI[], logs: Log[], startDate: FlexibleDate, endDate: FlexibleDate): { date: FlexibleDate; totalScore: number }[] {
    return logs
      // Filter logs within the specified date range
      .filter(log => compareFlexibleDates(log.date, startDate) >= 0 && compareFlexibleDates(log.date, endDate) <= 0)
      // Calculate total score for each log
      .map(log => ({
        date: log.date,
        totalScore: this.calculationEngine.calculateTotalScore(kpis, log)
      }))
      // Sort results by date
      .sort((a, b) => compareFlexibleDates(a.date, b.date));
  }

  /**
   * Calculates the average score for each category across all logs.
   *
   * @param kpis - Array of KPIs to use for calculations
   * @param logs - Array of logs to analyze
   * @returns An object with categories as keys and average scores as values
   */
  getAverageScoreByCategory(kpis: KPI[], logs: Log[]): { [category: string]: number } {
    // Get total scores for each category
    const summary = this.summarizeByCategory(kpis, logs);
    const logCount = logs.length;

    // Calculate average scores by dividing total scores by the number of logs
    return Object.fromEntries(
      Object.entries(summary).map(([category, totalScore]) => [
        category,
        totalScore / logCount
      ])
    );
  }
}