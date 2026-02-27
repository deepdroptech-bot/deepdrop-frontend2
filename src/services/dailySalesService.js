import api from "./api";

export const dailySalesAPI = {
  create: (data) => api.post("/daily-sales", data),

  update: (id, data) =>
    api.put(`/daily-sales/${id}`, data),

  submit: (id) =>
    api.post(`/daily-sales/${id}/submit`),

  approve: (id) =>
    api.post(`/daily-sales/${id}/approve`),

  getAll: (params) =>
    api.get("/daily-sales/all", { params }),

  getSubmitted: () =>
    api.get("/daily-sales/submitted"),

  getByDate: (date) =>
    api.get(`/daily-sales?date=${date}`),

  getById: (id) =>
    api.get(`/daily-sales/${id}`),

  getSummary: (startDate, endDate) =>
    api.get(
      `/daily-sales/summary/date?startDate=${startDate}&endDate=${endDate}`
    ),

  delete: (id, reason) =>
    api.delete(`/daily-sales/${id}`, {
      data: { deleteReason: reason }
    })
};
