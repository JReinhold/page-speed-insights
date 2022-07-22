import { debug } from '@actions/core';
import { HttpClient } from '@actions/http-client';
import type { Inputs } from '../../declarations';

const httpClient = new HttpClient();

const STRATEGY_PARAMETER_MAP: Record<Inputs['strategy'], string> = {
	both: 'STRATEGY_UNSPECIFIED',
	desktop: 'DESKTOP',
	mobile: 'MOBILE',
};

export const analyse = async (inputs: Inputs) => {
	if (inputs.runs === 1) {
		debug('Analysing a single run');
		return analyseSingleRun(inputs);
	}
};

const analyseSingleRun = async (inputs: Inputs) => {
	const url = new URL('https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed');
	url.searchParams.set('url', inputs.url);
	url.searchParams.set('strategy', STRATEGY_PARAMETER_MAP[inputs.strategy]);
	if (inputs.key) {
		url.searchParams.set('api', inputs.key);
	}

	debug(`Calling PageSpeed Insights API with: ${url.href}`);
	const preTime = Date.now();
	const response = await httpClient.getJson(url.href);
	const postTime = Date.now();
	debug(`Response from PageSpeed Insights API after ${(postTime - preTime) / 1000} seconds`);
	debug(`Status: ${response.statusCode}`);

	console.log(response);
};
