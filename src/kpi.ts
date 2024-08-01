import { v4 as uuidv4 } from 'uuid';

/**
 * Represents the data structure for a Kaizen Performance Indicator (KPI).
 */
export interface KPIData {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  dataType: 'number' | 'boolean' | 'string' | 'custom';
  customDataType?: any;
  conversionRule: ConversionRule;
  attributes?: KPIAttribute[];
  patchVersion: string; // Tracks the version of the KPI data structure
}

/**
 * Represents a conversion rule for calculating points based on KPI values.
 */
interface ConversionRule {
  type: 'simple' | 'tiered';
  pointsPerUnit?: number; // Used for simple conversion
  tiers?: { threshold: number; pointsPerUnit: number }[]; // Used for tiered conversion
}

/**
 * Represents an attribute that can modify or multiply the KPI value.
 */
interface KPIAttribute {
  name: string;
  type: 'modifier' | 'multiplier';
  value: number; // The amount by which to modify or multiply the KPI value
}

/**
 * Represents a Kaizen Performance Indicator (KPI) with additional methods for updating and serialization.
 */
export interface KPI extends KPIData {
    /**
   * Updates the KPI with new data.
   * 
   * @param data - Partial KPI data to update
   */
  update(data: Partial<KPIData>): void;
  /**
   * Converts the KPI to a plain JavaScript object.
   * 
   * @returns A plain JavaScript object representation of the KPI
   */
  toJSON(): object;
}

/**
 * Creates a new KPI object with the given data.
 *
 * @param data - The data to create the KPI with
 * @returns A new KPI object
 */
export function createKPI(data: KPIData): KPI {
  return {
    ...data,
    id: data.id || uuidv4(), // Generate a new UUID if no ID is provided
    update(updateData: Partial<KPIData>) {
      // Merge the update data with the existing KPI data
      Object.assign(this, updateData);
    },
    toJSON() {
      // Create a shallow copy of the KPI object
      return { ...this };
    }
  };
}