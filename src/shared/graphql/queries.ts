import { gql } from '@apollo/client';

export const GET_PROPERTIES = gql`
  query GetProperties {
    properties {
      id
      image
      title
      type
      location
      details
      host
      price
      rating
    }
  }
`;

export const GET_PROPERTY = gql`
  query GetProperty($id: Int!) {
    property(id: $id) {
      id
      image
      title
      type
      location
      details
      host
      price
      rating
    }
  }
`;

export const ADD_PROPERTY = gql`
  mutation AddProperty($input: PropertyInput!) {
    addProperty(input: $input) {
      id
      image
      title
      type
      location
      details
      host
      price
      rating
    }
  }
`;