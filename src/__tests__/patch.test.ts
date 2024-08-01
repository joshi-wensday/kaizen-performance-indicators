import { Patch, PatchData, PatchManager } from '../index';

describe('Patch', () => {
  const patchData: PatchData = {
    season: 1,
    majorVersion: 0,
    minorVersion: 0,
    changes: [
      { type: 'add', kpiId: '123', details: { name: 'New KPI' } }
    ]
  };

  it('should create a Patch with correct properties', () => {
    const patch = new Patch(patchData);
    expect(patch.season).toBe(1);
    expect(patch.majorVersion).toBe(0);
    expect(patch.minorVersion).toBe(0);
    expect(patch.changes).toHaveLength(1);
    expect(patch.id).toBeDefined();
  });

  it('should generate correct version string', () => {
    const patch = new Patch(patchData);
    expect(patch.version).toBe('1.0.0');
  });

  it('should add changes correctly', () => {
    const patch = new Patch(patchData);
    patch.addChange({ type: 'modify', kpiId: '456', details: { name: 'Modified KPI' } });
    expect(patch.changes).toHaveLength(2);
  });
});

describe('PatchManager', () => {
  let manager: PatchManager;
  const patchData: PatchData = {
    season: 1,
    majorVersion: 0,
    minorVersion: 0,
    changes: []
  };

  beforeEach(() => {
    manager = new PatchManager();
  });

  it('should create and retrieve a Patch', () => {
    const patch = manager.createPatch(patchData);
    expect(patch).toBeDefined();
    expect(patch.version).toBe('1.0.0');

    const retrievedPatch = manager.getPatch(patch.id);
    expect(retrievedPatch).toBeDefined();
    expect(retrievedPatch?.id).toBe(patch.id);
  });

  it('should set and get current Patch', () => {
    const patch = manager.createPatch(patchData);
    expect(manager.getCurrentPatch()).toBe(patch);
  });

  it('should retrieve patch history in correct order', () => {
    manager.createPatch({ ...patchData, season: 1, majorVersion: 0, minorVersion: 0 });
    manager.createPatch({ ...patchData, season: 1, majorVersion: 1, minorVersion: 0 });
    manager.createPatch({ ...patchData, season: 1, majorVersion: 0, minorVersion: 1 });

    const history = manager.getPatchHistory();
    expect(history).toHaveLength(3);
    expect(history[0].version).toBe('1.0.0');
    expect(history[1].version).toBe('1.0.1');
    expect(history[2].version).toBe('1.1.0');
  });

  it('should find patch by version', () => {
    manager.createPatch({ ...patchData, season: 1, majorVersion: 0, minorVersion: 0 });
    manager.createPatch({ ...patchData, season: 1, majorVersion: 1, minorVersion: 0 });

    const patch = manager.findPatchByVersion('1.1.0');
    expect(patch).toBeDefined();
    expect(patch?.version).toBe('1.1.0');
  });
});