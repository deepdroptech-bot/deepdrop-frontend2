import api from "./api";

export const retainedEarningsAPI = {
    get: () =>
        api.get("/retained-earnings"),
    update: (data) =>
        api.put("/retained-earnings", data)
};