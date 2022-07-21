import { setFailed } from '@actions/core';
import { getInputs } from './lib/get-inputs';

export const run = async (): Promise<void> => {
	try {
		// eslint-disable-next-line no-unused-vars
		const inputs = getInputs();

		// TODO: analyse url

		// TODO: analyse compareUrl

		// TODO: build JSON result

		// TODO: build markdown table output

		// TODO: comment

		// TODO: fail or pass from threshold input
	} catch (error) {
		if (error instanceof Error) setFailed(error.message);
	}
};
