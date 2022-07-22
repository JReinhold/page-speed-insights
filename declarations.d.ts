export type Inputs = {
	url: string;
	key: string | undefined;
	runs: number;
	strategy: 'desktop' | 'mobile' | 'both';
	comment: 'create' | 'update' | false;
	threshold: number | undefined;
	compareUrl: string | undefined;
};
