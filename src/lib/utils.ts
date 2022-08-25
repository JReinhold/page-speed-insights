import { debug, getInput } from '@actions/core';

export const maskedApiKey = (s: string): string => {
	const key = getInput('key');
	return key ? s.replaceAll(key, `***${key?.slice(-3)}`) : s;
};

export const maskedDebug = (message: string) => debug(maskedApiKey(message));
