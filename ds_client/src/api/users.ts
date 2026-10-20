import api from "./axios";

interface User {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    profile_photo?: string;
}

//For fetching all categories
export const fetchUsers = () =>
  api.get("/accounts/admin/users/");