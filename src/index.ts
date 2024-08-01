// Core classes
/**
 * Manages a collection of Kaizen Performance Indicators (KPIs).
 */
export { KPILibrary } from './kpiLibrary';

/**
 * Handles operations related to individual KPIs.
 */
export { KPIManager } from './kpiManager';

/**
 * Manages logging operations for the Kaizen-PIs Library.
 */
export { LogManager } from './logManager';

/**
 * Handles patch operations for updating KPIs.
 */
export { PatchManager } from './patchManager';

/**
 * Performs calculations on KPIs.
 */
export { CalculationEngine } from './calculationEngine';

/**
 * Aggregates data from multiple KPIs.
 */
export { Aggregator } from './aggregator';

// Types
export { KPI, KPIData } from './kpi';
export { Log, LogData, LogEntry } from './log';
export { Patch, PatchData, PatchChange } from './patch';

// Utility functions

/**
 * Creates a flexible date object that can represent various date formats.
 * 
 * @param date - The date to be converted into a flexible date
 * @returns A FlexibleDate object
 */
export { createFlexibleDate } from './flexibleDate';

/**
 * Compares two FlexibleDate objects.
 * 
 * @param date1 - The first FlexibleDate to compare
 * @param date2 - The second FlexibleDate to compare
 * @returns A number indicating the relative order of the dates
 */
export { compareFlexibleDates } from './flexibleDate';

/**
 * Creates a new KPI object.
 * 
 * @param data - The data to initialize the KPI with
 * @returns A new KPI object
 */
export { createKPI } from './kpi';

// Interfaces
export { FlexibleDate } from './flexibleDate';