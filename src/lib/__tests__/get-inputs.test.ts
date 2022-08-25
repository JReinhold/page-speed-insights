import { afterEach, describe, expect, it, vi } from 'vitest';
import { getInputs } from '../get-inputs';
import { getInput } from '@actions/core';

vi.mock('@actions/core', async () => {
	const actionsCore = (await vi.importActual('@actions/core')) as any;
	return {
		...actionsCore,
		getInput: vi.fn(),
	};
});

const getInputMock = vi.mocked(getInput);

const baseValidInputs: Record<string, string | number> = {
	url: 'https://reinhold.is/mock',
	key: 'someApiKey',
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
		getInputMock.mockImplementation((inputName) => baseValidInputs[inputName]!.toString());

		// Act - get inputs
		const result = getInputs();

		// Assert - inputs matches mocks
		expect(result).toMatchObject(baseValidInputs);
	});

	it('should throw when runs is invalid', () => {
		// Arrange - mock inputs
		const inputMocks: Record<string, string | number> = {
			...baseValidInputs,
			runs: 'not valid',
		};
		getInputMock.mockImplementation((inputName) => inputMocks[inputName]!.toString());

		// Act & Assert - get inputs should throw
		expect(() => getInputs()).toThrowError(
			new Error("Invalid 'runs' input. Got 'not valid' but only integers are valid."),
		);
	});

	it('should throw when strategy is invalid', () => {
		// Arrange - mock inputs
		const inputMocks: Record<string, string | number> = {
			...baseValidInputs,
			strategy: 'command and conquer',
		};
		getInputMock.mockImplementation((inputName) => inputMocks[inputName]!.toString());

		// Act & Assert - get inputs should throw
		expect(() => getInputs()).toThrowError(
			new Error(
				"Invalid 'strategy' input. Got 'command and conquer' but only 'desktop', 'mobile' or 'both' are valid.",
			),
		);
	});

	it('should throw when comment is invalid', () => {
		// Arrange - mock inputs
		const inputMocks: Record<string, string | number> = {
			...baseValidInputs,
			comment: 'not valid',
		};
		getInputMock.mockImplementation((inputName) => inputMocks[inputName]!.toString());

		// Act & Assert - get inputs should throw
		expect(() => getInputs()).toThrowError(
			new Error("Invalid 'comment' input. Got 'not valid' but only 'create', 'update' or 'false' are valid."),
		);
	});
});
