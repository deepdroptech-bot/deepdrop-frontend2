import API from "./api";

export const expenseAPI = {

  createDocument: (data) =>
    API.post("/expenses/document", data),

  addExpense: (data) =>
    API.post("/expenses/add", data),

  closeDocument: () =>
    API.post("/expenses/close"),

  getCurrent: () =>
    API.get("/expenses/current"),

  getHistory: () =>
    API.get("/expenses/history"),

  getDocumentExpenses: (id) =>
    API.get(`/expenses/document/${id}`)
};
