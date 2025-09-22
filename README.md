[![npm](https://img.shields.io/npm/v/firestore-search-helper.svg)](https://www.npmjs.com/package/firestore-search-helper) ![downloads](https://img.shields.io/npm/dt/firestore-search-helper.svg)


# firestore-search-helper

A lightweight and simple full text search for firestore.

## Installation

You can install the package using npm or yarn:

```bash
npm install firestore-search-helper
```

```bash
yarn add firestore-search-helper
```

## Getting Started

The core workflow:
1.  **Make a field searchable**: Make a string field "searchable" using the `makeSearchable` utility.
2.  **Query by a searchable field**: Use the `searchBy` function to perform a fuzzy search on the field.

Here is a quick example:

```typescript
import { makeSearchable } from 'firestore-search-helper';

addDoc(db, "users",
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    ...makeSearchable('name','John Doe',['autoComplete'])
  }
)
```


```typescript
import { searchBy } from 'firestore-search-helper';

const results = searchBy('name', 'Joh', 'autoComplete');
```

####  `makeSearchable` Props

| Prop name                | Description                                            | Default value      | Example values                           |
| ------------------------ | ------------------------------------------------------ | ------------------ | ---------------------------------------- |
| key                      | `string` : The field name.                             | n/a                | name                                     |
| value                    | `string` : value of the field.                         | n/a                | John Doe                                 |
| searchType               | `Array<searchType>` : The search types for the field   | n/a                | `['autoComplete', 'fullTextSearch']`     |

####  `searchBy` Props

| Prop name                | Description                                            | Default value      | Example values                           |
| ------------------------ | ------------------------------------------------------ | ------------------ | ---------------------------------------- |
| key                      | `string` : The field name.                             | n/a                | name                                     |
| value                    | `string` : value of the field.                         | n/a                | John Doe                                 |
| searchType               | `searchType` : The search types for the field          | n/a                | `'autoComplete' or 'fullTextSearch'`     |

## How it works

The `makeSearchable` function generates n-grams (substrings of a given length) for the specified fields and stores them in a `searchable` property on each object. When `searchBy` is called, it generates n-grams for the search query and finds the objects that have the most matching n-grams. This approach allows for efficient and typo-tolerant searching.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the [MIT](LICENSE) License.
