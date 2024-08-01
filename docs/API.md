# Kaizen-PIs Library API Reference

**Version: 1.0.3**

## KPILibrary

The main class that provides access to all library functionality.

### Constructor

#### new KPILibrary()

Creates a new instance of the KPILibrary.

### Methods

#### createKPI(data: KPIData): KPI

Creates a new KPI with the given data.

Parameters:
- `data: KPIData` - An object containing the KPI data
  - `id: string` - Unique identifier for the KPI
  - `name: string` - Name of the KPI
  - `category: string` - Category of the KPI
  - `subcategory?: string` - Optional subcategory of the KPI
  - `dataType: 'number' | 'boolean' | 'string' | 'custom'` - Data type of the KPI
  - `customDataType?: any` - Custom data type definition if dataType is 'custom'
  - `conversionRule: ConversionRule` - Rule for converting KPI values to scores
  - `attributes?: KPIAttribute[]` - Optional additional attributes for the KPI
  - `patchVersion: string` - Version of the patch this KPI belongs to

Returns:
- `KPI` - The created KPI object

#### getKPI(id: string): KPI | undefined

Retrieves a KPI by its ID.

Parameters:
- `id: string` - The ID of the KPI to retrieve

Returns:
- `KPI | undefined` - The KPI object if found, undefined otherwise

#### updateKPI(id: string, data: Partial<KPIData>): KPI | undefined

Updates an existing KPI with the given data.

Parameters:
- `id: string` - The ID of the KPI to update
- `data: Partial<KPIData>` - An object containing the fields to update

Returns:
- `KPI | undefined` - The updated KPI object if found, undefined otherwise

#### deleteKPI(id: string): boolean

Deletes a KPI by its ID.

Parameters:
- `id: string` - The ID of the KPI to delete

Returns:
- `boolean` - True if the KPI was successfully deleted, false otherwise

#### getAllKPIs(): KPI[]

Retrieves all KPIs.

Returns:
- `KPI[]` - An array of all KPI objects

#### getKPIsByCategory(category: string): KPI[]

Retrieves all KPIs in a specific category.

Parameters:
- `category: string` - The category to filter KPIs by

Returns:
- `KPI[]` - An array of KPI objects in the specified category

#### getKPIsByPatch(patchVersion: string): KPI[]

Retrieves all KPIs associated with a specific patch version.

Parameters:
- `patchVersion: string` - The patch version to filter KPIs by

Returns:
- `KPI[]` - An array of KPI objects associated with the specified patch version

#### createLog(data: LogData): Log

Creates a new log entry.

Parameters:
- `data: LogData` - An object containing the log data
  - `date: FlexibleDate` - The date of the log entry
  - `patchVersion: string` - The patch version associated with this log
  - `entries: LogEntry[]` - An array of log entries

Returns:
- `Log` - The created Log object

#### getLog(id: string): Log | undefined

Retrieves a log by its ID.

Parameters:
- `id: string` - The ID of the log to retrieve

Returns:
- `Log | undefined` - The Log object if found, undefined otherwise

#### getLatestLog(): Log | undefined

Retrieves the most recent log entry.

Returns:
- `Log | undefined` - The most recent Log object if any logs exist, undefined otherwise

#### getLogsByDateRange(startDate: FlexibleDate, endDate: FlexibleDate): Log[]

Retrieves all logs within a specified date range.

Parameters:
- `startDate: FlexibleDate` - The start date of the range
- `endDate: FlexibleDate` - The end date of the range

Returns:
- `Log[]` - An array of Log objects within the specified date range

#### createPatch(data: PatchData): Patch

Creates a new patch and applies it to the relevant KPIs.

Parameters:
- `data: PatchData` - An object containing the patch data
  - `season: number` - The season number for this patch
  - `majorVersion: number` - The major version number
  - `minorVersion: number` - The minor version number
  - `changes: PatchChange[]` - An array of changes to apply

Returns:
- `Patch` - The created Patch object

#### getPatch(id: string): Patch | undefined

Retrieves a patch by its ID.

Parameters:
- `id: string` - The ID of the patch to retrieve

Returns:
- `Patch | undefined` - The Patch object if found, undefined otherwise

#### getCurrentPatch(): Patch | null

Retrieves the most recent patch.

Returns:
- `Patch | null` - The most recent Patch object if any patches exist, null otherwise

#### getPatchHistory(): Patch[]

Retrieves the full history of patches.

Returns:
- `Patch[]` - An array of all Patch objects in chronological order

#### applyPatch(patch: Patch): void

Applies a patch to the relevant KPIs.

Parameters:
- `patch: Patch` - The patch to apply

#### calculateScore(kpi: KPI, logEntry: LogEntry): number

Calculates the score for a single KPI log entry.

Parameters:
- `kpi: KPI` - The KPI object
- `logEntry: LogEntry` - The log entry to calculate the score for

Returns:
- `number` - The calculated score

#### calculateTotalScore(log: Log): number

Calculates the total score for all KPIs in a log.

Parameters:
- `log: Log` - The log to calculate the total score for

Returns:
- `number` - The calculated total score

#### summarizeByCategory(logs: Log[]): { [category: string]: number }

Summarizes scores by category across multiple logs.

Parameters:
- `logs: Log[]` - An array of logs to summarize

Returns:
- `{ [category: string]: number }` - An object with categories as keys and total scores as values

#### summarizeByTimeRange(startDate: FlexibleDate, endDate: FlexibleDate): { date: FlexibleDate; totalScore: number }[]

Summarizes scores over a time range.

Parameters:
- `startDate: FlexibleDate` - The start date of the range
- `endDate: FlexibleDate` - The end date of the range

Returns:
- `{ date: FlexibleDate; totalScore: number }[]` - An array of objects containing dates and total scores

#### getAverageScoreByCategory(logs: Log[]): { [category: string]: number }

Calculates the average score by category across multiple logs.

Parameters:
- `logs: Log[]` - An array of logs to calculate averages for

Returns:
- `{ [category: string]: number }` - An object with categories as keys and average scores as values

## KPI

Represents a Kaizen Performance Indicator.

### Properties

- `id: string` - Unique identifier for the KPI
- `name: string` - Name of the KPI
- `category: string` - Category of the KPI
- `subcategory?: string` - Optional subcategory of the KPI
- `dataType: 'number' | 'boolean' | 'string' | 'custom'` - Data type of the KPI
- `customDataType?: any` - Custom data type definition if dataType is 'custom'
- `conversionRule: ConversionRule` - Rule for converting KPI values to scores
- `attributes?: KPIAttribute[]` - Optional additional attributes for the KPI
- `patchVersion: string` - Version of the patch this KPI belongs to

### Methods

#### update(data: Partial<KPIData>): void

Updates the KPI with the given data.

Parameters:
- `data: Partial<KPIData>` - An object containing the fields to update

#### toJSON(): object

Converts the KPI to a JSON-serializable object.

Returns:
- `object` - A plain JavaScript object representation of the KPI

## Log

Represents a log entry for KPI values.

### Properties

- `id: string` - Unique identifier for the log
- `date: FlexibleDate` - The date of the log entry
- `patchVersion: string` - The patch version associated with this log
- `entries: LogEntry[]` - An array of log entries

### Methods

#### addEntry(entry: LogEntry): void

Adds a new entry to the log.

Parameters:
- `entry: LogEntry` - The log entry to add

#### updateEntry(kpiId: string, value: any, attributes?: { [key: string]: any }): void

Updates an existing entry in the log.

Parameters:
- `kpiId: string` - The ID of the KPI to update
- `value: any` - The new value for the entry
- `attributes?: { [key: string]: any }` - Optional attributes to update

#### deleteEntry(kpiId: string): boolean

Deletes an entry from the log.

Parameters:
- `kpiId: string` - The ID of the KPI entry to delete

Returns:
- `boolean` - True if the entry was successfully deleted, false otherwise

#### getEntry(kpiId: string): LogEntry | undefined

Retrieves an entry from the log.

Parameters:
- `kpiId: string` - The ID of the KPI entry to retrieve

Returns:
- `LogEntry | undefined` - The log entry if found, undefined otherwise

#### toJSON(): object

Converts the Log to a JSON-serializable object.

Returns:
- `object` - A plain JavaScript object representation of the Log

## Patch

Represents a set of changes to be applied to KPIs.

### Properties

- `id: string` - Unique identifier for the patch
- `season: number` - The season number for this patch
- `majorVersion: number` - The major version number
- `minorVersion: number` - The minor version number
- `changes: PatchChange[]` - An array of changes to apply

### Methods

#### get version(): string

Gets the full version string of the patch.

Returns:
- `string` - The full version string (e.g., "1.2.3")

#### addChange(change: PatchChange): void

Adds a new change to the patch.

Parameters:
- `change: PatchChange` - The change to add

#### toJSON(): object

Converts the Patch to a JSON-serializable object.

Returns:
- `object` - A plain JavaScript object representation of the Patch

## Utility Functions

### createFlexibleDate(year: number, month: number, day: number, calendar?: string): FlexibleDate

Creates a FlexibleDate object.

Parameters:
- `year: number` - The year
- `month: number` - The month (1-12)
- `day: number` - The day of the month
- `calendar?: string` - Optional calendar system (default: 'gregorian')

Returns:
- `FlexibleDate` - A FlexibleDate object

### compareFlexibleDates(date1: FlexibleDate, date2: FlexibleDate): number

Compares two FlexibleDate objects.

Parameters:
- `date1: FlexibleDate` - The first date to compare
- `date2: FlexibleDate` - The second date to compare

Returns:
- `number` - Negative if date1 is earlier, positive if date1 is later, 0 if equal

### createKPI(data: KPIData): KPI

Creates a new KPI object.

Parameters:
- `data: KPIData` - An object containing the KPI data

Returns:
- `KPI` - A new KPI object

This completes the API reference for the Kaizen-PIs Library.