import { KPILibrary, KPIData, LogData, PatchData, createFlexibleDate } from '../index';


describe('KPILibrary', () => {
  let library: KPILibrary;

  beforeEach(() => {
    library = new KPILibrary();
  });

  it('should create and retrieve a KPI', () => {
    const kpiData: KPIData = {
      id: '1',
      name: 'Test KPI',
      category: 'Test Category',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    };

    const kpi = library.createKPI(kpiData);

    expect(kpi).toBeDefined();
    expect(kpi.name).toBe('Test KPI');

    const retrievedKPI = library.getKPI(kpi.id);
    expect(retrievedKPI).toBeDefined();
    expect(retrievedKPI?.id).toBe(kpi.id);
  });

  it('should throw an error when creating a KPI with missing fields', () => {
    const invalidKpiData = {
      id: '1',
      name: 'Test KPI',
      // missing other required fields
    };

    expect(() => library.createKPI(invalidKpiData as KPIData)).toThrow('Invalid KPI data: missing required fields');
  });

  it('should create and retrieve a Patch', () => {
    const patchData: PatchData = {
      season: 1,
      majorVersion: 0,
      minorVersion: 0,
      changes: []
    };

    const patch = library.createPatch(patchData);

    expect(patch).toBeDefined();
    expect(patch.version).toBe('1.0.0');

    const retrievedPatch = library.getPatch(patch.id);
    expect(retrievedPatch).toBeDefined();
    expect(retrievedPatch?.id).toBe(patch.id);
  });

  it('should throw an error when creating a Patch with missing fields', () => {
    const invalidPatchData = {
      season: 1,
      // missing other required fields
    };

    expect(() => library.createPatch(invalidPatchData as PatchData)).toThrow('Invalid Patch data: missing required fields');
  });

  it('should create and retrieve a Log', () => {
    const kpi = library.createKPI({
      id: '1',
      name: 'Test KPI',
      category: 'Test Category',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    });

    const logData: LogData = {
      date: createFlexibleDate(2023, 7, 1),
      patchVersion: '1.0.0',
      entries: [{ kpiId: '1', value: 5 }]
    };

    const log = library.createLog(logData);

    expect(log).toBeDefined();

    const retrievedLog = library.getLog(log.id);
    expect(retrievedLog).toBeDefined();
    expect(retrievedLog?.id).toBe(log.id);
  });

  it('should throw an error when creating a Log with missing fields', () => {
    const invalidLogData = {
      date: createFlexibleDate(2023, 7, 1),
      // missing other required fields
    };

    expect(() => library.createLog(invalidLogData as LogData)).toThrow('Invalid Log data: missing required fields');
  });

  it('should calculate scores and aggregates', () => {
    const kpi1 = library.createKPI({
      id: '1',
      name: 'KPI 1',
      category: 'Category A',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    });

    const kpi2 = library.createKPI({
      id: '2',
      name: 'KPI 2',
      category: 'Category B',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 2 },
      patchVersion: '1.0.0'
    });

    const log1 = library.createLog({
      date: createFlexibleDate(2023, 7, 1),
      patchVersion: '1.0.0',
      entries: [
        { kpiId: '1', value: 5 },
        { kpiId: '2', value: 3 }
      ]
    });

    const log2 = library.createLog({
      date: createFlexibleDate(2023, 7, 2),
      patchVersion: '1.0.0',
      entries: [
        { kpiId: '1', value: 3 },
        { kpiId: '2', value: 4 }
      ]
    });

    expect(library.calculateScore(kpi1, log1.entries[0])).toBe(5);
    expect(library.calculateTotalScore(log1)).toBe(11); // 5 + (3 * 2)

    const categorySummary = library.summarizeByCategory([log1, log2]);
    expect(categorySummary).toEqual({
      'Category A': 8, // (5 + 3)
      'Category B': 14 // ((3 * 2) + (4 * 2))
    });

    const timeSummary = library.summarizeByTimeRange(
      createFlexibleDate(2023, 7, 1),
      createFlexibleDate(2023, 7, 2)
    );
    expect(timeSummary).toEqual([
      { date: createFlexibleDate(2023, 7, 1), totalScore: 11 },
      { date: createFlexibleDate(2023, 7, 2), totalScore: 11 }
    ]);

    const averages = library.getAverageScoreByCategory([log1, log2]);
    expect(averages).toEqual({
      'Category A': 4, // (5 + 3) / 2
      'Category B': 7  // ((3 * 2) + (4 * 2)) / 2
    });
  });
});