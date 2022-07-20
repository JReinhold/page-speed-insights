import { debug, setOutput, setFailed } from '@actions/core';

export const run = async (): Promise<void> => {
	try {
		debug(new Date().toTimeString());
		debug(new Date().toTimeString());

		setOutput('time', new Date().toTimeString());
	} catch (error) {
		if (error instanceof Error) setFailed(error.message);
	}
};
