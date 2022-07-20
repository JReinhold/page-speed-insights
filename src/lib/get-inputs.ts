import { getInput } from '@actions/core';

type Inputs = {
	url: string;
	runs: number;
	strategy: 'desktop' | 'mobile' | 'both';
	comment: 'create' | 'update' | false;
	threshold: number | undefined;
	compareUrl: string | undefined;
};

export const getInputs = (): Inputs => {
	const url = getInput('url', { required: true });
	const runs = parseInt(getInput('runs', { required: true }), 10);
	const threshold = parseInt(getInput('threshold'), 10) || undefined;
	const compareUrl = getInput('compareUrl') || undefined;

	const strategy = getInput('strategy', { required: true });
	if (strategy !== 'desktop' && strategy !== 'mobile' && strategy !== 'both') {
		throw new Error(
			`Invalid 'strategy' input. Got '${strategy}' but only 'desktop', 'mobile' or 'both' are valid.`,
		);
	}

	let comment: string | false = getInput('comment', { required: true });
	comment = comment === 'false' ? false : comment;
	if (comment !== 'create' && comment !== 'update' && comment !== false) {
		throw new Error(
			`Invalid 'comment' input. Got '${comment}' but only 'create', 'update' or 'false' are valid.`,
		);
	}
	return { url, runs, strategy, comment, threshold, compareUrl };
};
