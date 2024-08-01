import { KPILibrary, createFlexibleDate, Log } from '../index';

describe('KPILibrary Performance Tests', () => {
  let library: KPILibrary;

  beforeEach(() => {
    library = new KPILibrary();
  });

  test('Performance with large number of KPIs', () => {
    const startTime = Date.now();

    // Create 1000 KPIs
    for (let i = 0; i < 1000; i++) {
      library.createKPI({
        id: `kpi-${i}`,
        name: `KPI ${i}`,
        category: 'Test',
        dataType: 'number',
        conversionRule: { type: 'simple', pointsPerUnit: 1 },
        patchVersion: '1.0.0'
      });
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Time to create 1000 KPIs: ${duration}ms`);
    expect(duration).toBeLessThan(1000); // Should take less than 1 second
  });

  test('Performance with large number of logs', () => {
    const kpi = library.createKPI({
      id: 'test-kpi',
      name: 'Test KPI',
      category: 'Test',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    });

    const startTime = Date.now();

    // Create 10000 logs
    for (let i = 0; i < 10000; i++) {
      library.createLog({
        date: createFlexibleDate(2023, 7, 1 + i),
        patchVersion: '1.0.0',
        entries: [{ kpiId: 'test-kpi', value: i }]
      });
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Time to create 10000 logs: ${duration}ms`);
    expect(duration).toBeLessThan(5000); // Should take less than 5 seconds
  });

  test('Performance of score calculation for large dataset', () => {
    const kpi = library.createKPI({
      id: 'test-kpi',
      name: 'Test KPI',
      category: 'Test',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    });

    const logs: Log[] = [];
    for (let i = 0; i < 10000; i++) {
      logs.push(library.createLog({
        date: createFlexibleDate(2023, 7, 1 + i),
        patchVersion: '1.0.0',
        entries: [{ kpiId: 'test-kpi', value: i }]
      }));
    }

    const startTime = Date.now();

    const summary = library.summarizeByCategory(logs);

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Time to summarize 10000 logs: ${duration}ms`);
    expect(duration).toBeLessThan(1000); // Should take less than 1 second
    expect(summary).toEqual({ 'Test': 49995000 }); // Sum of numbers from 0 to 9999
  });
});