import { setFailed } from '@actions/core';
import { analyse } from './lib/analyse';
import { getInputs } from './lib/get-inputs';

export const run = async (): Promise<void> => {
	try {
		const inputs = getInputs();
		await analyse(inputs);

		// TODO: analyse compareUrl

		// TODO: build JSON result

		// TODO: build markdown table output

		// TODO: comment

		// TODO: fail or pass from threshold input
	} catch (error) {
		if (error instanceof Error) setFailed(error.message);
	}
};
