import { nGrams } from './n-grams';
import { SearchableType } from '../types/search';

describe('nGrams', () => {
  // --- Test cases for n = 2 (Bigrams) ---

  it('should correctly generate bigrams (n=2) for a standard string', () => {
    const result = nGrams(2, 'apple');
    expect(result).toEqual({
      type: SearchableType.BI,
      arr: ['ap', 'pp', 'pl', 'le'],
    });
  });

  it('should return an empty array for bigrams (n=2) when the input string is shorter than n', () => {
    const result = nGrams(2, 'a');
    expect(result).toEqual({
      type: SearchableType.BI,
      arr: [],
    });
  });

  it('should generate a single bigram (n=2) when the input string length is exactly n', () => {
    const result = nGrams(2, 'hi');
    expect(result).toEqual({
      type: SearchableType.BI,
      arr: ['hi'],
    });
  });

  // --- Test cases for n = 3 (Trigrams) ---

  it('should correctly generate trigrams (n=3) for a standard string', () => {
    const result = nGrams(3, 'banana');
    expect(result).toEqual({
      type: SearchableType.TRI,
      arr: ['ban', 'ana', 'nan', 'ana'],
    });
  });

  it('should return an empty array for trigrams (n=3) when the input string is shorter than n', () => {
    const result = nGrams(3, 'be');
    expect(result).toEqual({
      type: SearchableType.TRI,
      arr: [],
    });
  });

  it('should generate a single trigram (n=3) when the input string length is exactly n', () => {
    const result = nGrams(3, 'cat');
    expect(result).toEqual({
      type: SearchableType.TRI,
      arr: ['cat'],
    });
  });

  // --- Common Edge Cases & Error Handling ---

  it('should return an empty array for an empty string input, for both n=2 and n=3', () => {
    expect(nGrams(2, '')).toEqual({ type: SearchableType.BI, arr: [] });
    expect(nGrams(3, '')).toEqual({ type: SearchableType.TRI, arr: [] });
  });

  it('should throw an error if n is not 2 or 3', () => {
    // We must wrap the function call in another function for `toThrow` to catch the error.
    expect(() => nGrams(1 as any, 'test')).toThrow('Value of n must be either 2 or 3');
    expect(() => nGrams(4 as any, 'test')).toThrow('Value of n must be either 2 or 3');
    expect(() => nGrams(0 as any, 'test')).toThrow('Value of n must be either 2 or 3');
  });
});
