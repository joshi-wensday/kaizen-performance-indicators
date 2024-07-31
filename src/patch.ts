import { v4 as uuidv4 } from 'uuid';

export interface PatchData {
  season: number;
  majorVersion: number;
  minorVersion: number;
  changes: PatchChange[];
}

export interface PatchChange {
  type: 'add' | 'remove' | 'modify';
  kpiId: string;
  details: any;
}

export class Patch {
  readonly id: string;
  season: number;
  majorVersion: number;
  minorVersion: number;
  changes: PatchChange[];

  constructor(data: PatchData) {
    this.id = uuidv4();
    this.season = data.season;
    this.majorVersion = data.majorVersion;
    this.minorVersion = data.minorVersion;
    this.changes = data.changes;
  }

  get version(): string {
    return `${this.season}.${this.majorVersion}.${this.minorVersion}`;
  }

  addChange(change: PatchChange): void {
    this.changes.push(change);
  }

  toJSON(): object {
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