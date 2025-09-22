import { searchBy } from './searchBy';
import { createTrigrams } from '../algorithms/n-grams';
import { SearchableType } from '../types/search';
import { where } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  where: jest.fn(),
}));

// Mock the n-grams algorithm.
jest.mock('../algorithms/n-grams', () => ({
  createTrigrams: jest.fn(),
}));

// Mock the SearchableType enum to decouple the test from the actual enum file.
jest.mock('../types/search', () => ({
  SearchableType: {
    TRI: 'tri',
    PRE: 'pre',
  },
}));

// Create typed mock functions for better autocompletion and type safety in tests.
const mockedWhere = where as jest.Mock;
const mockedCreateTrigrams = createTrigrams as jest.Mock;

describe('searchBy', () => {
  // Before each test, clear the call history of our mocks.
  // This ensures that one test's execution doesn't interfere with another's assertions.
  beforeEach(() => {
    mockedWhere.mockClear();
    mockedCreateTrigrams.mockClear();
  });

  // --- Test Suite for "fullTextSearch" ---
  describe('when searchType is "fullTextSearch"', () => {
    it('should use "array-contains" for a strict search (default)', () => {
      const key = 'name';
      const value = 'test';
      const expectedTrigrams = ['tes', 'est'];
      mockedCreateTrigrams.mockReturnValue(expectedTrigrams);

      // Call the function without the 'strict' parameter to test the default
      searchBy(key, value, 'fullTextSearch');

      // Verify that createTrigrams was called correctly
      expect(mockedCreateTrigrams).toHaveBeenCalledWith(value);

      // Verify that 'where' was called with the correct parameters for a strict search
      expect(mockedWhere).toHaveBeenCalledWith(
        `fts_${SearchableType.TRI}_${key}`,
        'array-contains',
        expectedTrigrams
      );
    });

    it('should use "array-contains-any" for a non-strict search', () => {
      const key = 'description';
      const value = 'hello';
      const expectedTrigrams = ['hel', 'ell', 'llo'];
      mockedCreateTrigrams.mockReturnValue(expectedTrigrams);

      // Explicitly set strict to false
      searchBy(key, value, 'fullTextSearch', false);

      expect(mockedCreateTrigrams).toHaveBeenCalledWith(value);

      // Verify 'where' was called with the non-strict operator
      expect(mockedWhere).toHaveBeenCalledWith(
        `fts_${SearchableType.TRI}_${key}`,
        'array-contains-any',
        expectedTrigrams
      );
    });

    it('should handle empty string values gracefully', () => {
      mockedCreateTrigrams.mockReturnValue([]);
      searchBy('title', '', 'fullTextSearch');

      expect(mockedCreateTrigrams).toHaveBeenCalledWith('');
      expect(mockedWhere).toHaveBeenCalledWith(
        `fts_${SearchableType.TRI}_title`,
        'array-contains',
        [] // The value should be an empty array
      );
    });
  });

  // --- Test Suite for other search types (e.g., "autoComplete") ---
  describe('when searchType is not "fullTextSearch"', () => {
    it('should use "array-contains" with the raw value for "autoComplete"', () => {
      const key = 'username';
      const value = 'al';

      searchBy(key, value, 'autoComplete');

      // Verify the correct field name and operator are used
      expect(mockedWhere).toHaveBeenCalledWith(
        `ac_${SearchableType.PRE}_${key}`,
        'array-contains',
        value // The raw value should be passed directly
      );

      // Ensure the full-text search algorithm was NOT called
      expect(mockedCreateTrigrams).not.toHaveBeenCalled();
    });

    it('should ignore the "strict" parameter', () => {
      const key = 'email';
      const value = 'test@';

      // Call with strict: false, which should have no effect on this branch
      searchBy(key, value, 'autoComplete', false);

      expect(mockedWhere).toHaveBeenCalledWith(
        `ac_${SearchableType.PRE}_${key}`,
        'array-contains',
        value
      );
      expect(mockedCreateTrigrams).not.toHaveBeenCalled();
    });
  });
});
