import { v4 as uuidv4 } from 'uuid';

export interface KPIData {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  dataType: 'number' | 'boolean' | 'string' | 'custom';
  customDataType?: any;
  conversionRule: ConversionRule;
  attributes?: KPIAttribute[];
  patchVersion: string; // Added this line
}

interface ConversionRule {
  type: 'simple' | 'tiered';
  pointsPerUnit?: number;
  tiers?: { threshold: number; pointsPerUnit: number }[];
}

interface KPIAttribute {
  name: string;
  type: 'modifier' | 'multiplier';
  value: number;
}

export interface KPI extends KPIData {
  update(data: Partial<KPIData>): void;
  toJSON(): object;
}

export function createKPI(data: KPIData): KPI {
  return {
    ...data,
    update(updateData: Partial<KPIData>) {
      Object.assign(this, updateData);
    },
    toJSON() {
      return { ...this };
    }
  };
}