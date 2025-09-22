import { prefix } from './prefix';
import { SearchableType } from '../types/search';

describe('prefix', () => {
  it('should create a prefix object from a standard string with multiple words', () => {
    const result = prefix('Hello World');
    expect(result).toEqual({
      type: SearchableType.PRE,
      arr: [
        'h', 'he', 'hel', 'hell', 'hello',
        'w', 'wo', 'wor', 'worl', 'world',
      ],
    });
  });

  it('should return an object with an empty array for an empty input string', () => {
    const result = prefix('');
    expect(result).toEqual({
      type: SearchableType.PRE,
      arr: [],
    });
  });

  it('should return an object with an empty array for a string containing only whitespace', () => {
    const result = prefix('  \n\t  ');
    expect(result).toEqual({
      type: SearchableType.PRE,
      arr: [],
    });
  });

  it('should normalize the input string to lowercase', () => {
    const result = prefix('UPPERCASE');
    expect(result).toEqual({
      type: SearchableType.PRE,
      arr: ['u', 'up', 'upp', 'uppe', 'upper', 'upperc', 'upperca', 'uppercas', 'uppercase'],
    });
  });

  it('should handle mixed casing across multiple words', () => {
    const result = prefix('FirstNaMe LaStNaMe');
    expect(result).toEqual({
      type: SearchableType.PRE,
      arr: [
        'f', 'fi', 'fir', 'firs', 'first', 'firstn', 'firstna', 'firstnam', 'firstname',
        'l', 'la', 'las', 'last', 'lastn', 'lastna', 'lastnam', 'lastname',
      ],
    });
  });

  it('should handle multiple spaces and different whitespace characters between words', () => {
    const result = prefix('multiple \t spaces \n here');
    expect(result).toEqual({
      type: SearchableType.PRE,
      arr: [
        'm', 'mu', 'mul', 'mult', 'multi', 'multip', 'multipl', 'multiple',
        's', 'sp', 'spa', 'spac', 'space', 'spaces',
        'h', 'he', 'her', 'here',
      ],
    });
  });

  it('should correctly trim leading and trailing whitespace from the input', () => {
    const result = prefix('  padded text  ');
    expect(result).toEqual({
      type: SearchableType.PRE,
      arr: [
        'p', 'pa', 'pad', 'padd', 'padde', 'padded',
        't', 'te', 'tex', 'text',
      ],
    });
  });

  it('should correctly generate prefixes for a single word', () => {
    const result = prefix('typescript');
    expect(result).toEqual({
      type: SearchableType.PRE,
      arr: ['t', 'ty', 'typ', 'type', 'types', 'typesc', 'typescr', 'typescri', 'typescrip', 'typescript'],
    });
  });
});
