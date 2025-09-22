type searchType = "fullTextSearch" | "autoComplete"

type Searchable = {
  key: string;
  value: string;
  searchType: Array<searchType>
}

type SearchableField = { [key: string]: string[] }


enum SearchableType {
  PRE = "pre",
  BI = "bi",
  TRI = "tri"
}

export { SearchableField, Searchable, searchType, SearchableType }
