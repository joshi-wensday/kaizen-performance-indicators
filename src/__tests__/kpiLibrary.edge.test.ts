import { KPILibrary, KPIData, LogData, PatchData, createFlexibleDate } from '../index';


describe('KPILibrary Edge Cases', () => {
  let library: KPILibrary;

  beforeEach(() => {
    library = new KPILibrary();
  });

  it('should throw an error when creating a KPI with an existing ID', () => {
    const kpiData: KPIData = {
      id: '1',
      name: 'Test KPI',
      category: 'Test Category',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    };

    library.createKPI(kpiData);
    expect(() => library.createKPI(kpiData)).toThrow('KPI with id 1 already exists');
  });

  it('should throw an error when creating a Log with entries for non-existent KPIs', () => {
    const logData: LogData = {
      date: createFlexibleDate(2023, 7, 1),
      patchVersion: '1.0.0',
      entries: [{ kpiId: 'non-existent', value: 5 }]
    };

    expect(() => library.createLog(logData)).toThrow('Invalid Log data: KPI with id non-existent not found');
  });

  it('should handle date edge cases correctly', () => {
    const kpi = library.createKPI({
      id: '1',
      name: 'Test KPI',
      category: 'Test Category',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    });

    library.createLog({
      date: createFlexibleDate(2023, 12, 31),
      patchVersion: '1.0.0',
      entries: [{ kpiId: '1', value: 5 }]
    });

    library.createLog({
      date: createFlexibleDate(2024, 1, 1),
      patchVersion: '1.0.0',
      entries: [{ kpiId: '1', value: 10 }]
    });

    const result = library.summarizeByTimeRange(
      createFlexibleDate(2023, 12, 31),
      createFlexibleDate(2024, 1, 1)
    );

    expect(result).toHaveLength(2);
    expect(result[0].totalScore).toBe(5);
    expect(result[1].totalScore).toBe(10);
  });

  it('should throw an error when creating a Patch with changes for non-existent KPIs', () => {
    const patchData: PatchData = {
      season: 1,
      majorVersion: 0,
      minorVersion: 0,
      changes: [{ type: 'modify', kpiId: 'non-existent', details: {} }]
    };

    expect(() => library.createPatch(patchData)).toThrow('Invalid Patch data: KPI with id non-existent not found');
  });

  it('should handle calculation with extreme values', () => {
    const kpi = library.createKPI({
      id: '1',
      name: 'Test KPI',
      category: 'Test Category',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    });

    const log = library.createLog({
      date: createFlexibleDate(2023, 7, 1),
      patchVersion: '1.0.0',
      entries: [{ kpiId: '1', value: Number.MAX_SAFE_INTEGER }]
    });

    const score = library.calculateTotalScore(log);
    expect(score).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('should handle aggregation with no logs', () => {
    const result = library.summarizeByTimeRange(
      createFlexibleDate(2023, 7, 1),
      createFlexibleDate(2023, 7, 31)
    );

    expect(result).toEqual([]);
  });

  it('should handle aggregation with a single log', () => {
    const kpi = library.createKPI({
      id: '1',
      name: 'Test KPI',
      category: 'Test Category',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    });

    library.createLog({
      date: createFlexibleDate(2023, 7, 15),
      patchVersion: '1.0.0',
      entries: [{ kpiId: '1', value: 5 }]
    });

    const result = library.summarizeByTimeRange(
      createFlexibleDate(2023, 7, 1),
      createFlexibleDate(2023, 7, 31)
    );

    expect(result).toHaveLength(1);
    expect(result[0].totalScore).toBe(5);
  });

  it('should handle applying multiple patches', () => {
    const kpi = library.createKPI({
      id: '1',
      name: 'Test KPI',
      category: 'Test Category',
      dataType: 'number',
      conversionRule: { type: 'simple', pointsPerUnit: 1 },
      patchVersion: '1.0.0'
    });

    library.createPatch({
      season: 1,
      majorVersion: 0,
      minorVersion: 1,
      changes: [{ type: 'modify', kpiId: '1', details: { conversionRule: { type: 'simple', pointsPerUnit: 2 } } }]
    });

    library.createPatch({
      season: 1,
      majorVersion: 0,
      minorVersion: 2,
      changes: [{ type: 'modify', kpiId: '1', details: { conversionRule: { type: 'simple', pointsPerUnit: 3 } } }]
    });

    const updatedKPI = library.getKPI('1');
    expect(updatedKPI?.conversionRule.pointsPerUnit).toBe(3);
  });
});