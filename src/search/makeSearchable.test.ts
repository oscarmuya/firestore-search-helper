import { makeSearchable } from './makeSearchable';
import { nGrams } from '../algorithms/n-grams';
import { prefix } from '../algorithms/prefix';
import { SearchableField } from '../types/search';

jest.mock('../algorithms/n-grams');
jest.mock('../algorithms/prefix');

// Create typed mock functions for easier use and type-safety
const mockedNGrams = nGrams as jest.Mock;
const mockedPrefix = prefix as jest.Mock;

describe('makeSearchable', () => {
  // Before each test, reset the mocks to ensure tests are isolated.
  // This clears call counts and mock implementations from previous tests.
  beforeEach(() => {
    mockedNGrams.mockClear();
    mockedPrefix.mockClear();
  });

  it('should only generate autoComplete fields when "autoComplete" is specified', () => {
    const key = 'productName';
    const value = 'laptop';
    const expectedPrefixes = ['l', 'la', 'lap', 'lapt', 'lapto', 'laptop'];

    // Configure our mock to return a predictable value when called
    mockedPrefix.mockReturnValue({ type: 'pre', arr: expectedPrefixes });

    const result = makeSearchable(key, value, ['autoComplete']);

    // Define the expected output object
    const expected: SearchableField = {
      'ac_pre_productName': expectedPrefixes,
    };

    expect(result).toEqual(expected);

    // Verify that only the prefix function was called, and with the correct value
    expect(mockedPrefix).toHaveBeenCalledTimes(1);
    expect(mockedPrefix).toHaveBeenCalledWith(value);
    expect(mockedNGrams).not.toHaveBeenCalled();
  });

  it('should only generate fullTextSearch fields when "fullTextSearch" is specified', () => {
    const key = 'description';
    const value = 'a great product';
    const expectedTrigrams = ['a g', ' gr', 'gre', 'rea', 'eat', /* ... */];

    // Configure our mock to return a predictable value
    mockedNGrams.mockReturnValue({ type: 'tri', arr: expectedTrigrams });

    const result = makeSearchable(key, value, ['fullTextSearch']);

    const expected: SearchableField = {
      'fts_tri_description': expectedTrigrams,
    };

    expect(result).toEqual(expected);

    // Verify that only the nGrams function was called, and with the correct parameters
    expect(mockedNGrams).toHaveBeenCalledTimes(1);
    expect(mockedNGrams).toHaveBeenCalledWith(3, value);
    expect(mockedPrefix).not.toHaveBeenCalled();
  });

  it('should generate both field types when both search types are specified', () => {
    const key = 'title';
    const value = 'test';
    const expectedPrefixes = ['t', 'te', 'tes', 'test'];
    const expectedTrigrams = ['tes', 'est'];

    // Configure both mocks
    mockedPrefix.mockReturnValue({ type: 'pre', arr: expectedPrefixes });
    mockedNGrams.mockReturnValue({ type: 'tri', arr: expectedTrigrams });

    const result = makeSearchable(key, value, ['autoComplete', 'fullTextSearch']);

    const expected: SearchableField = {
      'ac_pre_title': expectedPrefixes,
      'fts_tri_title': expectedTrigrams,
    };

    expect(result).toEqual(expected);

    // Verify both functions were called correctly
    expect(mockedPrefix).toHaveBeenCalledWith(value);
    expect(mockedNGrams).toHaveBeenCalledWith(3, value);
  });

  it('should return an empty object if the searchType array is empty', () => {
    const result = makeSearchable('anyKey', 'anyValue', []);
    expect(result).toEqual({});
    // Verify that no processing functions were called
    expect(mockedPrefix).not.toHaveBeenCalled();
    expect(mockedNGrams).not.toHaveBeenCalled();
  });

  it('should return an empty object if the searchType array does not contain valid types', () => {
    const result = makeSearchable('anyKey', 'anyValue', ['someOtherType' as any]);
    expect(result).toEqual({});
    expect(mockedPrefix).not.toHaveBeenCalled();
    expect(mockedNGrams).not.toHaveBeenCalled();
  });

  it('should correctly handle an empty string value', () => {
    const key = 'username';
    const value = '';

    // An empty string will result in empty arrays from the algorithms
    mockedPrefix.mockReturnValue({ type: 'pre', arr: [] });
    mockedNGrams.mockReturnValue({ type: 'tri', arr: [] });

    const result = makeSearchable(key, value, ['autoComplete', 'fullTextSearch']);

    const expected: SearchableField = {
      'ac_pre_username': [],
      'fts_tri_username': [],
    };

    expect(result).toEqual(expected);
  });
});
