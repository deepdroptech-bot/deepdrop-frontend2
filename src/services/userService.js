import API from "./api";

export const userAPI = {
    deleteUser: (id) =>
        API.delete(`/users/${id}`),
};