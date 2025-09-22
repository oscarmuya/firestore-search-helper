import { createTrigrams } from '../algorithms/n-grams';
import { SearchableType, searchType } from '../types/search';
import { where } from "firebase/firestore"
import { QueryConstraint } from 'firebase/firestore'


/**
 * Build a Firestore query constraint for searching a given field.
 *
 * Behavior
 * - fullTextSearch:
 *   - Field name: `fts_<SearchableType.TRI>_<key>` (e.g. `fts_tri_name`)
 *   - Uses `createTrigrams(value)` to generate token(s) for matching.
 *   - When `strict` is `true` uses Firestore `"array-contains"` (single-token match),
 *     otherwise `"array-contains-any"` (matches any of the generated tokens).
 *
 * - Non-fullTextSearch (autocomplete/prefix):
 *   - Field name: `ac_<SearchableType.PRE>_<key>` (e.g. `ac_pre_name`)
 *   - Uses `"array-contains"` with the raw `value`.
 *
 * Note: this function returns a Firestore QueryConstraint (from the modular SDK)
 * which can be passed into `query(...)`.
 *
 * @param {string} key - The indexed field key suffix (for building the index field name).
 * @param {string} value - The user-provided search term.
 * @param {searchType} searchType - The search mode (see `./types`).
 * @param {boolean} [strict=true] - For fullTextSearch: `true` -> `array-contains` (single-token),
 *                                  `false` -> `array-contains-any` (match any token).
 *                                  Ignored for non-fullText searches.
 * @returns {QueryConstraint} A Firestore query constraint to use with `query(...)`.
 *
 * @example
 * // Full-text trigram search — match any trigram (non-strict)
 * const q1 = searchBy('name', 'alice', 'fullTextSearch', false);
 *
 * @example
 * // Autocomplete / prefix search
 * const q2 = searchBy('username', 'al', 'autocomplete');
 */
function searchBy(
  key: string,
  value: string,
  searchType: searchType,
  strict = true
): QueryConstraint {
  if (searchType === "fullTextSearch") {
    const _type = "fts_" + SearchableType.TRI + "_" + key
    const matches = createTrigrams(value)
    const matchBy = strict ? "array-contains" : "array-contains-any"
    return where(_type, matchBy, matches)
  } else {
    const _type = "ac_" + SearchableType.PRE + "_" + key
    return where(_type, "array-contains", value)
  }
}

export { searchBy }

