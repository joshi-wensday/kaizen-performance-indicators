import { KPI, Log, LogEntry, Patch } from './index';

export class CalculationEngine {
  calculateScore(kpi: KPI, logEntry: LogEntry): number {
    const { conversionRule, attributes: kpiAttributes } = kpi;
    const { value, attributes: logAttributes } = logEntry;

    let score = 0;

    if (conversionRule.type === 'simple') {
      score = value * (conversionRule.pointsPerUnit || 1);
    } else if (conversionRule.type === 'tiered') {
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

    // Apply KPI attributes
    kpiAttributes?.forEach(attr => {
      if (attr.type === 'modifier') {
        score += attr.value;
      } else if (attr.type === 'multiplier') {
        score *= attr.value;
      }
    });

    // Apply log entry attributes
    Object.entries(logAttributes || {}).forEach(([key, value]) => {
      if (typeof value === 'number') {
        score *= value;
      }
    });

    return score;
  }

  calculateTotalScore(kpis: KPI[], log: Log): number {
    return log.entries.reduce((total, entry) => {
      const kpi = kpis.find(k => k.id === entry.kpiId);
      if (!kpi) return total;
      return total + this.calculateScore(kpi, entry);
    }, 0);
  }

  calculateScoresByCategory(kpis: KPI[], log: Log): { [category: string]: number } {
    const scoresByCategory: { [category: string]: number } = {};

    log.entries.forEach(entry => {
      const kpi = kpis.find(k => k.id === entry.kpiId);
      if (!kpi) return;

      const score = this.calculateScore(kpi, entry);
      scoresByCategory[kpi.category] = (scoresByCategory[kpi.category] || 0) + score;
    });

    return scoresByCategory;
  }

  applyPatchToCalculation(kpis: KPI[], patch: Patch): KPI[] {
    // This is a simplified implementation. In a real-world scenario,
    // you might need more complex logic to apply patches.
    return kpis.map(kpi => {
      const change = patch.changes.find(c => c.kpiId === kpi.id);
      if (change && change.type === 'modify') {
        return { ...kpi, ...change.details };
      }
      return kpi;
    });
  }
}