import { Aggregator, CalculationEngine, createKPI, KPI, Log, createFlexibleDate } from '../index';

describe('Aggregator', () => {
  let aggregator: Aggregator;
  let calculationEngine: CalculationEngine;
  let kpis: KPI[];
  let logs: Log[];

  beforeEach(() => {
    calculationEngine = new CalculationEngine();
    aggregator = new Aggregator(calculationEngine);

    kpis = [
      createKPI({
        id: '1',
        name: 'KPI 1',
        category: 'Category A',
        dataType: 'number',
        conversionRule: { type: 'simple', pointsPerUnit: 1 },
        patchVersion: '1.0.0'
      }),
      createKPI({
        id: '2',
        name: 'KPI 2',
        category: 'Category B',
        dataType: 'number',
        conversionRule: { type: 'simple', pointsPerUnit: 2 },
        patchVersion: '1.0.0'
      })
    ];

    logs = [
      new Log({
        date: createFlexibleDate(2023, 7, 1),
        patchVersion: '1.0.0',
        entries: [
          { kpiId: '1', value: 5 },
          { kpiId: '2', value: 3 }
        ]
      }),
      new Log({
        date: createFlexibleDate(2023, 7, 2),
        patchVersion: '1.0.0',
        entries: [
          { kpiId: '1', value: 3 },
          { kpiId: '2', value: 4 }
        ]
      })
    ];
  });

  it('should summarize scores by category', () => {
    const summary = aggregator.summarizeByCategory(kpis, logs);
    expect(summary).toEqual({
      'Category A': 8,  // (5 + 3) * 1
      'Category B': 14  // (3 + 4) * 2
    });
  });

  it('should summarize scores by time range', () => {
    const summary = aggregator.summarizeByTimeRange(
      kpis,
      logs,
      createFlexibleDate(2023, 7, 1),
      createFlexibleDate(2023, 7, 2)
    );
    expect(summary).toEqual([
      { date: createFlexibleDate(2023, 7, 1), totalScore: 11 },  // 5 + (3 * 2)
      { date: createFlexibleDate(2023, 7, 2), totalScore: 11 }   // 3 + (4 * 2)
    ]);
  });

  it('should calculate average scores by category', () => {
    const averages = aggregator.getAverageScoreByCategory(kpis, logs);
    expect(averages).toEqual({
      'Category A': 4,  // (5 + 3) / 2
      'Category B': 7   // (6 + 8) / 2
    });
  });
});