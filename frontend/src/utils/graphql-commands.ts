import { gql } from '@apollo/client';


export const UPLOAD_ANIMATION = gql`
mutation UploadAnimation($file: Upload!, $name: String!, $description: String!) {
  uploadAnimation(file: $file, name: $name, description: $description) {
    id
    name
    description
    path,
    fileName
  }
}
`;


export const GET_ANIMATIONS = gql`
  query {
    getAllAnimations {
      id
      name
      fileName
      path
    }
  }
`;


export const SEARCH_ANIMATIONS = gql`
  query SearchAnimations($query: String!) {
    searchAnimations(query: $query) {
      id
      name
      fileName
      path
      createdAt
      updatedAt
    }
  }
`;