import { afterEach, describe, expect, it, vi } from 'vitest';
import { getInputs } from './get-inputs';
const inputMocks = {
	url: 'https://reinhold.is/mock',
	runs: 5,
	strategy: 'desktop',
	comment: 'create',
	threshold: 55,
	compareUrl: 'https://reinhold.is/mock-compare',
};
describe('Get Inputs', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should get all inputs', () => {
		// Arrange - mock inputs
		vi.mock('@actions/core', async () => {
			const actionsCore = (await vi.importActual('@actions/core')) as any;
			return {
				...actionsCore,
				getInput: vi.fn((inputName: keyof typeof inputMocks): string => {
					const value = inputMocks[inputName];
					if (!value) {
						throw new Error(
							`Tried to getInput with name ${inputName} but no such mocked input found`,
						);
					}
					return value.toString();
				}),
			};
		});

		// Act - get inputs
		const result = getInputs();

		// Assert - inputs matches mocks
		expect(result).toMatchObject(inputMocks);
	});
});
