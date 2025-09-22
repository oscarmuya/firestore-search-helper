import { SearchableType } from '../types/search';

/**
 * Create a prefix object for the given text.
 *
 * This normalizes the input (lowercases and splits on whitespace),
 * then generates all leading prefixes for each word and returns them
 * in order of appearance.
 *
 * Example:
 *  prefix("Hello World")
 *  // -> { type: "pre", arr: ["h","he","hel","hell","hello","w","wo","wor","worl","world"] }
 *
 * @param text - The input string to generate prefixes from.
 * @returns An object with `type: "pre"` and `arr` set to the array of generated prefixes.
 */
function prefix(text: string): { type: SearchableType.PRE, arr: string[] } {
  return { type: SearchableType.PRE, arr: generatePrefixes(text) }
}


/**
 * Generate all leading prefixes for each word in the input string.
 *
 * The function:
 *  - normalizes the input by lowercasing it,
 *  - splits on any whitespace,
 *  - filters out empty tokens,
 *  - and returns an array containing each word's prefixes in order.
 *
 * For a single word "abc" the returned prefixes are ["a", "ab", "abc"].
 * For multiple words the prefixes are concatenated in the order of the words.
 *
 * Edge cases:
 *  - If `input` is an empty string or only whitespace, an empty array is returned.
 *
 * Performance:
 *  - Time complexity: O(n) where n is the total number of characters across all words.
 *  - Space complexity: O(n) for the returned array.
 *  - The implementation pre-allocates the result array for better performance.
 *
 * @param input - The string to process.
 * @returns An array of prefixes (lowercased).
 */
function generatePrefixes(input: string): string[] {
  // Normalize: lowercase and split into words, filter out empty strings
  const words = input.toLowerCase().split(/\s+/).filter(word => word.length > 0);

  if (words.length === 0) return [];
  let totalPrefixes = 0;
  for (let i = 0; i < words.length; i++) {
    totalPrefixes += words[i].length;
  }

  // Pre-allocate result array for optimal performance
  const prefixes: string[] = new Array(totalPrefixes);
  let prefixIndex = 0;

  // Generate prefixes for each word
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 1; j <= word.length; j++) {
      prefixes[prefixIndex++] = word.slice(0, j);
    }
  }

  return prefixes;
}



export { prefix }
