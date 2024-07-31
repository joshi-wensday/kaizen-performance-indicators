// Core Types

interface KPI {
    id: string;
    name: string;
    category: string;
    subcategory?: string;
    dataType: 'number' | 'boolean' | 'string' | 'custom';
    customDataType?: any;
    conversionRule: ConversionRule;
    attributes?: KPIAttribute[];
  }
  
  interface KPIAttribute {
    name: string;
    type: 'modifier' | 'multiplier';
    value: number;
  }
  
  type ConversionRule = SimpleConversion | TieredConversion;
  
  interface SimpleConversion {
    type: 'simple';
    pointsPerUnit: number;
  }
  
  interface TieredConversion {
    type: 'tiered';
    tiers: Tier[];
  }
  
  interface Tier {
    threshold: number;
    pointsPerUnit: number;
  }
  
  // Versioning Types
  
  interface Patch {
    season: Season;
    majorVersion: number;
    minorVersion: number;
    changes: PatchChange[];
  }
  
  interface Season {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    emoji?: string;
  }
  
  interface PatchChange {
    type: 'add' | 'remove' | 'modify';
    kpiId: string;
    details: any;
  }
  
  // Log Types

  interface FlexibleDate {
    year: number;
    month: number;
    day: number;
    calendar: string; // e.g., 'gregorian', 'international-fixed', etc.
  }
  
  interface Log {
    id: string;
    date: FlexibleDate;
    patchVersion: PatchVersion;
    entries: LogEntry[];
  }

  interface PatchVersion {
    season: number;
    major: number;
    minor: number;
  }
  
  interface LogEntry {
    kpiId: string;
    value: any;
    attributes?: { [key: string]: any };
  }
  
  // Aggregation Types
  
  interface AggregatedScore {
    totalScore: number;
    breakdown: CategoryBreakdown;
  }
  
  interface CategoryBreakdown {
    [category: string]: {
      score: number;
      subcategories?: {
        [subcategory: string]: number;
      };
    };
  }