import { debug, setOutput, setFailed } from '@actions/core';

export const run = async (): Promise<void> => {
	try {
		// TODO: get and parse inputs

		// TODO: analyse url

		// TODO: analyse compareUrl

		// TODO: build JSON result

		// TODO: build markdown table output

		// TODO: comment

		// TODO: fail or pass from threshold input

		debug(new Date().toTimeString());
		debug(new Date().toTimeString());

		setOutput('time', new Date().toTimeString());
	} catch (error) {
		if (error instanceof Error) setFailed(error.message);
	}
};
