import API from "./api";

export const profitAuditAPI = {

  getDailyReport: (date) =>
    API.get(`/profit-audit/daily-profit-report/${date}`),

  getSummary: (from, to) =>
    API.get(`/profit-audit/profit-summary?from=${from}&to=${to}`),

  getAuditTrail: (date) =>
    API.get(`/profit-audit/audit-trail/${date}`),
};
