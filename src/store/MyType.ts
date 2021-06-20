export const SET_USER = "SET_USER";
export const SET_TOKEN = "SET_TOKEN";
export const REMOVE = "REMOVE";
export const GET_TOKEN = "GET_TOKEN";
export const GET_USER = "GET_USER";

export interface User {
  id: number;
  name: string;
  type: number;
}
