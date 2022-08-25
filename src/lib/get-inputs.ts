import { debug, getInput, setSecret, warning } from '@actions/core';
import type { Inputs } from '../../declarations';

export const getInputs = (): Inputs => {
	debug('Getting inputs...');
	const url = getInput('url', { required: true });
	const key = getInput('key') || undefined;
	if (key) {
		setSecret(key);
	} else {
		warning(`No API key provided via the 'key' input, you're likely to hit rate limits without an API key.
		See https://developers.google.com/speed/docs/insights/v5/get-started#key for how to get an API key.`);
	}
	const runs = parseInt(getInput('runs', { required: true }), 10);
	if (!runs) {
		throw new Error(
			`Invalid 'runs' input. Got '${getInput('runs', {
				required: true,
			})}' but only integers are valid.`,
		);
	}
	const threshold = parseInt(getInput('threshold'), 10) || undefined;
	const compareUrl = getInput('compareUrl') || undefined;

	const strategy = getInput('strategy', { required: true });
	if (strategy !== 'desktop' && strategy !== 'mobile' && strategy !== 'both') {
		throw new Error(`Invalid 'strategy' input. Got '${strategy}' but only 'desktop', 'mobile' or 'both' are valid.`);
	}

	let comment: string | false = getInput('comment', { required: true });
	comment = comment === 'false' ? false : comment;
	if (comment !== 'create' && comment !== 'update' && comment !== false) {
		throw new Error(`Invalid 'comment' input. Got '${comment}' but only 'create', 'update' or 'false' are valid.`);
	}

	const result = {
		url,
		key,
		runs,
		strategy,
		comment,
		threshold,
		compareUrl,
	} as const;
	debug('Got inputs');
	// debug(key);
	debug(JSON.stringify(result));
	return result;
};
