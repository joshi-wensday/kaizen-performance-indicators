import { KPILibrary, createFlexibleDate } from '../index';

describe('KPILibrary Integration Tests', () => {
  let library: KPILibrary;

  beforeEach(() => {
    library = new KPILibrary();
  });

  test('Full workflow: Create KPI, log data, apply patch, and calculate scores', () => {
    // Create a KPI
    const kpi = library.createKPI({
      id: 'sales',
      name: 'Sales',
      category: 'Finance',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    });

    expect(kpi).toBeDefined();
    expect(kpi.id).toBe('sales');

    // Create logs
    const log1 = library.createLog({
      date: createFlexibleDate(2023, 7, 1),
      patchVersion: '1.0.0',
      entries: [{ kpiId: 'sales', value: 1000 }]
    });

    const log2 = library.createLog({
      date: createFlexibleDate(2023, 7, 2),
      patchVersion: '1.0.0',
      entries: [{ kpiId: 'sales', value: 1500 }]
    });

    expect(log1).toBeDefined();
    expect(log2).toBeDefined();

    // Calculate scores
    const score1 = library.calculateTotalScore(log1);
    const score2 = library.calculateTotalScore(log2);

    expect(score1).toBe(1000);
    expect(score2).toBe(1500);

    // Apply a patch
    const patch = library.createPatch({
      season: 1,
      majorVersion: 0,
      minorVersion: 1,
      changes: [{
        type: 'modify',
        kpiId: 'sales',
        details: { conversionRule: { type: 'simple', pointsPerUnit: 1.5 } }
      }]
    });

    expect(patch).toBeDefined();
    expect(patch.version).toBe('1.0.1');

    // Create a new log with the new patch version
    const log3 = library.createLog({
      date: createFlexibleDate(2023, 7, 3),
      patchVersion: '1.0.1',
      entries: [{ kpiId: 'sales', value: 1000 }]
    });

    // Calculate score with new conversion rule
    const score3 = library.calculateTotalScore(log3);
    expect(score3).toBe(1500); // 1000 * 1.5

    // Test aggregation
    const summary = library.summarizeByCategory([log1, log2, log3]);
    expect(summary).toEqual({ 'Finance': 5250 }); // 1000 + 1500 + (1000 * 1.5)

    const averages = library.getAverageScoreByCategory([log1, log2, log3]);
    expect(averages).toEqual({ 'Finance': 1750 }); // 5250 / 3

  });

  test('Error handling: Create duplicate KPI', () => {
    library.createKPI({
      id: 'unique',
      name: 'Unique KPI',
      category: 'Test',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    });

    expect(() => {
      library.createKPI({
        id: 'unique',
        name: 'Duplicate KPI',
        category: 'Test',
        dataType: 'number',
        conversionRule: { type: 'simple', pointsPerUnit: 1 },
        patchVersion: '1.0.0'
      });
    }).toThrow('KPI with id unique already exists');
  });

  test('Error handling: Log entry for non-existent KPI', () => {
    expect(() => {
      library.createLog({
        date: createFlexibleDate(2023, 7, 1),
        patchVersion: '1.0.0',
        entries: [{ kpiId: 'non-existent', value: 1000 }]
      });
    }).toThrow('Invalid Log data: KPI with id non-existent not found');
  });
});