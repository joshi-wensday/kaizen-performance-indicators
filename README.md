# Kaizen-PIs Library

**Version: 1.0.0**

Kaizen-PIs Library is a powerful and flexible tool for tracking, calculating, and analyzing Kaizen Performance Indicators (KPIs). It provides a robust set of features for managing KPIs, logs, and patches, as well as performing calculations and aggregations.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install kaizen-pis-library
```

## Quick Start

```typescript
import { KPILibrary, createFlexibleDate } from 'kaizen-pis-library';

const library = new KPILibrary();

// Create a KPI
const kpi = library.createKPI({
  id: '1',
  name: 'Sales',
  category: 'Finance',
  dataType: 'number',
  conversionRule: { type: 'simple', pointsPerUnit: 1 },
  patchVersion: '1.0.0'
});

// Create a log
library.createLog({
  date: createFlexibleDate(2023, 7, 1),
  patchVersion: '1.0.0',
  entries: [{ kpiId: '1', value: 1000 }]
});

// Calculate score
const latestLog = library.getLatestLog();
if (latestLog) {
  const score = library.calculateTotalScore(latestLog);
  console.log(`Total score: ${score}`);
}
```

## Documentation

- [API Reference](./API.md)
- [Advanced Usage Guide](./ADVANCED_USAGE.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Changelog](./CHANGELOG.md)

## Example Usage

Check out `examples/library-demo.ts` for a comprehensive demonstration of the library's features. You can run this example using:

```bash
npx ts-node examples/library-demo.ts
```

## Contributing

We welcome contributions to the Kaizen-PIs Library! Please see our [Contributing Guide](./CONTRIBUTING.md) for more details on how to get started.

## License

This project is licensed under the MIT License.

## FAQ

For frequently asked questions, please refer to our [FAQ section](./FAQ.md).