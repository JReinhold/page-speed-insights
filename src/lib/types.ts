import { z } from 'zod';

const dateString = z.preprocess((dateString) => typeof dateString === 'string' && new Date(dateString), z.date());

const baseAudit = z.object({
	title: z.string(),
	description: z.string(),
	score: z.number().nullable(),
	displayValue: z.string().optional(),
	numericValue: z.number().optional(),
	scoreDisplayMode: z.string(),
	numericUnit: z.string().optional(),
});

const audit = baseAudit.extend({
	title: z.string(),
	description: z.string(),
	score: z.number(),
	scoreDisplayMode: z.string(),
	displayValue: z.string(),
	numericValue: z.number(),
	numericUnit: z.string(),
});

export const apiResponse = z.object({
	lighthouseResult: z.object({
		audits: z.object({
			'first-contentful-paint': audit, // First Contentful Paint
			interactive: audit, // Time to Interactive
			'speed-index': audit, // Speed Index
			'total-blocking-time': audit, // Total Blocking Time
			'largest-contentful-paint': audit, // Largest Contentful Paint
			'cumulative-layout-shift': audit, // Cumulative Layout Shift
			'screenshot-thumbnails': baseAudit.extend({
				score: z.null(),
				displayValue: z.undefined(),
				numericValue: z.undefined(),
				details: z.object({
					scale: z.number(),
					items: z.array(
						z.object({
							timing: z.number(),
							timestamp: z.number(),
							data: z.string(),
						}),
					),
				}),
			}),
			'full-page-screenshot': baseAudit.extend({
				details: z.object({
					screenshot: z.object({
						data: z.string(),
						width: z.number(),
						height: z.number(),
					}),
				}),
			}),
		}),
		categories: z.object({ performance: z.object({ score: z.number() }) }),
		timing: z.object({ total: z.number() }),
	}),
});

export type ApiResponse = z.input<typeof apiResponse>;
export type ParsedApiResponse = z.output<typeof apiResponse>;

export type AnalysisResult = {
	score: number;
	metrics: {
		firstContentfulPaint: number;
		timeToInteractive: number;
		speedIndex: number;
		totalBlockingTime: number;
		largestContentfulPaint: number;
		cumulativeLayoutShift: number;
	};
	screenshots: Array<{
		timing: number;
		data: string;
	}>;
	timing: number;
};

export const parsedApiResponseToAnalysisResult = (parsedResponse: z.output<typeof apiResponse>): AnalysisResult => ({
	score: parsedResponse.lighthouseResult.categories.performance.score,
	metrics: {
		firstContentfulPaint: Math.round(parsedResponse.lighthouseResult.audits['first-contentful-paint'].numericValue),
		timeToInteractive: Math.round(parsedResponse.lighthouseResult.audits.interactive.numericValue),
		speedIndex: Math.round(parsedResponse.lighthouseResult.audits['speed-index'].numericValue),
		totalBlockingTime: Math.round(parsedResponse.lighthouseResult.audits['total-blocking-time'].numericValue),
		largestContentfulPaint: Math.round(parsedResponse.lighthouseResult.audits['largest-contentful-paint'].numericValue),
		cumulativeLayoutShift: Math.round(parsedResponse.lighthouseResult.audits['cumulative-layout-shift'].numericValue),
	},
	screenshots: parsedResponse.lighthouseResult.audits['screenshot-thumbnails'].details.items.map(
		({ timing, data }) => ({ timing, data }),
	),
	timing: parsedResponse.lighthouseResult.timing.total,
});
