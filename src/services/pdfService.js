import api from "./api";

export const pdfAPI = {
  generateSalesPDF: (id, data) => api.post(`/pdf/sales/${id}`, data, { responseType: "blob" }),
};