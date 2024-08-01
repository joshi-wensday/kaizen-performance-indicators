import { Log, LogData, LogManager, createFlexibleDate, FlexibleDate } from '../index';

describe('Log', () => {
  const logData: LogData = {
    date: createFlexibleDate(2023, 7, 1),
    patchVersion: '1.0.0',
    entries: [
      { kpiId: '123', value: 10 }
    ]
  };

  it('should create a Log with correct properties', () => {
    const log = new Log(logData);
    expect(log.date).toEqual(createFlexibleDate(2023, 7, 1));
    expect(log.patchVersion).toBe('1.0.0');
    expect(log.entries).toHaveLength(1);
    expect(log.id).toBeDefined();
  });

  it('should add entries correctly', () => {
    const log = new Log(logData);
    log.addEntry({ kpiId: '456', value: 20 });
    expect(log.entries).toHaveLength(2);
  });

  it('should update entries correctly', () => {
    const log = new Log(logData);
    log.updateEntry('123', 15);
    expect(log.getEntry('123')?.value).toBe(15);
  });

  it('should delete entries correctly', () => {
    const log = new Log(logData);
    log.addEntry({ kpiId: '456', value: 20 });
    expect(log.entries).toHaveLength(2);

    const deleted = log.deleteEntry('456');
    expect(deleted).toBe(true);
    expect(log.entries).toHaveLength(1);
    expect(log.getEntry('456')).toBeUndefined();

    const notDeleted = log.deleteEntry('789');
    expect(notDeleted).toBe(false);
    expect(log.entries).toHaveLength(1);
  });
});

describe('LogManager', () => {
  let manager: LogManager;
  const createLogData = (date: FlexibleDate): LogData => ({
    date,
    patchVersion: '1.0.0',
    entries: []
  });

  beforeEach(() => {
    manager = new LogManager();
  });

  it('should create and retrieve a Log', () => {
    const logData = createLogData(createFlexibleDate(2023, 7, 1));
    const log = manager.createLog(logData);
    expect(log).toBeDefined();

    const retrievedLog = manager.getLog(log.id);
    expect(retrievedLog).toBeDefined();
    expect(retrievedLog?.id).toBe(log.id);
  });

  it('should retrieve logs by date range', () => {
    manager.createLog(createLogData(createFlexibleDate(2023, 7, 1)));
    manager.createLog(createLogData(createFlexibleDate(2023, 7, 2)));
    manager.createLog(createLogData(createFlexibleDate(2023, 7, 3)));

    const logs = manager.getLogsByDateRange(
      createFlexibleDate(2023, 7, 1),
      createFlexibleDate(2023, 7, 2)
    );
    expect(logs).toHaveLength(2);
    expect(logs[0].date).toEqual(createFlexibleDate(2023, 7, 1));
    expect(logs[1].date).toEqual(createFlexibleDate(2023, 7, 2));
  });

  it('should update a Log', () => {
    const log = manager.createLog(createLogData(createFlexibleDate(2023, 7, 1)));
    const updatedLog = manager.updateLog(log.id, { patchVersion: '1.1.0' });
    expect(updatedLog).toBeDefined();
    expect(updatedLog?.patchVersion).toBe('1.1.0');
  });

  it('should delete a Log', () => {
    const log = manager.createLog(createLogData(createFlexibleDate(2023, 7, 1)));
    expect(manager.getLog(log.id)).toBeDefined();

    const deleted = manager.deleteLog(log.id);
    expect(deleted).toBe(true);
    expect(manager.getLog(log.id)).toBeUndefined();
  });

  it('should retrieve all Logs in correct order', () => {
    manager.createLog(createLogData(createFlexibleDate(2023, 7, 2)));
    manager.createLog(createLogData(createFlexibleDate(2023, 7, 1)));
    manager.createLog(createLogData(createFlexibleDate(2023, 7, 3)));

    const allLogs = manager.getAllLogs();
    expect(allLogs).toHaveLength(3);
    expect(allLogs[0].date).toEqual(createFlexibleDate(2023, 7, 1));
    expect(allLogs[1].date).toEqual(createFlexibleDate(2023, 7, 2));
    expect(allLogs[2].date).toEqual(createFlexibleDate(2023, 7, 3));
  });
});