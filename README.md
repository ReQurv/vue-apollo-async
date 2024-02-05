
# Async Vue Apollo functions

The project create the async version of useQuery and useMutation on a vue based projects with Vue Apollo server.




## Authors

- [@ReQurv](https://github.com/ReQurv)
## Installation

Install with **yarn**:

```bash
  yarn add @requrv/vue-apollo-async
```

Install with **npm**:

```bash
  npm install @requrv/vue-apollo-async
```
## Usage/Examples

```typescript
import ReQurvApollo from '@requrv/vue-apollo-async'

const requrvApollo = new ReQurvApollo()

// Mutation
const { apolloMutation } = requrvApollo.useAsyncMutation({
    document: MutationDocument,
    options: {
        variables: {
            ...any variables
        }
    }
})
const { data } = await apolloMutation() // data is the mutation result

// Query
const { apolloQuery } = requrvApollo.useAsyncQuery({
    document: QueryDocument,
    variables: {
        ...any variables
    }
})
const { data } = await apolloQuery() // data is the query result
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

