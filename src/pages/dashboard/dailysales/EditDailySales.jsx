import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dailySalesAPI } from "../../../services/dailySalesService";

export default function EditDailySales() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    salesDate: "",

    PMS: {
      pumps: [
        { pumpNumber: 1, openingMeter: "", closingMeter: "" },
        { pumpNumber: 2, openingMeter: "", closingMeter: "" }
      ],
      pricePerLitre: "",
      expenses: [{ description: "", amount: "" }]
    },

    AGO: {
      openingMeter: "",
      closingMeter: "",
      pricePerLitre: "",
      expenses: [{ description: "", amount: "" }]
    },

    productsSold: [
      { itemName: "", quantitySold: "", pricePerUnit: "" }
    ],

    otherIncome: [
      { itemName: "", amount: "" }
    ],

    notes: [""],

    updateReason: ""
  });

  useEffect(() => {
    fetchSale();
  }, []);

  const fetchSale = async () => {
    try {
      const res = await dailySalesAPI.getById(id);

      if (res.data.isLocked) {
        alert("Approved sales cannot be edited.");
        navigate("/dashboard/daily-sales");
        return;
      }

      // Pre-fill entire structure from backend
      setForm({
        ...res.data,
        salesDate: res.data.salesDate?.substring(0, 10),
        updateReason: ""
      });

      setLoading(false);
    } catch (err) {
      alert("Failed to load sales record");
      navigate("/dashboard/daily-sales");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.updateReason.trim()) {
      alert("Please provide a reason for updating this sales record.");
      return;
    }

    try {
      await dailySalesAPI.update(id, form);
      alert("Daily sales updated successfully.");
      navigate("/dashboard/daily-sales");
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Daily Sales Records For Update
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we fetch daily sales records
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">
        Edit Daily Sales
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 card-premium">

        {/* SALES DATE */}
        <div>
          <label>Sales Date</label>
          <input
            type="date"
            value={form.salesDate}
            onChange={(e) =>
              setForm({ ...form, salesDate: e.target.value })
            }
            className="input-primary"
            required
          />
        </div>

        {/* PMS SECTION */}
        <div>
          <h3 className="font-bold text-lg">PMS</h3>

          {form.PMS.pumps.map((pump, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="number"
                placeholder="Opening Meter"
                value={pump.openingMeter}
                onChange={(e) => {
                  const updated = [...form.PMS.pumps];
                  updated[index].openingMeter = e.target.value;
                  setForm({
                    ...form,
                    PMS: { ...form.PMS, pumps: updated }
                  });
                }}
                className="input-primary"
              />

              <input
                type="number"
                placeholder="Closing Meter"
                value={pump.closingMeter}
                onChange={(e) => {
                  const updated = [...form.PMS.pumps];
                  updated[index].closingMeter = e.target.value;
                  setForm({
                    ...form,
                    PMS: { ...form.PMS, pumps: updated }
                  });
                }}
                className="input-primary"
              />
            </div>
          ))}

          <input
            type="number"
            placeholder="Price Per Litre"
            value={form.PMS.pricePerLitre}
            onChange={(e) =>
              setForm({
                ...form,
                PMS: { ...form.PMS, pricePerLitre: e.target.value }
              })
            }
            className="input-primary"
          />
        </div>

        {/* AGO SECTION */}
        <div>
          <h3 className="font-bold text-lg">AGO</h3>

          <input
            type="number"
            placeholder="Opening Meter"
            value={form.AGO.openingMeter}
            onChange={(e) =>
              setForm({
                ...form,
                AGO: { ...form.AGO, openingMeter: e.target.value }
              })
            }
            className="input-primary"
          />

          <input
            type="number"
            placeholder="Closing Meter"
            value={form.AGO.closingMeter}
            onChange={(e) =>
              setForm({
                ...form,
                AGO: { ...form.AGO, closingMeter: e.target.value }
              })
            }
            className="input-primary"
          />

          <input
            type="number"
            placeholder="Price Per Litre"
            value={form.AGO.pricePerLitre}
            onChange={(e) =>
              setForm({
                ...form,
                AGO: { ...form.AGO, pricePerLitre: e.target.value }
              })
            }
            className="input-primary"
          />
        </div>

        {/* PRODUCTS SOLD */}
        <div>
          <h3 className="font-bold text-lg">Products Sold</h3>

          {form.productsSold.map((item, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                placeholder="Item Name"
                value={item.itemName}
                onChange={(e) => {
                  const updated = [...form.productsSold];
                  updated[index].itemName = e.target.value;
                  setForm({ ...form, productsSold: updated });
                }}
                className="input-primary"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={item.quantitySold}
                onChange={(e) => {
                  const updated = [...form.productsSold];
                  updated[index].quantitySold = e.target.value;
                  setForm({ ...form, productsSold: updated });
                }}
                className="input-primary"
              />

              <input
                type="number"
                placeholder="Price Per Unit"
                value={item.pricePerUnit}
                onChange={(e) => {
                  const updated = [...form.productsSold];
                  updated[index].pricePerUnit = e.target.value;
                  setForm({ ...form, productsSold: updated });
                }}
                className="input-primary"
              />
            </div>
          ))}
        </div>

        {/* OTHER INCOME */}
        <div>
          <h3 className="font-bold text-lg">Other Income</h3>

          {form.otherIncome.map((item, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                placeholder="Item Name"
                value={item.itemName}
                onChange={(e) => {
                  const updated = [...form.otherIncome];
                  updated[index].itemName = e.target.value;
                  setForm({ ...form, otherIncome: updated });
                }}
                className="input-primary"
              />

              <input
                type="number"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) => {
                  const updated = [...form.otherIncome];
                  updated[index].amount = e.target.value;
                  setForm({ ...form, otherIncome: updated });
                }}
                className="input-primary"
              />
            </div>
          ))}
        </div>

        {/* NOTES */}
        <div>
          <h3 className="font-bold text-lg">Notes</h3>

          {form.notes.map((note, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                placeholder="Add a note (e.g. POS and Cash Amounts)"
                className="input-primary"
                value={note}
                onChange={(e) => {
                  const updated = [...form.notes];
                  updated[index] = e.target.value;
                  setForm({ ...form, notes: updated });
                }}
              />
            </div>
          ))}
        </div>

        {/* UPDATE REASON */}
        <div>
          <label>Reason For Update</label>
          <textarea
            value={form.updateReason}
            onChange={(e) =>
              setForm({ ...form, updateReason: e.target.value })
            }
            className="input-primary"
            required
          />
        </div>

        <button className="btn-primary w-full">
          Update Daily Sales
        </button>

      </form>
    </div>
  );
}
