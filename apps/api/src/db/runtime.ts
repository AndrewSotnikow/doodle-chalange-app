type DatabaseMode = 'memory' | 'mongo';

let databaseMode: DatabaseMode = 'memory';

const databaseRuntime = {
  getMode(): DatabaseMode {
    return databaseMode;
  },
  isMemory(): boolean {
    return databaseMode === 'memory';
  },
  setMode(mode: DatabaseMode): void {
    databaseMode = mode;
  },
} as const;

export { databaseRuntime };
