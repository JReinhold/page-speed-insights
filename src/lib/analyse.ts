import { debug, error } from '@actions/core';
import { HttpClient, HttpClientError, HttpCodes } from '@actions/http-client';
import type { Inputs } from '../../declarations';
import { apiResponse, parsedApiResponseToAnalysisResult, AnalysisResult, ApiResponse } from './types';
import { maskedDebug } from './utils';

const httpClient = new HttpClient();

const STRATEGY_PARAMETER_MAP: Record<Inputs['strategy'], string> = {
	both: 'BOTH',
	desktop: 'DESKTOP',
	mobile: 'MOBILE',
};

export const analyse = async (inputs: Inputs) => {
	if (inputs.runs === 1) {
		debug('Analysing a single run');
		return analyseSingleRun(inputs);
	} else {
		throw new Error('multiple runs not supported yet');
	}
};

const analyseSingleRun = async (inputs: Inputs): Promise<AnalysisResult> => {
	const url = new URL('https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed');
	url.searchParams.set('url', inputs.url);
	url.searchParams.set('strategy', STRATEGY_PARAMETER_MAP[inputs.strategy]);
	if (inputs.key) {
		url.searchParams.set('key', inputs.key);
	}

	maskedDebug(`Calling PageSpeed Insights API with: ${url.href}`);
	const preTime = Date.now();
	let response;
	try {
		response = await httpClient.getJson<ApiResponse>(url.href);
	} catch (err) {
		error('Error occurred while calling the PageSpeed Insights API:');
		if (err instanceof HttpClientError) {
			if (err.statusCode === HttpCodes.TooManyRequests) {
				error(
					`Quota limit exceeded. Either you're not using an API key, or you've made too many calls with this API key. Try again later.
${err.message}`,
				);
			}
		} else if (err instanceof Error) {
			error(`Unknown error:
${err.message}`);
		} else {
			error(`Unknown error:
${err as any}`);
		}
		throw err;
	}
	const postTime = Date.now();
	debug(`Response from PageSpeed Insights API after ${(postTime - preTime) / 1000} seconds`);
	debug(`Status: ${response.statusCode}`);
	const parseResult = apiResponse.safeParse(response.result);
	if (!parseResult.success) {
		error(`Error parsing the response, it's structure was unexpected. This probably means the PageSpeed Insights API have changed,
are you using the latest version of the action?
Parse error: ${JSON.stringify(parseResult.error.format())}`);
		throw parseResult.error;
	}

	const analysisResult = parsedApiResponseToAnalysisResult(parseResult.data);
	debug('Analysis Result:');
	debug(JSON.stringify(analysisResult));

	return analysisResult;
};
