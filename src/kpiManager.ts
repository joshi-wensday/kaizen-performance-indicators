import { KPI, KPIData, createKPI } from './index';

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

  getAllCategories(patchVersion?: string): { [category: string]: string[] } {
    const categories: { [category: string]: Set<string> } = {};

    this.kpis.forEach(kpi => {
      if (!patchVersion || kpi.patchVersion === patchVersion) {
        if (!categories[kpi.category]) {
          categories[kpi.category] = new Set();
        }
        if (kpi.subcategory) {
          categories[kpi.category].add(kpi.subcategory);
        }
      }
    });

    // Convert Sets to arrays
    return Object.fromEntries(
      Object.entries(categories).map(([category, subcategories]) => [
        category,
        Array.from(subcategories)
      ])
    );
  }
}