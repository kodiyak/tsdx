const shell = require('shelljs');

const util = require('../utils/fixture');

shell.config.silent = true;

const testDir = 'e2e';
const stageName = 'stage-lint';

const lintDir = `test/${testDir}/fixtures/lint`;

describe('tsdx lint', () => {
  it('should fail to lint a ts file with errors', () => {
    const testFile = `${lintDir}/file-with-lint-errors.ts`;
    const output = shell.exec(`node dist/index.js lint ${testFile}`);
    expect(output.code).toBe(1);
    expect(output.stdout.includes('Parsing error:')).toBe(true);
  });

  it('should succeed linting a ts file without errors', () => {
    const testFile = `${lintDir}/file-without-lint-error.ts`;
    const output = shell.exec(`node dist/index.js lint ${testFile}`);
    expect(output.code).toBe(0);
  });

  it('should fail to lint a ts file with prettier errors', () => {
    const testFile = `${lintDir}/file-with-prettier-lint-errors.ts`;
    const output = shell.exec(`node dist/index.js lint ${testFile}`);
    expect(output.code).toBe(1);
    expect(output.stdout.includes('prettier/prettier')).toBe(true);
  });

  it('should fail to lint a tsx file with errors', () => {
    const testFile = `${lintDir}/react-file-with-lint-errors.tsx`;
    const output = shell.exec(`node dist/index.js lint ${testFile}`);
    expect(output.code).toBe(1);
    expect(output.stdout.includes('Parsing error:')).toBe(true);
  });

  it('should succeed linting a tsx file without errors', () => {
    const testFile = `${lintDir}/react-file-without-lint-error.tsx`;
    const output = shell.exec(`node dist/index.js lint ${testFile}`);
    expect(output.code).toBe(0);
  });

  it('should not lint', () => {
    const output = shell.exec(`node dist/index.js lint`);
    expect(output.code).toBe(1);
    expect(output.toString()).toContain('Defaulting to "tsdx lint src test"');
    expect(output.toString()).toContain(
      'You can override this in the package.json scripts, like "lint": "tsdx lint src otherDir"'
    );
  });

  describe('when --write-file is used', () => {
    beforeEach(() => {
      util.teardownStage(stageName);
      util.setupStageWithFixture(testDir, stageName, 'build-default');
    });

    it('should create the file', () => {
      const output = shell.exec(`node ../dist/index.js lint --write-file`);
      expect(shell.test('-f', '.eslintrc.js')).toBeTruthy();
      expect(output.code).toBe(0);
    });

    afterAll(() => {
      util.teardownStage(stageName);
    });
  });
});