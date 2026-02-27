import api from "./api";

export const inventoryAPI = {
  getInventory: () => api.get("/inventory"),

  getFuelInventory: () => api.get("/inventory/fuel"),

  getProductInventory: () => api.get("/inventory/products"),

    addFuelStock: (data) =>
    api.post("/inventory/fuel-stock", data),

  addProductQuantity: (data) =>
    api.post("/inventory/product-quantity", data)
};

