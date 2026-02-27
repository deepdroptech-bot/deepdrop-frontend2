import API from "./api";

export const dashboardAPI = {
  getOverview: () =>
    API.get("/dashboard/overview"),
};
