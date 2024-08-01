import { FlexibleDate } from './flexibleDate';
// We do not use this file currently. For now we are leaving circular dependencies in place coming from using index.ts.

/**
 * Represents the data structure for a Key Performance Indicator (KPI).
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
  patchVersion: string;
}

/**
 * Represents a Key Performance Indicator (KPI).
 */
export interface KPI extends KPIData {
  update(data: Partial<KPIData>): void;
  toJSON(): object;
}

/**
 * Represents the rule for converting KPI values to scores.
 */
export interface ConversionRule {
  type: 'simple' | 'tiered';
  pointsPerUnit?: number;
  tiers?: { threshold: number; pointsPerUnit: number }[];
}

/**
 * Represents an attribute of a KPI.
 */
export interface KPIAttribute {
  name: string;
  type: 'modifier' | 'multiplier';
  value: number;
}

/**
 * Represents a log entry for KPI values.
 */
export interface LogEntry {
  kpiId: string;
  value: any;
  attributes?: { [key: string]: any };
}

/**
 * Represents the data structure for a log.
 */
export interface LogData {
  date: FlexibleDate;
  patchVersion: string;
  entries: LogEntry[];
}

/**
 * Represents the data structure for a patch.
 */
export interface PatchData {
  season: number;
  majorVersion: number;
  minorVersion: number;
  changes: PatchChange[];
}

/**
 * Represents a change in a patch.
 */
export interface PatchChange {
  type: 'add' | 'remove' | 'modify';
  kpiId: string;
  details: any;
}