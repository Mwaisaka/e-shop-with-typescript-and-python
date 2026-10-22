import api from "./axios";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined?: string;
}

export interface UserPayload {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  is_staff: boolean;
}

//For fetching all users
export const fetchUsers = () => 
    api.get<User[]>("/accounts/admin/users/");

//Create a user
export const createUser = (data:UserPayload) =>
    api.post("/accounts/admin/users/", data);

//Update a user
export const updateUser = (userId : number, data : Partial<UserPayload>) =>
    api.patch(`/accounts/admin/users/${userId}/`, data);

//Delete a user
export const deleteUser = (userId : number) =>
    api.delete(`/accounts/admin/users/${userId}/`);

