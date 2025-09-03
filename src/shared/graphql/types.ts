export interface PropertyInput {
  image: string;
  title: string;
  type: string;
  location: string;
  details: string;
  host: string;
  price: number;
  rating: number;
}

export interface GetPropertyVariables {
  id: number;
}

export interface AddPropertyVariables {
  input: PropertyInput;
}