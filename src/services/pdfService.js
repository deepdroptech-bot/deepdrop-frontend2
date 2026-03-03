import api from "./api";

export const pdfAPI = {
  generateSalesPDF: (id) =>
    api.get(`/pdf/sales/${id}`, { responseType: "blob" }),
};