import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dailySalesAPI } from "../../../services/dailySalesService";
import { useEffect } from "react";

export default function CreateDailySales() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

    notes: [""]
  });

  useEffect(() => {
    // Simulate loading time for better UX
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /* =========================
     HANDLERS
  ========================= */

  const handlePMSPumpChange = (index, field, value) => {
    const updated = [...form.PMS.pumps];
    updated[index][field] = value;

    setForm({
      ...form,
      PMS: { ...form.PMS, pumps: updated }
    });
  };

  const handleNestedExpenseChange = (section, index, field, value) => {
    const updated = [...form[section].expenses];
    updated[index][field] = value;

    setForm({
      ...form,
      [section]: {
        ...form[section],
        expenses: updated
      }
    });
  };

  const handleTopArrayChange = (arrayName, index, field, value) => {
    const updated = [...form[arrayName]];
    updated[index][field] = value;

    setForm({
      ...form,
      [arrayName]: updated
    });
  };

  const handleSectionChange = (section, field, value) => {
    setForm({
      ...form,
      [section]: {
        ...form[section],
        [field]: value
      }
    });
  };

  /* =========================
     ADD ROWS
  ========================= */

  const addExpense = (section) => {
    setForm({
      ...form,
      [section]: {
        ...form[section],
        expenses: [...form[section].expenses, { description: "", amount: "" }]
      }
    });
  };

  const addProduct = () => {
    setForm({
      ...form,
      productsSold: [
        ...form.productsSold,
        { itemName: "", quantitySold: "", pricePerUnit: "" }
      ]
    });
  };

  const addOtherIncome = () => {
    setForm({
      ...form,
      otherIncome: [...form.otherIncome, { itemName: "", amount: "" }]
    });
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedForm = {
      ...form,
      salesDate: form.salesDate,

      PMS: {
        ...form.PMS,
        pricePerLitre: Number(form.PMS.pricePerLitre),
        pumps: form.PMS.pumps.map(p => ({
          pumpNumber: p.pumpNumber,
          openingMeter: Number(p.openingMeter),
          closingMeter: Number(p.closingMeter)
        })),
        expenses: form.PMS.expenses.map(e => ({
          description: e.description,
          amount: Number(e.amount)
        }))
      },

      AGO: {
        openingMeter: Number(form.AGO.openingMeter),
        closingMeter: Number(form.AGO.closingMeter),
        pricePerLitre: Number(form.AGO.pricePerLitre),
        expenses: form.AGO.expenses.map(e => ({
          description: e.description,
          amount: Number(e.amount)
        }))
      },

      productsSold: form.productsSold.map(p => ({
        itemName: p.itemName,
        quantitySold: Number(p.quantitySold),
        pricePerUnit: Number(p.pricePerUnit)
      })),

      otherIncome: form.otherIncome.map(i => ({
        itemName: i.itemName,
        amount: Number(i.amount)
      })),

      notes: [...form.notes.filter(n => n.trim() !== "")]
    };

    await dailySalesAPI.create(cleanedForm);

    navigate("/dashboard/daily-sales");
  };

  const calculatePumpTotals = (pump, pricePerLitre) => {
  const opening = Number(pump.openingMeter) || 0;
  const closing = Number(pump.closingMeter) || 0;
  const price = Number(pricePerLitre) || 0;

  const litres = closing - opening;
  const amount = litres * price;

  return {
    litres: litres > 0 ? litres : 0,
    amount: amount > 0 ? amount : 0
  };
};

const getPMSTotal = () => {
  return form.PMS.pumps.reduce((acc, pump) => {
    const { amount } = calculatePumpTotals(
      pump,
      form.PMS.pricePerLitre
    );
    return acc + amount;
  }, 0);
};

const calculateAGOTotals = () => {
  const opening = Number(form.AGO.openingMeter) || 0;
  const closing = Number(form.AGO.closingMeter) || 0;
  const price = Number(form.AGO.pricePerLitre) || 0;

  const litres = closing - opening;
  const amount = litres * price;

  return {
    litres: litres > 0 ? litres : 0,
    amount: amount > 0 ? amount : 0
  };
};

if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Daily Sales Records For Creation
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we allocate resources for creating daily sales records
        </p>
      </div>
    </div>
  );

  /* =========================
     UI
  ========================= */

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card-premium space-y-8">
        <h2 className="text-2xl font-bold">Create Daily Sales</h2>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* DATE */}
          <div>
            <label>Date</label>
            <input
              type="date"
              className="input-premium"
              value={form.salesDate}
              onChange={e =>
                setForm({ ...form, salesDate: e.target.value })
              }
              required
            />
          </div>

          {/* ================= PMS ================= */}
          <h3 className="text-xl font-semibold">PMS</h3>

          <input
            type="number"
            placeholder="PMS Price Per Litre"
            className="input-premium"
            value={form.PMS.pricePerLitre}
            onChange={e =>
              handleSectionChange("PMS", "pricePerLitre", e.target.value)
            }
            required
          />

          {form.PMS.pumps.map((pump, index) => {
  const { litres, amount } = calculatePumpTotals(
    pump,
    form.PMS.pricePerLitre
  );

  return (
    <div key={index} className="space-y-3 border p-4 rounded-xl">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder={`Pump ${pump.pumpNumber} Opening Meter`}
          className="input-premium"
          value={pump.openingMeter}
          onChange={e =>
            handlePMSPumpChange(index, "openingMeter", e.target.value)
          }
          required
        />

        <input
          type="number"
          placeholder={`Pump ${pump.pumpNumber} Closing Meter`}
          className="input-premium"
          value={pump.closingMeter}
          onChange={e =>
            handlePMSPumpChange(index, "closingMeter", e.target.value)
          }
          required
        />
      </div>

      {/* 🔥 LIVE RESULTS */}
      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
        <p>Litres Sold: <span className="font-semibold">{litres.toFixed(2)} L</span></p>
        <p>Total Amount: <span className="font-semibold">₦{amount.toLocaleString()}</span></p>
      </div>
    </div>
    );
})}

<div className="text-right text-lg font-bold text-blue-600">
  PMS Total Sales: ₦{getPMSTotal().toLocaleString()}
</div>



          {form.PMS.expenses.map((expense, index) => (
            <div key={index} className="flex gap-4">
              <input
                placeholder="Expense Description"
                className="input-premium"
                value={expense.description}
                onChange={e =>
                  handleNestedExpenseChange("PMS", index, "description", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Expense Amount"
                className="input-premium"
                value={expense.amount}
                onChange={e =>
                  handleNestedExpenseChange("PMS", index, "amount", e.target.value)
                }
              />
            </div>
          ))}
          <button type="button" onClick={() => addExpense("PMS")} className="btn-secondary">
            + Add PMS Expense
          </button>

          {/* ================= AGO ================= */}
          <h3 className="text-xl font-semibold">AGO</h3>

           <input
            type="number"
            placeholder="AGO Price Per Litre"
            className="input-premium"
            value={form.AGO.pricePerLitre}
            onChange={e =>
              handleSectionChange("AGO", "pricePerLitre", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Opening Meter"
            className="input-premium"
            value={form.AGO.openingMeter}
            onChange={e =>
              handleSectionChange("AGO", "openingMeter", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Closing Meter"
            className="input-premium"
            value={form.AGO.closingMeter}
            onChange={e =>
              handleSectionChange("AGO", "closingMeter", e.target.value)
            }
          />

          {(() => {
  const { litres, amount } = calculateAGOTotals();

  return (
    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mt-3">
      <p>
        Litres Sold:{" "}
        <span className="font-semibold">
          {litres.toFixed(2)} L
        </span>
      </p>

      <p>
        Total Amount:{" "}
        <span className="font-semibold">
          ₦{amount.toLocaleString()}
        </span>
      </p>
    </div>
  );
})()}

          {form.AGO.expenses.map((expense, index) => (
            <div key={index} className="flex gap-4">
              <input
                placeholder="Expense Description"
                className="input-premium"
                value={expense.description}
                onChange={e =>
                  handleNestedExpenseChange("AGO", index, "description", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Expense Amount"
                className="input-premium"
                value={expense.amount}
                onChange={e =>
                  handleNestedExpenseChange("AGO", index, "amount", e.target.value)
                }
              />
            </div>
          ))}


          <button type="button" onClick={() => addExpense("AGO")} className="btn-secondary">
            + Add AGO Expense
          </button>

          {/* ================= PRODUCTS ================= */}
          <h3 className="text-xl font-semibold">Products Sold</h3>

          {form.productsSold.map((product, index) => (
            <div key={index} className="grid md:grid-cols-3 gap-4">
              <input
                placeholder="Item Name"
                className="input-premium"
                value={product.itemName}
                onChange={e =>
                  handleTopArrayChange("productsSold", index, "itemName", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Quantity"
                className="input-premium"
                value={product.quantitySold}
                onChange={e =>
                  handleTopArrayChange("productsSold", index, "quantitySold", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Price Per Unit"
                className="input-premium"
                value={product.pricePerUnit}
                onChange={e =>
                  handleTopArrayChange("productsSold", index, "pricePerUnit", e.target.value)
                }
              />
            </div>
          ))}

          <button type="button" onClick={addProduct} className="btn-secondary">
            + Add Product
          </button>

          {/* ================= OTHER INCOME ================= */}
          <h3 className="text-xl font-semibold">Other Income</h3>

          {form.otherIncome.map((income, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Item Name"
                className="input-premium"
                value={income.itemName}
                onChange={e =>
                  handleTopArrayChange("otherIncome", index, "itemName", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Amount"
                className="input-premium"
                value={income.amount}
                onChange={e =>
                  handleTopArrayChange("otherIncome", index, "amount", e.target.value)
                }
              />
            </div>
          ))}

          <button type="button" onClick={addOtherIncome} className="btn-secondary">
            + Add Income
          </button>

          {/* ================= NOTES ================= */}
          <h3 className="text-xl font-semibold">Notes</h3>
          {form.notes.map((note, index) => (
            <div key={index} className="flex gap-4">
              <input
                placeholder="Add a note (e.g. POS and Cash Amounts)"
                className="input-premium"
                value={note}
                onChange={e => {
                  const updated = [...form.notes];
                  updated[index] = e.target.value;
                  setForm({ ...form, notes: updated });
                }}
              />
            </div>
          ))}


          <button className="btn-primary w-full">
            Draft Daily Sales
          </button>
        </form>
      </div>
    </div>
  );
}
