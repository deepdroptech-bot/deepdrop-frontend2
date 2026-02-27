import { useEffect, useState } from "react";
import { inventoryAPI } from "../../../services/inventoryService";
import Permissions from "../../../components/Permission ";

export default function InventoryManagement() {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  const PMS_THRESHOLD = 5000;   // total PMS litres warning level
const WELL_THRESHOLD = 2000;  // per well warning
const AGO_THRESHOLD = 3000;   // AGO warning

const PRODUCT_THRESHOLD = 10; // low stock warning level
const PRODUCT_MAX_CAPACITY = 100; // assumed max per slot (adjust if needed)



  const [fuelForm, setFuelForm] = useState({
    fuelType: "PMS",
    wellNumber: 1,
    quantity: ""
  });

  const [productForm, setProductForm] = useState({
    slotNumber: "",
    itemName: "",
    quantity: ""
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await inventoryAPI.getInventory();
      setInventory(res.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load inventory");
    }
  };

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    await inventoryAPI.addFuelStock(fuelForm);
    fetchInventory();
    setFuelForm({ fuelType: "PMS", wellNumber: 1, quantity: "" });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    await inventoryAPI.addProductQuantity(productForm);
    fetchInventory();
    setProductForm({ slotNumber: "", itemName: "", quantity: "" });
  };

  if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Inventory Data
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we prepare the inventory management dashboard
        </p>
      </div>
    </div>
  );

  const formatNumber = (num) =>
  Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const lowStockProducts = inventory.products.slots.filter(
  (slot) =>
    slot.itemName &&
    slot.quantity > 0 &&
    slot.quantity <= PRODUCT_THRESHOLD
);


  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-extrabold">Inventory Management</h1>
        <p className="text-gray-300 mt-2">
          Manage fuel wells, product slots & bank balances
        </p>
      </div>

      {/* ================= ALERT BANNER ================= */}
{inventory.fuel.PMS.totalQuantity < PMS_THRESHOLD && (
  <div className="bg-red-600 text-white p-4 rounded-2xl shadow-lg flex justify-between items-center animate-pulse">
    <div>
      <h2 className="font-bold text-lg">
        🚨 PMS Stock is Critically Low
      </h2>
      <p className="text-sm">
        Immediate restocking is required.
      </p>
    </div>
  </div>
)}

{/* ================= PRODUCT LOW STOCK ALERT ================= */}
{lowStockProducts.length > 0 && (
  <div className="bg-orange-500 text-white p-4 rounded-2xl shadow-lg flex justify-between items-center">
    <div>
      <h2 className="font-bold text-lg">
        📦 {lowStockProducts.length} Product(s) Running Low
      </h2>
      <p className="text-sm">
        Consider restocking soon.
      </p>
    </div>
  </div>
)}


      {/* ================= OVERVIEW CARDS ================= */}
<div className="grid md:grid-cols-3 gap-6">

  {/* PMS TOTAL */}
  <div className={`p-6 rounded-2xl shadow-lg transition ${
    inventory.fuel.PMS.totalQuantity < PMS_THRESHOLD
      ? "bg-red-50 border border-red-300"
      : "bg-blue-50"
  }`}>
    <h3 className="font-semibold text-gray-700">Total PMS</h3>
    <p className="text-2xl font-bold">
      {formatNumber(inventory.fuel.PMS.totalQuantity)} L
    </p>

    {inventory.fuel.PMS.totalQuantity < PMS_THRESHOLD && (
      <p className="text-red-600 text-sm mt-2 font-semibold">
        ⚠ Low PMS Stock
      </p>
    )}
  </div>

  {/* AGO TOTAL */}
  <div className={`p-6 rounded-2xl shadow-lg ${
    inventory.fuel.AGO.quantityLitres < AGO_THRESHOLD
      ? "bg-red-50 border border-red-300"
      : "bg-green-50"
  }`}>
    <h3 className="font-semibold text-gray-700">Total AGO</h3>
    <p className="text-2xl font-bold">
      {formatNumber(inventory.fuel.AGO.quantityLitres)} L
    </p>

    {inventory.fuel.AGO.quantityLitres < AGO_THRESHOLD && (
      <p className="text-red-600 text-sm mt-2 font-semibold">
        ⚠ Low AGO Stock
      </p>
    )}
  </div>

  {/* PRODUCTS TOTAL */}
  <div className={`p-6 rounded-2xl shadow-lg ${
    inventory.products.slots.reduce((sum, slot) => sum + slot.quantity, 0) < PRODUCT_THRESHOLD * inventory.products.slots.length
      ? "bg-red-50 border border-red-300"
      : "bg-green-50"
  }`}>
    <h3 className="font-semibold text-gray-700">Total Products</h3>
    <p className="text-2xl font-bold">
      {formatNumber(inventory.products.slots.reduce((sum, slot) => sum + slot.quantity, 0))} Units
    </p>

    {inventory.products.slots.reduce((sum, slot) => sum + slot.quantity, 0) < PRODUCT_THRESHOLD * inventory.products.slots.length && (
      <p className="text-red-600 text-sm mt-2 font-semibold">
        ⚠ Low Product Stock
      </p>
    )}
  </div>
</div>


      {/* ================= ADD FUEL STOCK ================= */}
      <Permissions permission="AD_AC">
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Add Fuel Stock
        </h2>

        <form
          onSubmit={handleFuelSubmit}
          className="grid md:grid-cols-4 gap-4"
        >
          <select
            className="border rounded-xl p-3"
            value={fuelForm.fuelType}
            onChange={(e) =>
              setFuelForm({ ...fuelForm, fuelType: e.target.value })
            }
          >
            <option value="PMS">PMS</option>
            <option value="AGO">AGO</option>
          </select>

          {fuelForm.fuelType === "PMS" && (
            <select
              className="border rounded-xl p-3"
              value={fuelForm.wellNumber}
              onChange={(e) =>
                setFuelForm({ ...fuelForm, wellNumber: e.target.value })
              }
            >
              {inventory.fuel.PMS.wells.map((well) => (
                <option key={well.wellNumber} value={well.wellNumber}>
                  Well {well.wellNumber}
                </option>
              ))}
            </select>
          )}

          <input
            type="number"
            placeholder="Quantity (Litres)"
            className="border rounded-xl p-3"
            value={fuelForm.quantity}
            onChange={(e) =>
              setFuelForm({ ...fuelForm, quantity: e.target.value })
            }
          />

          <button className="bg-blue-600 text-white rounded-xl p-3 font-semibold hover:bg-blue-700 transition">
            Add Stock
          </button>
        </form>
      </div>

      {/* ================= ADD PRODUCT STOCK ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Add Product Quantity
        </h2>

        <form
          onSubmit={handleProductSubmit}
          className="grid md:grid-cols-4 gap-4"
        >
          <input
            type="number"
            placeholder="Slot Number"
            className="border rounded-xl p-3"
            value={productForm.slotNumber}
            onChange={(e) =>
              setProductForm({ ...productForm, slotNumber: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Product Name"
            className="border rounded-xl p-3"
            value={productForm.itemName}
            onChange={(e) =>
              setProductForm({ ...productForm, itemName: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Quantity"
            className="border rounded-xl p-3"
            value={productForm.quantity}
            onChange={(e) =>
              setProductForm({ ...productForm, quantity: e.target.value })
            }
          />

          <button className="bg-purple-600 text-white rounded-xl p-3 font-semibold hover:bg-purple-700 transition">
            Add Product
          </button>
        </form>
      </div>
      </Permissions>

        {/* ================= PMS WELLS Display ================= */}
<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-3xl shadow-xl">
  <h2 className="text-xl font-bold text-blue-800 mb-6">
    PMS Wells
  </h2>

  <div className="space-y-6">
    {inventory.fuel.PMS.wells.map((well) => {

      const percentage = Math.min(
        (well.quantity / 10000) * 100,
        100
      ); // assuming 10,000L tank capacity

      const isLow = well.quantity < WELL_THRESHOLD;

      return (
        <div
          key={well.wellNumber}
          className={`bg-white p-5 rounded-2xl shadow transition ${
            isLow ? "border border-red-400" : ""
          }`}
        >
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">
              Well {well.wellNumber}
            </h3>
            <span className="font-bold">
              {formatNumber(well.quantity)} L
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 transition-all duration-500 ${
                isLow ? "bg-red-500" : "bg-blue-600"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {isLow && (
            <p className="text-red-600 text-sm mt-2 font-semibold">
              ⚠ Well running low
            </p>
          )}
        </div>
      );
    })}
  </div>
</div>

{/* ================= AGO Display ================= */}
<div className="bg-green-50 p-6 rounded-3xl shadow-xl">
  <h2 className="text-xl font-bold text-green-800 mb-6">
    AGO Well
  </h2>

  {(() => {
    const percentage = Math.min(
      (inventory.fuel.AGO.quantityLitres / 10000) * 100,
      100
    );

    const isLow =
      inventory.fuel.AGO.quantityLitres < AGO_THRESHOLD;

    return (
      <div className={`bg-white p-5 rounded-2xl shadow ${
        isLow ? "border border-red-400" : ""
      }`}>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">AGO Tank</span>
          <span className="font-bold">
            {formatNumber(inventory.fuel.AGO.quantityLitres)} L
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 transition-all duration-500 ${
              isLow ? "bg-red-500" : "bg-green-600"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isLow && (
          <p className="text-red-600 text-sm mt-2 font-semibold">
            ⚠ AGO stock low
          </p>
        )}
      </div>
    );
  })()}
</div>



      {/* ================= PRODUCT INVENTORY DISPLAY ================= */}
<div className="bg-white p-6 rounded-3xl shadow-xl">
  <h2 className="text-xl font-bold text-gray-800 mb-6">
    Product Slots
  </h2>

  <div className="grid md:grid-cols-5 gap-5">
    {inventory.products.slots.map((slot) => {
      const isLow =
        slot.itemName &&
        slot.quantity <= PRODUCT_THRESHOLD;

      const percentage = Math.min(
        (slot.quantity / PRODUCT_MAX_CAPACITY) * 100,
        100
      );

      return (
        <div
          key={slot.slotNumber}
          className={`p-4 rounded-2xl shadow transition ${
            isLow
              ? "bg-red-50 border border-red-400"
              : "bg-gray-50"
          }`}
        >
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-sm">
              Slot {slot.slotNumber}
            </span>
            <span className="font-bold text-sm">
              {slot.quantity}
            </span>
          </div>

          <p className="text-xs mb-3">
            {slot.itemName || "Empty"}
          </p>

          {slot.itemName && (
            <>
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 transition-all duration-500 ${
                    isLow ? "bg-red-500" : "bg-purple-600"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {isLow && (
                <p className="text-red-600 text-xs mt-2 font-semibold">
                  ⚠ Low Stock
                </p>
              )}
            </>
          )}
        </div>
      );
    })}
  </div>
</div>

    </div>
  );
}
