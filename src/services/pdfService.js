import api from "./api";

export const pdfAPI = {

  generateSalesPDF: (id) =>
    api.get(`/pdf/sales/${id}`, { responseType: "blob" }),

  generateStaffPDF: (id) =>
    api.get(`/pdf/staff/${id}`, { responseType: "blob" }),

  generateStaffSalaryPDF: () =>
    api.get(`/pdf/staff-salary`, { responseType: "blob" }),
  
  generateExpensePDF: () =>
    api.get(`/pdf/expenses`, { responseType: "blob" }),

  generateCalibrationPDF: (from, to) =>
    api.get(`/pdf/calibration?from=${from}&to=${to}`, { responseType: "blob" }),

  generateProfitSummaryPDF: (from, to) =>
    api.get(`/pdf/profit-summary?from=${from}&to=${to}`, { responseType: "blob" }),

};