import { createKPI, KPI, KPIData } from '../kpi';
import { KPIManager } from '../kpiManager';

describe('KPI', () => {
  const kpiData: KPIData = {
    id: '123',
    name: 'Test KPI',
    category: 'Test Category',
    dataType: 'number',
    conversionRule: { type: 'simple', pointsPerUnit: 1 },
  };

  it('should create a KPI with correct properties', () => {
    const kpi = createKPI(kpiData);
    expect(kpi.name).toBe('Test KPI');
    expect(kpi.category).toBe('Test Category');
    expect(kpi.dataType).toBe('number');
    expect(kpi.conversionRule).toEqual({ type: 'simple', pointsPerUnit: 1 });
    expect(kpi.id).toBeDefined();
  });

  it('should update KPI properties', () => {
    const kpi = createKPI(kpiData);
    kpi.update({ name: 'Updated KPI', category: 'New Category' });
    expect(kpi.name).toBe('Updated KPI');
    expect(kpi.category).toBe('New Category');
    expect(kpi.dataType).toBe('number'); // Unchanged
  });

  it('should serialize to JSON correctly', () => {
    const kpi = createKPI(kpiData);
    const json = kpi.toJSON();
    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('name', 'Test KPI');
    expect(json).toHaveProperty('category', 'Test Category');
    expect(json).toHaveProperty('dataType', 'number');
    expect(json).toHaveProperty('conversionRule');
  });
});

describe('KPIManager', () => {
  let manager: KPIManager;
  const kpiData: KPIData = {
    id: '123',
    name: 'Test KPI',
    category: 'Test Category',
    dataType: 'number',
    conversionRule: { type: 'simple', pointsPerUnit: 1 },
  };

  beforeEach(() => {
    manager = new KPIManager();
  });

  it('should create and retrieve a KPI', () => {
    const kpi = manager.createKPI(kpiData);
    expect(kpi).toBeDefined();
    expect(kpi.name).toBe('Test KPI');

    const retrievedKPI = manager.getKPI(kpi.id);
    expect(retrievedKPI).toBeDefined();
    expect(retrievedKPI?.id).toBe(kpi.id);
  });

  it('should update a KPI', () => {
    const kpi = manager.createKPI(kpiData);
    const updatedKPI = manager.updateKPI(kpi.id, { name: 'Updated KPI' });
    expect(updatedKPI).toBeDefined();
    expect(updatedKPI?.name).toBe('Updated KPI');

    const retrievedKPI = manager.getKPI(kpi.id);
    expect(retrievedKPI?.name).toBe('Updated KPI');
  });

  it('should delete a KPI', () => {
    const kpi = manager.createKPI(kpiData);
    expect(manager.getKPI(kpi.id)).toBeDefined();

    const deleted = manager.deleteKPI(kpi.id);
    expect(deleted).toBe(true);
    expect(manager.getKPI(kpi.id)).toBeUndefined();
  });

  it('should retrieve all KPIs', () => {
    manager.createKPI(kpiData);
    manager.createKPI({ ...kpiData, id: '456', name: 'Another KPI' });

    const allKPIs = manager.getAllKPIs();
    expect(allKPIs.length).toBe(2);
    expect(allKPIs[0].name).toBe('Test KPI');
    expect(allKPIs[1].name).toBe('Another KPI');
  });
});