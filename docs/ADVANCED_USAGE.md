# Advanced Usage Guide for Kaizen-PIs Library

**Version: 1.0.3**

## Implementing Custom Data Types

While the Kaizen-PIs Library provides built-in support for number, boolean, and string data types, you can also implement custom data types for more complex KPIs.

### Example: Implementing a Range Data Type

```typescript
import { KPILibrary, createKPI, createFlexibleDate } from 'kaizen-pis-library';

interface RangeValue {
  min: number;
  max: number;
}

const library = new KPILibrary();

const rangeKPI = createKPI({
  id: 'range-kpi',
  name: 'Temperature Range',
  category: 'Environment',
  dataType: 'custom',
  customDataType: 'range',
  conversionRule: {
    type: 'custom',
    calculate: (value: RangeValue) => (value.max - value.min) / 2
  },
  patchVersion: '1.0.0'
});

library.createKPI(rangeKPI);

library.createLog({
  date: createFlexibleDate(2023, 7, 1),
  patchVersion: '1.0.0',
  entries: [{ kpiId: 'range-kpi', value: { min: 20, max: 30 } }]
});
```

### Example: Implementing a Multi-Metric KPI

```typescript
import { KPILibrary, createKPI, createFlexibleDate } from 'kaizen-pis-library';

interface MultiMetricValue {
  metric1: number;
  metric2: number;
  metric3: number;
}

const library = new KPILibrary();

const multiMetricKPI = createKPI({
  id: 'multi-metric-kpi',
  name: 'Customer Satisfaction',
  category: 'Customer Service',
  dataType: 'custom',
  customDataType: 'multi-metric',
  conversionRule: {
    type: 'custom',
    calculate: (value: MultiMetricValue) => (value.metric1 * 0.5 + value.metric2 * 0.3 + value.metric3 * 0.2)
  },
  patchVersion: '1.0.0'
});

library.createKPI(multiMetricKPI);

library.createLog({
  date: createFlexibleDate(2023, 7, 1),
  patchVersion: '1.0.0',
  entries: [{ kpiId: 'multi-metric-kpi', value: { metric1: 8, metric2: 7, metric3: 9 } }]
});
```

## Advanced Patch Management Strategies

### Using Patches for A/B Testing

You can use patches to implement A/B testing of different KPI configurations:

```typescript
const baseKPI = library.createKPI({
  id: 'conversion-rate',
  name: 'Conversion Rate',
  category: 'Sales',
  dataType: 'number',
  conversionRule: { type: 'simple', pointsPerUnit: 100 },
  patchVersion: '1.0.0'
});

// Create patch for version A
library.createPatch({
  season: 1,
  majorVersion: 0,
  minorVersion: 1,
  changes: [{
    type: 'modify',
    kpiId: 'conversion-rate',
    details: { conversionRule: { type: 'simple', pointsPerUnit: 150 } }
  }]
});

// Create patch for version B
library.createPatch({
  season: 1,
  majorVersion: 0,
  minorVersion: 2,
  changes: [{
    type: 'modify',
    kpiId: 'conversion-rate',
    details: { conversionRule: { type: 'simple', pointsPerUnit: 200 } }
  }]
});

// Now you can compare results using different patch versions
```

### Implementing Complex Patch Strategies

```typescript
const library = new KPILibrary();

// Initial KPI setup
library.createKPI({
  id: 'sales-kpi',
  name: 'Sales Performance',
  category: 'Sales',
  dataType: 'number',
  conversionRule: { type: 'simple', pointsPerUnit: 1 },
  patchVersion: '1.0.0'
});

// Patch 1: Adjust conversion rule and add subcategory
library.createPatch({
  season: 1,
  majorVersion: 1,
  minorVersion: 0,
  changes: [
    {
      type: 'modify',
      kpiId: 'sales-kpi',
      details: {
        conversionRule: { type: 'simple', pointsPerUnit: 1.5 },
        subcategory: 'Retail'
      }
    }
  ]
});

// Patch 2: Change to tiered conversion rule
library.createPatch({
  season: 1,
  majorVersion: 2,
  minorVersion: 0,
  changes: [
    {
      type: 'modify',
      kpiId: 'sales-kpi',
      details: {
        conversionRule: {
          type: 'tiered',
          tiers: [
            { threshold: 1000, pointsPerUnit: 1 },
            { threshold: 5000, pointsPerUnit: 1.5 },
            { threshold: 10000, pointsPerUnit: 2 }
          ]
        }
      }
    }
  ]
});

// Retrieve KPI with latest patch applied
const updatedKPI = library.getKPI('sales-kpi');
console.log(updatedKPI);
```

## Performance Optimization for Large Datasets

### Implementing Batch Operations

For large-scale operations, you can implement batch methods to reduce the number of individual calls to the library:

```typescript
import { KPILibrary, LogData } from 'kaizen-pis-library';

class OptimizedKPILibrary extends KPILibrary {
  createLogsInBatch(logs: LogData[]): void {
    logs.forEach(log => this.createLog(log));
  }

  calculateScoresInBatch(logIds: string[]): { [logId: string]: number } {
    const scores: { [logId: string]: number } = {};
    logIds.forEach(id => {
      const log = this.getLog(id);
      if (log) {
        scores[id] = this.calculateTotalScore(log);
      }
    });
    return scores;
  }
}

const library = new OptimizedKPILibrary();

// Use batch operations
const logsToCreate: LogData[] = [
  // ... array of log data
];
library.createLogsInBatch(logsToCreate);

const logIdsToCalculate: string[] = [
  // ... array of log IDs
];
const batchScores = library.calculateScoresInBatch(logIdsToCalculate);
```

### Implementing Caching for Frequent Calculations

If you find yourself performing the same calculations frequently, you can implement a caching mechanism:

```typescript
import { KPILibrary, Log } from 'kaizen-pis-library';

class CachedKPILibrary extends KPILibrary {
  private scoreCache: Map<string, number> = new Map();

  calculateTotalScore(log: Log): number {
    const cacheKey = `${log.id}_${log.patchVersion}`;
    if (this.scoreCache.has(cacheKey)) {
      return this.scoreCache.get(cacheKey)!;
    }
    const score = super.calculateTotalScore(log);
    this.scoreCache.set(cacheKey, score);
    return score;
  }

  // Remember to clear cache when logs or KPIs are updated
  clearCache(): void {
    this.scoreCache.clear();
  }
}

const library = new CachedKPILibrary();
// Use the library as normal, but benefit from caching for repeated calculations
```

These examples demonstrate advanced usage patterns that can help you optimize performance and implement complex business logic using the Kaizen-PIs Library.