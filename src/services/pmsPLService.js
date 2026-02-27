import API from "./api";

export const pmsPLAPI = {
  create: (data) =>
    API.post("/pms-pl", data),

  submit: (id) =>
    API.post(`/pms-pl/${id}/submit`),

  approve: (id) =>
    API.post(`/pms-pl/${id}/approve`),

  getAll: () =>
    API.get("/pms-pl"),

  getById: (id) =>
    API.get(`/pms-pl/${id}`),
};
