import { v4 as uuidv4 } from 'uuid';

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
 * Represents a single change in a patch.
 */
export interface PatchChange {
  type: 'add' | 'remove' | 'modify';
  kpiId: string;
  details: any;
}

/**
 * Represents a patch in the Kaizen-PIs system, containing version information and changes.
 */
export class Patch {
  // Unique identifier for the patch
  readonly id: string;
  // Season number of the patch
  season: number;
  // Major version number of the patch
  majorVersion: number;
  // Minor version number of the patch
  minorVersion: number;
  // Array of changes included in the patch
  changes: PatchChange[];

  /**
   * Creates a new Patch instance.
   * 
   * @param data - The patch data used to initialize the Patch instance
   */
  constructor(data: PatchData) {
    // Generate a unique ID for the patch
    this.id = uuidv4();
    // Initialize patch data from the provided data
    this.season = data.season;
    this.majorVersion = data.majorVersion;
    this.minorVersion = data.minorVersion;
    this.changes = data.changes;
  }

  /**
   * Gets the full version string of the patch.
   * 
   * @returns The version string in the format "season.majorVersion.minorVersion"
   */
  get version(): string {
    // Combine season, major, and minor versions into a single string
    return `${this.season}.${this.majorVersion}.${this.minorVersion}`;
  }

  /**
   * Adds a new change to the patch.
   * 
   * @param change - The change to be added to the patch
   */
  addChange(change: PatchChange): void {
    // Append the new change to the changes array
    this.changes.push(change);
  }

  /**
   * Converts the Patch instance to a plain JavaScript object.
   * 
   * @returns An object representation of the Patch instance
   */
  toJSON(): object {
    // Create a plain object with all patch properties, including the computed version
    return {
      id: this.id,
      season: this.season,
      majorVersion: this.majorVersion,
      minorVersion: this.minorVersion,
      changes: this.changes,
      version: this.version,
    };
  }
}