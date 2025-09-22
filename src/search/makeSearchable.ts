import { nGrams } from '../algorithms/n-grams';
import { prefix } from '../algorithms/prefix';
import { SearchableField, searchType } from '../types/search';


function makeSearchable(
  key: string,
  value: string,
  searchType: Array<searchType>
) {
  const searchFields: SearchableField = {}

  if (searchType.includes("fullTextSearch")) {
    const res = nGrams(3, value)
    const _key = "fts_" + res.type + "_" + key
    searchFields[_key] = res.arr
  }

  if (searchType.includes("autoComplete")) {
    const res = prefix(value)
    const _key = "ac_" + res.type + "_" + key
    searchFields[_key] = res.arr
  }
  return searchFields
}

export { makeSearchable };
