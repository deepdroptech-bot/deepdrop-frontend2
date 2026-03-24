import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dailySalesAPI } from "../../../services/dailySalesService";

export default function EditDailySales() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    salesDate: "",

    PMS: {
      pumps: [
        { pumpNumber: 1, openingMeter: "", closingMeter: "", calibrationLitres: "", calibrationReason: "" },
        { pumpNumber: 2, openingMeter: "", closingMeter: "", calibrationLitres: "", calibrationReason: "" },
        { pumpNumber: 3, openingMeter: "", closingMeter: "", calibrationLitres: "", calibrationReason: "" },
        { pumpNumber: 4, openingMeter: "", closingMeter: "", calibrationLitres: "", calibrationReason: "" }
      ],
      pricePerLitre: "",
      expenses: [{ description: "", amount: "" }]
    },

    AGO: {
      openingMeter: "",
      closingMeter: "",
      calibrationLitres: "",
      calibrationReason: "",
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

    setLoadingButton(true);
    setError({});
      setMessage("");

    if (!form.updateReason.trim()) {
      alert("Please provide a reason for updating this sales record.");
      return;
    }

    try {
    const res = await dailySalesAPI.update(id, form);
    if (!res.data.success) {
      if (res.data.errors) {
        setError(res.data.errors);
      } else {
        setError(res.data.msg || "Failed to update daily sales.");
      }
      return;
    }
    setMessage(res.data.msg);
    setTimeout(() => {
      navigate("/dashboard/daily-sales");
    }, 1000);
    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred while updating daily sales.");
    }
finally {      setLoadingButton(false);
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
  <div className="max-w-6xl mx-auto space-y-10">

    {/* HEADER */}
    <div className="bg-white rounded-3xl shadow-xl p-6 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800">
          Edit Daily Sales
        </h2>
        <p className="text-gray-500">
          Update and adjust the daily sales record
        </p>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="space-y-10">

      {/* SALES DATE */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sales Date
        </label>

        <input
          type="date"
          value={form.salesDate}
          onChange={(e) =>
            setForm({ ...form, salesDate: e.target.value })
          }
          className="input-premium"
          required
        />
      </div>

      {/* PMS SECTION */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-xl p-6 space-y-6">
        <h3 className="text-xl font-bold text-blue-800">
          PMS Pumps
        </h3>

        {form.PMS.pumps.map((pump, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-md space-y-4"
          >
            <h4 className="font-semibold text-gray-700">
              Pump {pump.pumpNumber}
            </h4>

            <div className="grid md:grid-cols-2 gap-4">

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
                className="input-premium"
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
                className="input-premium"
              />

              <input
                type="number"
                placeholder="Calibration Litres"
                value={pump.calibration}
                onChange={(e) => {
                  const updated = [...form.PMS.pumps];
                  updated[index].calibration = e.target.value;
                  setForm({
                    ...form,
                    PMS: { ...form.PMS, pumps: updated }
                  });
                }}
                className="input-premium"
              />

              <input
                type="text"
                placeholder="Calibration Reason"
                value={pump.calibrationReason}
                onChange={(e) => {
                  const updated = [...form.PMS.pumps];
                  updated[index].calibrationReason = e.target.value;
                  setForm({
                    ...form,
                    PMS: { ...form.PMS, pumps: updated }
                  });
                }}
                className="input-premium"
              />
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <input
            type="number"
            placeholder="PMS Price Per Litre"
            value={form.PMS.pricePerLitre}
            onChange={(e) =>
              setForm({
                ...form,
                PMS: { ...form.PMS, pricePerLitre: e.target.value }
              })
            }
            className="input-premium"
          />
        </div>
      </div>

      {/* AGO */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-green-800">
          AGO Sales
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
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
            className="input-premium"
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
            className="input-premium"
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
            className="input-premium"
          />
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-purple-700">
          Products Sold
        </h3>

        {form.productsSold.map((item, index) => (
          <div key={index} className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) => {
                const updated = [...form.productsSold];
                updated[index].itemName = e.target.value;
                setForm({ ...form, productsSold: updated });
              }}
              className="input-premium"
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
              className="input-premium"
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
              className="input-premium"
            />
          </div>
        ))}
      </div>

      {/* OTHER INCOME */}
      <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-indigo-700">
          Other Income
        </h3>

        {form.otherIncome.map((item, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Income Source"
              value={item.itemName}
              onChange={(e) => {
                const updated = [...form.otherIncome];
                updated[index].itemName = e.target.value;
                setForm({ ...form, otherIncome: updated });
              }}
              className="input-premium"
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
              className="input-premium"
            />
          </div>
        ))}
      </div>

      {/* NOTES */}
      <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-700">
          Notes
        </h3>

        {form.notes.map((note, index) => (
          <input
            key={index}
            type="text"
            placeholder="Add note..."
            value={note}
            onChange={(e) => {
              const updated = [...form.notes];
              updated[index] = e.target.value;
              setForm({ ...form, notes: updated });
            }}
            className="input-premium"
          />
        ))}
      </div>

      {/* UPDATE REASON */}
      <div className="bg-white rounded-3xl shadow-xl p-6 space-y-3">
        <label className="font-semibold text-gray-700">
          Reason For Update
        </label>

        <textarea
          value={form.updateReason}
          onChange={(e) =>
            setForm({ ...form, updateReason: e.target.value })
          }
          className="input-premium min-h-[120px]"
          required
        />
      </div>

      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <button className="btn-primary w-full text-lg py-4" type="submit" disabled={loadingButton}>
        {loadingButton ? "Updating..." : "Update Daily Sales"}
      </button>

    </form>
  </div>
);
}
