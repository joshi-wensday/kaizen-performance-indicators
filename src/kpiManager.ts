import { KPI, KPIData, createKPI } from './kpi';

export class KPIManager {
  private kpis: Map<string, KPI> = new Map();

  createKPI(data: KPIData): KPI {
    const kpi = createKPI(data);
    this.kpis.set(kpi.id, kpi);
    return kpi;
  }

  getKPI(id: string): KPI | undefined {
    return this.kpis.get(id);
  }

  updateKPI(id: string, data: Partial<KPIData>): KPI | undefined {
    const kpi = this.kpis.get(id);
    if (kpi) {
      kpi.update(data);
      return kpi;
    }
    return undefined;
  }

  deleteKPI(id: string): boolean {
    return this.kpis.delete(id);
  }

  getAllKPIs(): KPI[] {
    return Array.from(this.kpis.values());
  }
}