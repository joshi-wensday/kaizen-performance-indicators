import { Patch, PatchData } from './index';

export class PatchManager {
  private patches: Map<string, Patch> = new Map();
  private currentPatch: Patch | null = null;

  createPatch(data: PatchData): Patch {
    const patch = new Patch(data);
    this.patches.set(patch.id, patch);
    this.currentPatch = patch;
    return patch;
  }

  getPatch(id: string): Patch | undefined {
    return this.patches.get(id);
  }

  getCurrentPatch(): Patch | null {
    return this.currentPatch;
  }

  getPatchHistory(): Patch[] {
    return Array.from(this.patches.values()).sort((a, b) => {
      if (a.season !== b.season) return a.season - b.season;
      if (a.majorVersion !== b.majorVersion) return a.majorVersion - b.majorVersion;
      return a.minorVersion - b.minorVersion;
    });
  }

  findPatchByVersion(version: string): Patch | undefined {
    const [season, major, minor] = version.split('.').map(Number);
    return this.getPatchHistory().find(
      patch => patch.season === season && patch.majorVersion === major && patch.minorVersion === minor
    );
  }
}