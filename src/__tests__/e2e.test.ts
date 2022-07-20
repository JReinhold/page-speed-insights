import { test } from 'vitest';
import { execPath } from 'process';
import * as childProcess from 'child_process';
import { join } from 'path';

// shows how the runner will run a javascript action with env / stdout protocol
test.skip('e2e', () => {
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
