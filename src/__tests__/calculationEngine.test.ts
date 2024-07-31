import { CalculationEngine } from '../calculationEngine';
import { createKPI, KPI } from '../kpi';
import { Log, LogEntry } from '../log';
import { Patch } from '../patch';
import { createFlexibleDate } from '../flexibleDate';

describe('CalculationEngine', () => {
  let engine: CalculationEngine;

  beforeEach(() => {
    engine = new CalculationEngine();
  });

  describe('calculateScore', () => {
    it('should calculate simple conversion correctly', () => {
      const kpi = createKPI({
        id: '1',
        name: 'Test KPI',
        category: 'Test',
        dataType: 'number',
        conversionRule: { type: 'simple', pointsPerUnit: 2 }
      });
      const logEntry: LogEntry = { kpiId: '1', value: 5 };

      expect(engine.calculateScore(kpi, logEntry)).toBe(10);
    });

    it('should calculate tiered conversion correctly', () => {
      const kpi = createKPI({
        id: '1',
        name: 'Test KPI',
        category: 'Test',
        dataType: 'number',
        conversionRule: { 
          type: 'tiered', 
          tiers: [
            { threshold: 5, pointsPerUnit: 2 },
            { threshold: 10, pointsPerUnit: 1 }
          ] 
        }
      });
      const logEntry: LogEntry = { kpiId: '1', value: 7 };

      expect(engine.calculateScore(kpi, logEntry)).toBe(12); // (5 * 2) + (2 * 1)
    });
  });

  describe('calculateScore with attributes', () => {
    it('should apply KPI attributes correctly', () => {
      const kpi = createKPI({
        id: '1',
        name: 'Test KPI',
        category: 'Test',
        dataType: 'number',
        conversionRule: { type: 'simple', pointsPerUnit: 2 },
        attributes: [
          { name: 'bonus', type: 'modifier', value: 5 },
          { name: 'multiplier', type: 'multiplier', value: 1.5 }
        ]
      });
      const logEntry: LogEntry = { kpiId: '1', value: 10 };

      // (10 * 2) + 5 = 25, then 25 * 1.5 = 37.5
      expect(engine.calculateScore(kpi, logEntry)).toBe(37.5);
    });

    it('should apply log entry attributes correctly', () => {
      const kpi = createKPI({
        id: '1',
        name: 'Test KPI',
        category: 'Test',
        dataType: 'number',
        conversionRule: { type: 'simple', pointsPerUnit: 2 }
      });
      const logEntry: LogEntry = { 
        kpiId: '1', 
        value: 10,
        attributes: { difficulty: 1.5 }
      };

      // (10 * 2) * 1.5 = 30
      expect(engine.calculateScore(kpi, logEntry)).toBe(30);
    });
  });

  describe('calculateTotalScore', () => {
    it('should calculate total score correctly', () => {
      const kpis: KPI[] = [
        createKPI({
          id: '1',
          name: 'KPI 1',
          category: 'Test',
          dataType: 'number',
          conversionRule: { type: 'simple', pointsPerUnit: 1 }
        }),
        createKPI({
          id: '2',
          name: 'KPI 2',
          category: 'Test',
          dataType: 'number',
          conversionRule: { type: 'simple', pointsPerUnit: 2 }
        })
      ];
      const log: Log = new Log({
        date: createFlexibleDate(2023, 7, 1),
        patchVersion: '1.0.0',
        entries: [
          { kpiId: '1', value: 5 },
          { kpiId: '2', value: 3 }
        ]
      });

      expect(engine.calculateTotalScore(kpis, log)).toBe(11); // (5 * 1) + (3 * 2)
    });
  });

  describe('calculateScoresByCategory', () => {
    it('should calculate scores by category correctly', () => {
      const kpis: KPI[] = [
        createKPI({
          id: '1',
          name: 'KPI 1',
          category: 'Category A',
          dataType: 'number',
          conversionRule: { type: 'simple', pointsPerUnit: 1 }
        }),
        createKPI({
          id: '2',
          name: 'KPI 2',
          category: 'Category B',
          dataType: 'number',
          conversionRule: { type: 'simple', pointsPerUnit: 2 }
        })
      ];
      const log: Log = new Log({
        date: createFlexibleDate(2023, 7, 1),
        patchVersion: '1.0.0',
        entries: [
          { kpiId: '1', value: 5 },
          { kpiId: '2', value: 3 }
        ]
      });

      const scoresByCategory = engine.calculateScoresByCategory(kpis, log);
      expect(scoresByCategory['Category A']).toBe(5);
      expect(scoresByCategory['Category B']).toBe(6);
    });
  });

  describe('applyPatchToCalculation', () => {
    it('should apply patch to KPIs correctly', () => {
      const kpis: KPI[] = [
        createKPI({
          id: '1',
          name: 'KPI 1',
          category: 'Test',
          dataType: 'number',
          conversionRule: { type: 'simple', pointsPerUnit: 1 }
        })
      ];
      const patch: Patch = new Patch({
        season: 1,
        majorVersion: 0,
        minorVersion: 1,
        changes: [
          {
            type: 'modify',
            kpiId: '1',
            details: { conversionRule: { type: 'simple', pointsPerUnit: 2 } }
          }
        ]
      });

      const updatedKpis = engine.applyPatchToCalculation(kpis, patch);
      expect(updatedKpis[0].conversionRule.pointsPerUnit).toBe(2);
    });
  });
});