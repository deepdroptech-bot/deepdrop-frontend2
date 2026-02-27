import axios from "./api";

export const staffAPI = {
  getAll: () => axios.get("/staff"),

  getById: (id) => axios.get(`/staff/${id}`),

  create: (formData) => {
  return axios.post("/staff", formData);
},

  update: (id, formData) => {
  return axios.put(`/staff/${id}`, formData);
},  

  addBonus: (id, data) =>
    axios.patch(`/staff/${id}/bonus`, data),

  addDeduction: (id, data) =>
    axios.patch(`/staff/${id}/deduction`, data),

  paySalary: (id) =>
    axios.patch(`/staff/${id}/pay`),

  deactivate: (id) =>
    axios.patch(`/staff/${id}/deactivate`),

  activate: (id) =>
    axios.patch(`/staff/${id}/activate`),

  delete: (id) =>
    axios.delete(`/staff/${id}`)
};