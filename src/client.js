import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const cache = new InMemoryCache({
  addTypename: false,
  dataIdFromObject: (obj) => obj.id
})

const link = new HttpLink({
  uri: 'https://graphql.datocms.com',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + import.meta.env.VITE_APP_DATO_API_TOKEN
  }
})

const client = new ApolloClient({
  cache,
  link
})

export default client
