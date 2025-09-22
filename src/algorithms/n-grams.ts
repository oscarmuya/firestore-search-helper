import { SearchableType } from '../types/search';

/**
 * Generate n-grams (bigrams or trigrams) from the given text.
 *
 * Valid values for `n` are `2` (bigrams) and `3` (trigrams). Passing any other
 * value will throw an Error.
 *
 * The function chooses an optimized implementation for the requested n and
 * returns an object describing the gram type and the generated array.
 *
 * Example:
 *   nGrams(2, "hello")
 *   // -> { type: "bi", grams: ["he","el","ll","lo"] }
 *
 * Edge cases:
 *  - If the input `text` is shorter than `n`, an empty array is returned in
 *    `grams`.
 *
 * Complexity:
 *  - Time: O(m) where m is the length of `text`.
 *  - Space: O(m) for the returned array of grams.
 *
 * @param n - Number of tokens per gram (allowed: 2 or 3).
 * @param text - The source string to produce n-grams from.
 * @returns An object `{ type, arr }` where `type` is "bi" or "tri" and
 *          `arr` is the array of generated n-grams.
 * @throws Error if `n` is not 2 or 3.
 */
function nGrams(n: 2 | 3, text: string): { type: SearchableType.BI | SearchableType.TRI; arr: string[] } {
  if (n !== 2 && n !== 3) {
    throw new Error("Value of n must be either 2 or 3");
  }

  const type = n === 2 ? SearchableType.BI : SearchableType.TRI;
  const arr = type === SearchableType.TRI ? createTrigrams(text) : createBigrams(text);

  return { type, arr };
}


/**
 * Create bigrams (2-character sliding windows) from a string.
 *
 * This implementation is optimized by pre-allocating the output array.
 *
 * Example:
 *   createBigrams("abcd") // -> ["ab", "bc", "cd"]
 *
 * Edge cases:
 *  - If `text.length < 2` an empty array is returned.
 *  - The function operates on JS string code units. Characters outside the BMP
 *    (surrogate pairs) are treated as two code units.
 *
 * Complexity:
 *  - Time: O(m) where m is `text.length`.
 *  - Space: O(m - 1) for the returned array.
 *
 * @param text - Input string to create bigrams from.
 * @returns Array of bigram strings.
 */
function createBigrams(text: string): string[] {
  const length = text.length;
  if (length < 2) return [];

  const bigrams = new Array(length - 1);

  for (let i = 0; i < length - 1; i++) {
    bigrams[i] = text[i] + text[i + 1];
  }

  return bigrams;
}


/**
 * Create trigrams (3-character sliding windows) from a string.
 *
 * This implementation is optimized by pre-allocating the output array.
 *
 * Example:
 *   createTrigrams("abcde") // -> ["abc", "bcd", "cde"]
 *
 * Edge cases:
 *  - If `text.length < 3` an empty array is returned.
 *  - The function operates on JS string code units. Characters outside the BMP
 *    (surrogate pairs) are treated as multiple code units.
 *
 * Complexity:
 *  - Time: O(m) where m is `text.length`.
 *  - Space: O(m - 2) for the returned array.
 *
 * @param text - Input string to create trigrams from.
 * @returns Array of trigram strings.
 */
function createTrigrams(text: string): string[] {
  const length = text.length;
  if (length < 3) return [];

  const trigrams = new Array(length - 2);

  for (let i = 0; i < length - 2; i++) {
    trigrams[i] = text[i] + text[i + 1] + text[i + 2];
  }

  return trigrams;
}




export { nGrams, createBigrams, createTrigrams }
