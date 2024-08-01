import { KPI, Log, LogEntry, Patch } from './index';

/**
 * Handles various calculations related to KPIs, logs, and scores.
 */
export class CalculationEngine {
  /**
   * Calculates the score for a single KPI and log entry.
   *
   * @param kpi - The KPI object containing conversion rules and attributes
   * @param logEntry - The log entry containing value and attributes
   * @returns The calculated score as a number
   * @throws Error if the conversion rule type is invalid
   */
  calculateScore(kpi: KPI, logEntry: LogEntry): number {
    const { conversionRule, attributes: kpiAttributes } = kpi;
    const { value, attributes: logAttributes } = logEntry;

    let score = 0;

    // Calculate base score based on conversion rule type
    if (conversionRule.type === 'simple') {
      // Simple rule: multiply value by points per unit
      score = value * (conversionRule.pointsPerUnit || 1);
    } else if (conversionRule.type === 'tiered') {
      // Tiered rule: apply different point values for each tier
      let remainingValue = value;

      for (const tier of conversionRule.tiers || []) {
        if (remainingValue <= 0) break;

        const tierValue = Math.min(remainingValue, tier.threshold);
        score += tierValue * tier.pointsPerUnit;
        remainingValue -= tierValue;
      }
    } else {
      throw new Error('Invalid conversion rule type');
    }

    // Apply KPI attributes (modifiers and multipliers)
    kpiAttributes?.forEach(attr => {
      if (attr.type === 'modifier') {
        score += attr.value;
      } else if (attr.type === 'multiplier') {
        score *= attr.value;
      }
    });

    // Apply log entry attributes (as multipliers)
    Object.entries(logAttributes || {}).forEach(([key, value]) => {
      if (typeof value === 'number') {
        score *= value;
      }
    });

    return score;
  }

  /**
   * Calculates the total score across all KPIs and log entries.
   *
   * @param kpis - An array of KPI objects
   * @param log - The log object containing entries
   * @returns The total calculated score as a number
   */
  calculateTotalScore(kpis: KPI[], log: Log): number {
    // Iterate through all log entries, find matching KPI, and sum up scores
    return log.entries.reduce((total, entry) => {
      const kpi = kpis.find(k => k.id === entry.kpiId);
      if (!kpi) return total;
      return total + this.calculateScore(kpi, entry);
    }, 0);
  }

  /**
   * Calculates scores grouped by KPI categories.
   *
   * @param kpis - An array of KPI objects
   * @param log - The log object containing entries
   * @returns An object with categories as keys and their total scores as values
   */
  calculateScoresByCategory(kpis: KPI[], log: Log): { [category: string]: number } {
    const scoresByCategory: { [category: string]: number } = {};

    // Iterate through log entries, calculate scores, and group by category
    log.entries.forEach(entry => {
      const kpi = kpis.find(k => k.id === entry.kpiId);
      if (!kpi) return;

      const score = this.calculateScore(kpi, entry);
      // Add score to the corresponding category, initializing if necessary
      scoresByCategory[kpi.category] = (scoresByCategory[kpi.category] || 0) + score;
    });

    return scoresByCategory;
  }

  /**
   * Applies a patch to modify KPI calculations.
   *
   * @param kpis - An array of KPI objects to be modified
   * @param patch - The patch object containing changes to be applied
   * @returns A new array of modified KPI objects
   */
  applyPatchToCalculation(kpis: KPI[], patch: Patch): KPI[] {
    // This is a simplified implementation. In a real-world scenario,
    // you might need more complex logic to apply patches.

    // Map through KPIs and apply changes if specified in the patch
    return kpis.map(kpi => {
      const change = patch.changes.find(c => c.kpiId === kpi.id);
      if (change && change.type === 'modify') {
        // Merge the original KPI with the changes
        return { ...kpi, ...change.details };
      }
      return kpi;
    });
  }
}