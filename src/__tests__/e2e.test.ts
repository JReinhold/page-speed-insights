import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { execPath } from 'process';
import * as childProcess from 'child_process';
import { join } from 'path';
import type { Inputs } from '../../declarations';

const camelCaseToUPPER_CASE = (cammelCase: string): string => {
	const snake_case = cammelCase.replaceAll(/[A-Z]/g, (character) => `_${character.toLowerCase()}`);
	return snake_case.toUpperCase();
};
const inputsToEnvVars = (inputs: Inputs): Record<string, string> => {
	const envVars: Record<string, string> = {};
	for (const [key, value] of Object.entries(inputs)) {
		if (value) {
			const varName = `INPUT_${camelCaseToUPPER_CASE(key)}`;
			envVars[varName] = value.toString();
		}
	}
	return envVars;
};
const assignInputsToEnvVars = (inputs: Inputs): void => {
	process.env = {
		...process.env,
		...inputsToEnvVars(inputs),
	};
};

describe('Input environment variable utilities', () => {
	it('should convert camelCase to UPPER_CASE', () => {
		expect(camelCaseToUPPER_CASE('thisIsAString')).toBe('THIS_IS_A_STRING');
	});

	it('should convert inputs to input environment variables', () => {
		expect(
			inputsToEnvVars({
				url: 'https://reinhold.is/something',
				comment: 'update',
				compareUrl: undefined,
				key: undefined,
				runs: 4,
				strategy: 'both',
				threshold: 99,
			}),
		).toMatchObject({
			INPUT_URL: 'https://reinhold.is/something',
			INPUT_COMMENT: 'update',
			INPUT_RUNS: '4',
			INPUT_STRATEGY: 'both',
			INPUT_THRESHOLD: '99',
		});
	});

	it('should assign to process.env', () => {
		const inputs: Inputs = {
			url: 'https://reinhold.is',
			comment: 'create',
			compareUrl: undefined,
			key: 'someKey',
			runs: 2,
			strategy: 'desktop',
			threshold: 99,
		};
		assignInputsToEnvVars(inputs);

		expect(process.env['INPUT_URL']).toBe(inputs.url);
		expect(process.env['INPUT_COMMENT']).toBe(inputs.comment);
		expect(process.env['INPUT_COMPARE_URL']).toBe(inputs.compareUrl);
		expect(process.env['INPUT_KEY']).toBe(inputs.key);
		expect(process.env['INPUT_RUNS']).toBe(inputs.runs.toString());
		expect(process.env['INPUT_STRATEGY']).toBe(inputs.strategy);
		expect(process.env['INPUT_THRESHOLD']).toBe(inputs.threshold?.toString());
	});
});

describe.runIf(process.env['E2E_TEST'] === 'true')('End to end tests', () => {
	const cleanEnv = { ...process.env };

	beforeAll(() => {
		// Arrange - build source
		console.log('Building source...');
		const buildStdout = childProcess.execSync('pnpm build', {
			shell: '/bin/sh',
			cwd: join(__dirname, '..'),
			env: process.env,
			encoding: 'utf8',
		});
		console.log(buildStdout);
		console.log('Done building source');

		if (!process.env['VITE_API_KEY']) {
			throw new Error(`E2E tests need a valid API key in the environment but none was found.
Get one from
https://developers.google.com/speed/docs/insights/v5/get-started#key
and add it to a ".env.test" file with the content:

VITE_API_KEY=<YOUR-KEY>
`);
		}
	});

	beforeEach(() => {
		// Arrange - clean environment variables
		process.env = cleanEnv;
	});

	// shows how the runner will run a javascript action with env / stdout protocol
	it('should work with minimal base case', () => {
		// Arrange - set up minimal inputs and environment
		assignInputsToEnvVars({
			url: 'https://reinhold.is',
			comment: 'create',
			compareUrl: undefined,
			key: process.env['VITE_API_KEY'],
			runs: 1,
			strategy: 'desktop',
			threshold: undefined,
		});

		// Act - run main action with node
		const stdout = childProcess.execFileSync(execPath, [join(__dirname, '..', '..', 'dist', 'index.js')], {
			env: process.env,
			encoding: 'utf8',
		});

		// Assert - show output
		console.log(stdout);
	});
});
