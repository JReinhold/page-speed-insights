import { test, expect } from 'vitest';
import { wait } from '../wait';
import { execPath } from 'process';
import * as childProcess from 'child_process';
import { join } from 'path';

test('throws invalid number', async () => {
	const input = parseInt('foo', 10);
	await expect(wait(input)).rejects.toThrow('milliseconds not a number');
});

test('wait 500 ms', async () => {
	const start = new Date();
	await wait(500);
	const end = new Date();
	var delta = Math.abs(end.getTime() - start.getTime());
	expect(delta).toBeGreaterThan(450);
});

// shows how the runner will run a javascript action with env / stdout protocol
test.skip('test runs', () => {
	process.env['INPUT_MILLISECONDS'] = '500';
	const options: childProcess.ExecFileSyncOptions = {
		env: process.env,
	};
	console.log(
		childProcess
			.execFileSync(
				execPath,
				[join(__dirname, '..', '..', 'dist', 'index.js')],
				options,
			)
			.toString(),
	);
});
