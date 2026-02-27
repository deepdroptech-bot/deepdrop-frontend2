import API from "./api";

export const bankAPI = {

  initialize: () =>
    API.post("/bank/initialize"),

  addBalance: (data) =>
    API.post("/bank/add", data),

  getBankBalance: () =>
    API.get("/bank"),
};
