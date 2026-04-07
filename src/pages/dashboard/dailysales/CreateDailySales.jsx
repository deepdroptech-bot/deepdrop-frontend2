import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dailySalesAPI } from "../../../services/dailySalesService";

export default function CreateDailySales() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPriceModal, setShowPriceModal] = useState(false);
const [newPriceInput, setNewPriceInput] = useState("");

  /* ===========================
     FORM STATE
  ============================ */
  const [form, setForm] = useState({
    salesDate: "",
    PMS: {
      priceSegments: [
        { pricePerLitre: "", startTime: new Date().toISOString() }
      ],
      pumps: [
 { pumpNumber: 1, sales: [{ openingMeter:"", closingMeter:"", calibrationLitres:"", calibrationReason:"" }] },
 { pumpNumber: 2, sales: [{ openingMeter:"", closingMeter:"", calibrationLitres:"", calibrationReason:"" }] },
 { pumpNumber: 3, sales: [{ openingMeter:"", closingMeter:"", calibrationLitres:"", calibrationReason:"" }] },
 { pumpNumber: 4, sales: [{ openingMeter:"", closingMeter:"", calibrationLitres:"", calibrationReason:"" }] }
],
      expenses: [{ description: "", amount: "" }]
    },
    AGO: { openingMeter: "", closingMeter: "", calibrationLitres: "", calibrationReason: "", pricePerLitre: "", expenses: [{ description: "", amount: "" }] },
    productsSold: [{ itemName: "", quantitySold: "", pricePerUnit: "" }],
    otherIncome: [{ itemName: "", amount: "" }],
    notes: [""]
  });

  /* ===========================
     LOADING SIMULATION
  ============================ */
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  /* ===========================
     HELPERS
  ============================ */
  const handlePMSPumpChange = (pumpIndex, segmentIndex, field, value) => {
    const updated = [...form.PMS.pumps];
    updated[pumpIndex].sales[segmentIndex][field] = value;
    setForm({ ...form, PMS: { ...form.PMS, pumps: updated } });
  };

  const handleSectionChange = (section, field, value) => {
    setForm({ ...form, [section]: { ...form[section], [field]: value } });
  };

  const handleTopArrayChange = (arrayName, index, field, value) => {
    const updated = [...form[arrayName]];
    updated[index][field] = value;
    setForm({ ...form, [arrayName]: updated });
  };

  const handleNestedExpenseChange = (section, index, field, value) => {
    const updated = [...form[section].expenses];
    updated[index][field] = value;
    setForm({ ...form, [section]: { ...form[section], expenses: updated } });
  };

  const addExpense = (section) => {
    setForm({
      ...form,
      [section]: { ...form[section], expenses: [...form[section].expenses, { description: "", amount: "" }] }
    });
  };

  const addProduct = () => {
    setForm({ ...form, productsSold: [...form.productsSold, { itemName: "", quantitySold: "", pricePerUnit: "" }] });
  };

  const addOtherIncome = () => {
    setForm({ ...form, otherIncome: [...form.otherIncome, { itemName: "", amount: "" }] });
  };

  const safeNumber = (v)=> Number(v) || 0;

const formatLitres = (v)=> safeNumber(v).toFixed(2);

const formatMoney = (v)=> 
"₦" + safeNumber(v).toLocaleString();

  /* ===========================
     ADD NEW PRICE SEGMENT
  ============================ */
  const addPriceSegment = () => {
    const lastPrice = Number(form.PMS.priceSegments[form.PMS.priceSegments.length - 1]?.pricePerLitre) || 0;
    setForm({
      ...form,
      PMS: {
        ...form.PMS,
        priceSegments: [...form.PMS.priceSegments, { pricePerLitre: lastPrice, startTime: new Date().toISOString() }]
      }
    });
  };

  /* ===========================
     CALCULATE LIVE TOTALS
  ============================ */
  const calculatePumpSegmentTotals = (pump, segment, price) => {
    const opening = Number(segment.openingMeter) || 0;
    const closing = Number(segment.closingMeter) || 0;
    const calibration = Number(segment.calibrationLitres) || 0;
    const litres = Math.max(closing - opening, 0);
    const litresSold = Math.max(litres - calibration, 0);
    const amount = litresSold * (Number(price) || 0);
    return { litres, calibration, litresSold, amount };
  };

  const calculatePumpTotals = (pump, pricePerLitre) => {
  const lastSale = pump.sales[pump.sales.length - 1];
  const opening = Number(lastSale.openingMeter) || 0;
  const closing = Number(lastSale.closingMeter) || 0;
  const calibration = Number(lastSale.calibrationLitres) || 0;
  const price = Number(pricePerLitre) || 0;

  const litres = Math.max(closing - opening, 0);
  const litresSold = Math.max(litres - calibration, 0);
  const amount = litresSold * price;

  return { litres, calibration, litresSold, amount };
};

  const calculatePMSTotals = () => {
    return form.PMS.pumps.reduce((acc, pump) => {
      pump.sales.forEach((segment, idx) => {
        const price = form.PMS.priceSegments[idx]?.pricePerLitre || 0;
        const { amount } = calculatePumpSegmentTotals(pump, segment, price);
        acc += amount;
      });
      return acc;
    }, 0);
  };

  const calculateAGOTotals = () => {
    const opening = Number(form.AGO.openingMeter) || 0;
    const closing = Number(form.AGO.closingMeter) || 0;
    const litres = Math.max(closing - opening, 0);
    const calibration = Number(form.AGO.calibrationLitres) || 0;
    const litresSold = Math.max(litres - calibration, 0);
    const amount = litresSold * (Number(form.AGO.pricePerLitre) || 0);
    return { litresSold, amount, litres, calibration };
  };

  /* ===========================
     SUBMIT FORM
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingButton(true);
    setError({});
    setMessage("");

    try {
      const cleanedForm = { ...form };

      cleanedForm.PMS.priceSegments = cleanedForm.PMS.priceSegments.map((p) => ({
        ...p,
        pricePerLitre: Number(p.pricePerLitre)
      }));

      cleanedForm.PMS.pumps = cleanedForm.PMS.pumps.map((pump) => ({
        pumpNumber: pump.pumpNumber,
        sales: pump.sales.map((s) => ({
          openingMeter: Number(s.openingMeter),
          closingMeter: Number(s.closingMeter),
          calibrationLitres: Number(s.calibrationLitres),
          calibrationReason: s.calibrationReason,
          priceIndex: index 
        }))
      }));
      cleanedForm.PMS.expenses = cleanedForm.PMS.expenses.map((e) => ({ description: e.description, amount: Number(e.amount) }));

      cleanedForm.AGO = {
        ...cleanedForm.AGO,
        openingMeter: Number(cleanedForm.AGO.openingMeter),
        closingMeter: Number(cleanedForm.AGO.closingMeter),
        calibrationLitres: Number(cleanedForm.AGO.calibrationLitres),
        calibrationReason: cleanedForm.AGO.calibrationReason,
        pricePerLitre: Number(cleanedForm.AGO.pricePerLitre),
        expenses: cleanedForm.AGO.expenses.map((e) => ({ description: e.description, amount: Number(e.amount) }))
      };

      cleanedForm.productsSold = cleanedForm.productsSold.map((p) => ({
        ...p,
        quantitySold: Number(p.quantitySold),
        pricePerUnit: Number(p.pricePerUnit)
      }));

      cleanedForm.otherIncome = cleanedForm.otherIncome.map((i) => ({
        ...i,
        amount: Number(i.amount)
      }));

      const res = await dailySalesAPI.create(cleanedForm);

      if (!res.data.success) {
        setError(res.data.error || "Failed to create daily sales record");
        return;
      }

      setMessage(res.data.msg);
      setTimeout(() => navigate("/dashboard/daily-sales"), 800);
    } catch (err) {
      setError(err.response?.data?.msg || "Unexpected error occurred" );
    } finally {
      setLoadingButton(false);
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
            Loading Daily Sales Records For Creation
          </h2>
          <p className="text-gray-500 text-base">
            Please wait while we allocate resources for creating daily sales records
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Create Daily Sales</h2>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* DATE */}
        <div>
          <label>Date</label>
          <input
            type="date"
            className="input-premium"
            value={form.salesDate}
            onChange={(e) => setForm({ ...form, salesDate: e.target.value })}
            required
          />
        </div>

        {/* PMS */}
        <h3 className="text-xl font-semibold">PMS</h3>

        <div className="flex gap-4 items-center mb-3">
          <input
            type="text"
            inputMode="decimal"
            placeholder="PMS Price Per Litre"
            className="input-premium"
            value={form.PMS.priceSegments[form.PMS.priceSegments.length - 1]?.pricePerLitre || ""}
            onChange={(e) => {
              const updated = [...form.PMS.priceSegments];
              updated[updated.length - 1].pricePerLitre = e.target.value;
              setForm({ ...form, PMS: { ...form.PMS, priceSegments: updated } });
            }}
            required
          />
          <button
  type="button"
  onClick={() => {
    const lastSegment = form.PMS.priceSegments[form.PMS.priceSegments.length - 1];
    setNewPriceInput(lastSegment?.pricePerLitre || form.PMS.pricePerLitre);
    setShowPriceModal(true);
  }}
  className="btn-secondary"
>
  + Change Price (New Segment)
</button>
        </div>

        {/* PUMPS */}
        {form.PMS.pumps.map((pump, pumpIndex) => (
          <div key={pumpIndex} className="border p-4 rounded-xl space-y-3">
            <h4 className="font-semibold">Pump {pump.pumpNumber}</h4>

            {pump.sales.map((segment, segIndex) => {
              const price = form.PMS.priceSegments[segIndex]?.pricePerLitre || 0;
              const { litres, calibration, litresSold, amount } = calculatePumpSegmentTotals(pump, segment, price);

              return (
                <div key={segIndex} className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <h5 className="font-semibold">Segment {segIndex + 1} (₦{price})</h5>
                  <div className="grid md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Opening Meter"
                      className="input-premium"
                      value={segment.openingMeter}
                      onChange={(e) => handlePMSPumpChange(pumpIndex, segIndex, "openingMeter", e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Closing Meter"
                      className="input-premium"
                      value={segment.closingMeter}
                      onChange={(e) => handlePMSPumpChange(pumpIndex, segIndex, "closingMeter", e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Calibration Litres"
                      className="input-premium"
                      value={segment.calibrationLitres}
                      onChange={(e) => handlePMSPumpChange(pumpIndex, segIndex, "calibrationLitres", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Calibration Reason"
                      className="input-premium"
                      value={segment.calibrationReason || ""}
                      onChange={(e) => handlePMSPumpChange(pumpIndex, segIndex, "calibrationReason", e.target.value)}
                    />
                  </div>
                 <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
  <p>
    Litres Sold:
    <span className="font-semibold">
      {formatLitres(litres)} L
    </span>
  </p>

  <p>
    Calibration:
    <span className="font-semibold">
      {formatLitres(calibration)} L
    </span>
  </p>

  <p>
    Net Litres Sold:
    <span className="font-semibold">
      {formatLitres(litresSold)} L
    </span>
  </p>

  <p>
    Total Amount:
    <span className="font-semibold">
      {formatMoney(amount)}
    </span>
  </p>
</div>
                </div>
              );
            })}
          </div>
        ))}

        <div className="text-right text-lg font-bold text-blue-600">
          PMS Total: ₦{calculatePMSTotals().toLocaleString()}
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
                type="text"
                inputMode="decimal"
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
            type="text"
            inputMode="decimal"
            placeholder="AGO Price Per Litre"
            className="input-premium"
            value={form.AGO.pricePerLitre}
            onChange={e =>
              handleSectionChange("AGO", "pricePerLitre", e.target.value)
            }
          />

          <input
            type="text"
            inputMode="decimal"
            placeholder="Opening Meter"
            className="input-premium"
            value={form.AGO.openingMeter}
            onChange={e =>
              handleSectionChange("AGO", "openingMeter", e.target.value)
            }
          />

          <input
            type="text"
            inputMode="decimal"
            placeholder="Closing Meter"
            className="input-premium"
            value={form.AGO.closingMeter}
            onChange={e =>
              handleSectionChange("AGO", "closingMeter", e.target.value)
            }
          />

          <h3 className="text-lg font-semibold col-span-full">
            AGO Calibration
          </h3>

          <input
            type="text"
            inputMode="decimal"
            placeholder="Calibration Litres"
            className="input-premium"
            value={form.AGO.calibrationLitres}
            onChange={e =>
              handleSectionChange("AGO", "calibrationLitres", e.target.value)
            }
          />

          <input
            placeholder="Calibration Reason"
            className="input-premium"
            value={form.AGO.calibrationReason}
            onChange={e =>
              handleSectionChange("AGO", "calibrationReason", e.target.value)
            }
          />

          {(() => {
  const { litres, litresSold, amount, calibration } = calculateAGOTotals();

  return (
    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mt-3">
      <p>
        Litres:{" "}
        <span className="font-semibold">
          {formatLitres(litres)} L
        </span>
      </p>

        <p>
        Calibration:{" "}
        <span className="font-semibold">
          {formatLitres(calibration)} L
        </span>
      </p>

      <p>
        Litres Sold:{" "}
        <span className="font-semibold">
          {formatLitres(litresSold)} L
        </span>
      </p>

      <p>
        Total Amount:{" "}
        <span className="font-semibold">
          {formatMoney(amount)}
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
                type="text"
                inputMode="decimal"
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
          {(form.notes || []).map((note, index) => (
  <div key={index} className="flex gap-4">
    <textarea
      placeholder="Add a note (e.g. POS and Cash Amounts)"
      className="input-premium min-h-[80px] w-full"
      value={typeof note === "string" ? note : ""}
      onChange={e => {
        const updated = [...(form.notes || [])];
        updated[index] = e.target.value;

        setForm({
          ...form,
          notes: updated
        });
      }}
    />
  </div>
))}

          {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

              <button  disabled={loadingButton} className="btn-primary w-full"
              type="submit"
              >
              {loadingButton ? "Drafting..." : "Draft Daily Sales"}
              </button>
        </form>
        {showPriceModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl p-6 w-96 shadow-xl space-y-4">
      <h3 className="text-xl font-bold">Change PMS Price</h3>
      <p>All pumps will use this price. New segment will start with last closing meters.</p>
      <input
        type="number"
        placeholder="New Price Per Litre"
        className="input-premium w-full"
        value={newPriceInput}
        onChange={(e) => setNewPriceInput(e.target.value)}
      />
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="btn-secondary"
          onClick={() => setShowPriceModal(false)}
        >
          Cancel
        </button>
        <button
          className="btn-primary"
          onClick={() => {
            if (!newPriceInput || Number(newPriceInput) <= 0) return;

            const updatedSegments = [
              ...form.PMS.priceSegments,
              { pricePerLitre: Number(newPriceInput), startTime: new Date().toISOString() }
            ];

            // Add new sales segment to each pump
            const updatedPumps = form.PMS.pumps.map((pump) => {
              const lastSales = pump.sales || [];
              const lastClosing = lastSales.length
                ? Number(lastSales[lastSales.length - 1].closingMeter)
                : Number(pump.openingMeter) || 0;

              return {
                ...pump,
                sales: [
                  ...lastSales,
                  {
                    openingMeter: lastClosing,
                    closingMeter: "",
                    calibrationLitres: 0,
                    calibrationReason: ""
                  }
                ]
              };
            });

            setForm({
              ...form,
              PMS: {
                ...form.PMS,
                pricePerLitre: Number(newPriceInput),
                priceSegments: updatedSegments,
                pumps: updatedPumps
              }
            });

            setShowPriceModal(false);
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
      </div>
  );
}
