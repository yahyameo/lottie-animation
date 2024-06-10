import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import createUploadLink  from 'apollo-upload-client/createUploadLink.mjs';
export const API_URL = "http://54.254.251.119:7070";

const uploadLink = createUploadLink({
  uri: API_URL+'/graphql', // Replace with your GraphQL endpoint URL
});

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});

export default client;
