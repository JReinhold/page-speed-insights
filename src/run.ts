import { info, setFailed } from '@actions/core';
import { analyse } from './lib/analyse';
import { getInputs } from './lib/get-inputs';

export const run = async (): Promise<void> => {
	try {
		const inputs = getInputs();
		const analysisResult = await analyse(inputs);
		info(JSON.stringify(analysisResult));

		// TODO: analyse compareUrl

		// TODO: build JSON result

		// TODO: build markdown table output

		// TODO: comment

		// TODO: fail or pass from threshold input
	} catch (error) {
		if (error instanceof Error) {
			setFailed(error.message);
		} else {
			setFailed(error as any);
		}
	}
};
