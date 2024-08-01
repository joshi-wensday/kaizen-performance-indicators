import { KPILibrary, createFlexibleDate } from '../src/index';

const library = new KPILibrary();

// Create KPIs
const salesKPI = library.createKPI({
  id: 'sales',
  name: 'Sales',
  category: 'Finance',
  dataType: 'number',
  conversionRule: { type: 'simple', pointsPerUnit: 1 },
  patchVersion: '1.0.0'
});

const customerSatisfactionKPI = library.createKPI({
  id: 'csat',
  name: 'Customer Satisfaction',
  category: 'Customer',
  dataType: 'number',
  conversionRule: { type: 'simple', pointsPerUnit: 10 },
  patchVersion: '1.0.0'
});

const productivityKPI = library.createKPI({
  id: 'productivity',
  name: 'Productivity',
  category: 'Operations',
  dataType: 'number',
  conversionRule: { type: 'simple', pointsPerUnit: 5 },
  patchVersion: '1.0.0'
});

// Create logs for a month
for (let day = 1; day <= 30; day++) {
  library.createLog({
    date: createFlexibleDate(2023, 7, day),
    patchVersion: '1.0.0',
    entries: [
      { kpiId: 'sales', value: Math.floor(Math.random() * 1000) + 500 },
      { kpiId: 'csat', value: Math.random() * 5 },
      { kpiId: 'productivity', value: Math.floor(Math.random() * 50) + 50 }
    ]
  });
}

// Simulate dashboard data retrieval
console.log('Dashboard Data:');
console.log('---------------');

// Get latest KPI values
const latestLog = library.getLatestLog();
if (latestLog) {
  console.log('Latest KPI Values:');
  latestLog.entries.forEach(entry => {
    const kpi = library.getKPI(entry.kpiId);
    console.log(`${kpi?.name}: ${entry.value}`);
  });
}

// Calculate total scores for the month
const monthLogs = library.getLogsByDateRange(
  createFlexibleDate(2023, 7, 1),
  createFlexibleDate(2023, 7, 30)
);
const totalScore = monthLogs.reduce((sum, log) => sum + library.calculateTotalScore(log), 0);
console.log(`\nTotal Score for July: ${totalScore}`);

// Get category summaries
const categorySummary = library.summarizeByCategory(monthLogs);
console.log('\nCategory Summaries:');
Object.entries(categorySummary).forEach(([category, score]) => {
  console.log(`${category}: ${score}`);
});

// Compare first half of the month to second half
const firstHalf = library.summarizeByTimeRange(
  createFlexibleDate(2023, 7, 1),
  createFlexibleDate(2023, 7, 15)
);
const secondHalf = library.summarizeByTimeRange(
  createFlexibleDate(2023, 7, 16),
  createFlexibleDate(2023, 7, 30)
);

console.log('\nFirst Half vs Second Half:');
console.log(`First Half Total: ${firstHalf.reduce((sum, day) => sum + day.totalScore, 0)}`);
console.log(`Second Half Total: ${secondHalf.reduce((sum, day) => sum + day.totalScore, 0)}`);

// Apply a patch and create a new log
library.createPatch({
  season: 1,
  majorVersion: 0,
  minorVersion: 1,
  changes: [{
    type: 'modify',
    kpiId: 'sales',
    details: { conversionRule: { type: 'simple', pointsPerUnit: 1.5 } }
  }]
});

library.createLog({
  date: createFlexibleDate(2023, 8, 1),
  patchVersion: '1.0.1',
  entries: [
    { kpiId: 'sales', value: 1000 },
    { kpiId: 'csat', value: 4.5 },
    { kpiId: 'productivity', value: 75 }
  ]
});

const newLatestLog = library.getLatestLog();
if (newLatestLog) {
  console.log('\nNew KPI Values After Patch:');
  newLatestLog.entries.forEach(entry => {
    const kpi = library.getKPI(entry.kpiId);
    console.log(`${kpi?.name}: ${entry.value}`);
  });
  console.log(`New Total Score: ${library.calculateTotalScore(newLatestLog)}`);
}