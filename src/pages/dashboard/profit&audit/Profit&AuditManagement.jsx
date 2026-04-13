import { useState, useEffect } from "react";
import { profitAuditAPI } from "../../../services/profit&AuditService";
import { pdfAPI } from "../../../services/pdfService";

export default function ProfitAuditManagement() {

  const [activeTab, setActiveTab] = useState("daily");

  const [dailyDate, setDailyDate] = useState("");
  const [dailyReport, setDailyReport] = useState(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [summary, setSummary] = useState(null);

  const [auditdate, setAuditDate] = useState("");
  const [auditData, setAuditData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false); 

  const [calibrationFrom,setCalibrationFrom] = useState("");
const [calibrationTo,setCalibrationTo] = useState("");
const [calibrationData,setCalibrationData] = useState([]);

  const formatCurrency = (val) =>
    `₦${Number(val || 0).toLocaleString()}`;

  useEffect(() => {
    // Simulate loading time for better UX
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /* ================= DAILY REPORT ================= */

  const fetchDailyReport = async () => {
    try {
      const res = await profitAuditAPI.getDailyReport(dailyDate);
      setDailyReport(res.data);
    } catch (err) {
      alert("No approved sales found for this date");
      setDailyReport(null);
    }
  };


  /* ================= SUMMARY REPORT ================= */

  const fetchSummary = async () => {
    try {
      const res = await profitAuditAPI.getSummary(from, to);
      setSummary(res.data);
    } catch (err) {
      alert("Failed to generate summary");
    }
  };

const handleGenerateSummaryPDF = async () => {

try{
  setLoadingPDF(true);

const res = await pdfAPI.generateProfitSummaryPDF(from,to);

const blob = new Blob(
[res.data],
{type:"application/pdf"}
);

const url = window.URL.createObjectURL(blob);

const link = document.createElement("a");

link.href = url;

link.download = `Profit_Summary_${from}_to_${to}.pdf`;

document.body.appendChild(link);

link.click();

link.remove();

window.URL.revokeObjectURL(url);

}
catch(err){
  setLoadingPDF(false);

console.error(err);

alert("Failed to generate PDF");

}

};

  /* ================= AUDIT TRAIL ================= */

  const fetchAuditTrail = async () => {
    try {
      const res = await profitAuditAPI.getAuditTrail(auditdate);
      setAuditData(res.data);
    } catch (err) {
      alert("Sales record not found");
    }
  };

  /* ================= CALIBRATION AUDIT ================= */

  const fetchCalibrationAudit = async ()=>{

try{

const res = await profitAuditAPI.getPumpCalibrationAudit(
calibrationFrom,
calibrationTo
);

setCalibrationData(res.data);

}catch{

alert("Failed to fetch calibration audit");

}

};

const handleGenerateCalibrationPDF = async ()=>{

try{
  setLoadingPDF(true);
const res = await pdfAPI.generateCalibrationPDF(calibrationFrom,calibrationTo);

const blob = new Blob(
[res.data],
{type:"application/pdf"}
);
const url = window.URL.createObjectURL(blob);

const link = document.createElement
("a");

link.href = url;
link.download = `Pump_Calibration_${calibrationFrom}_to_${calibrationTo}.pdf`;

document.body.appendChild(link);
link.click();
link.remove();
window.URL.revokeObjectURL(url);
}
catch(err){
  setLoadingPDF(false);
console.error(err);
alert("Failed to generate PDF");
}
};

  if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Profit & Audit Data
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we prepare the financial data
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full overflow-x-hidden">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold">
          Sales Summary & Audit Center
        </h1>
        <p className="text-indigo-200 mt-2">
          Summarize Sales Performance and Track Who did What
        </p>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-4">
        {["daily","summary", "calibration","audit"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-white shadow"
            }`}
          >
            {tab === "daily" && "Daily Report"}
            {tab === "summary" && "Profit Summary"}
            {tab === "calibration" && "Pump Calibration"}
            {tab === "audit" && "Audit Trail"}
          </button>
        ))}
      </div>

      {/* ============================================================
         DAILY PROFIT REPORT TAB
      ============================================================ */}
      {activeTab === "daily" && (
        <div className="bg-white p-6 rounded-3xl shadow-xl space-y-6">

          <div className="flex gap-4">
            <input
              type="date"
              className="border p-3 rounded-xl"
              value={dailyDate}
              onChange={(e) => setDailyDate(e.target.value)}
            />
            <button
              onClick={fetchDailyReport}
              className="bg-indigo-600 text-white px-6 rounded-xl"
            >
              Generate
            </button>
          </div>

          {dailyReport && (
            <div className="grid md:grid-cols-3 gap-6">

              <div className="bg-blue-50 p-6 rounded-2xl">
                <h3 className="font-bold mb-2">PMS</h3>
                <p>Litres Sold: {dailyReport.PMS.litres}</p>
                <p>Price: {formatCurrency(dailyReport.PMS.price)}</p>
                <p>Revenue: {formatCurrency(dailyReport.PMS.revenue)}</p>
                <p>Expenses: {formatCurrency(dailyReport.PMS.expenses)}</p>
                <p className="font-bold text-green-600">
                  Net Amount: {formatCurrency(dailyReport.PMS.netProfit)}
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-2xl">
                <h3 className="font-bold mb-2">AGO</h3>
                <p>Litres Sold: {dailyReport.AGO.litres}</p>
                <p>Price: {formatCurrency(dailyReport.AGO.price)}</p>
                <p>Revenue: {formatCurrency(dailyReport.AGO.revenue)}</p>
                <p>Expenses: {formatCurrency(dailyReport.AGO.expenses)}</p>
                <p className="font-bold text-green-600">
                  Net Amount: {formatCurrency(dailyReport.AGO.netProfit)}
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-2xl">
                <h3 className="font-bold mb-2">Total Net Amount</h3>
                <p className="text-2xl font-bold text-indigo-700">
                  {formatCurrency(dailyReport.totalNetProfit)}
                </p>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ============================================================
         PROFIT SUMMARY TAB
      ============================================================ */}
      {activeTab === "summary" && (
        <div className="bg-white p-6 rounded-3xl shadow-xl space-y-6">

          <div className="flex gap-4">
            <input type="date" className="border p-3 rounded-xl" value={from} onChange={e => setFrom(e.target.value)} />
            <input type="date" className="border p-3 rounded-xl" value={to} onChange={e => setTo(e.target.value)} />
            <button onClick={fetchSummary} className="bg-purple-600 text-white px-6 rounded-xl">
              Generate
            </button>
          </div>

          {summary && (
  <div className="grid md:grid-cols-3 gap-8 mt-6">

    {/* ================= PMS CARD ================= */}
    <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-7 shadow-lg hover:shadow-xl transition-all">

      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            PMS Performance
          </h3>
          <p className="text-sm text-gray-400">
            Premium Motor Spirit
          </p>
        </div>

        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
          PMS
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-medium text-gray-700">Litres Sold:</span>{" "}
          {summary.PMS.totalLitres.toLocaleString()} L
        </p>

      <p>
<span className="font-medium text-gray-700">
Pump 1 & 2:
</span>

{summary.PMS.pump12Litres.toLocaleString()} L
</p>

<p>

<span className="font-medium text-gray-700">
Pump 3 & 4:
</span>

{summary.PMS.pump34Litres.toLocaleString()} L

</p>

        <p>
          <span className="font-medium text-gray-700">Revenue:</span>{" "}
          {formatCurrency(summary.PMS.revenue)}
        </p>
        <p>
          <span className="font-medium text-gray-700">Expenses:</span>{" "}
          {formatCurrency(summary.PMS.expenses)}
        </p>
      </div>

      <div
        className={`mt-6 text-2xl font-bold ${
          summary.PMS.netProfit >= 0
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {formatCurrency(summary.PMS.netProfit)}
        <span className="text-sm font-medium ml-2 text-gray-400">
          Net Profit
        </span>
      </div>
    </div>

    {/* ================= AGO CARD ================= */}
    <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-7 shadow-lg hover:shadow-xl transition-all">

      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            AGO Performance
          </h3>
          <p className="text-sm text-gray-400">
            Automotive Gas Oil
          </p>
        </div>

        <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
          AGO
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-medium text-gray-700">Litres Sold:</span>{" "}
          {summary.AGO.litres.toLocaleString()} L
        </p>
        <p>
          <span className="font-medium text-gray-700">Revenue:</span>{" "}
          {formatCurrency(summary.AGO.revenue)}
        </p>
        <p>
          <span className="font-medium text-gray-700">Expenses:</span>{" "}
          {formatCurrency(summary.AGO.expenses)}
        </p>
      </div>

      <div
        className={`mt-6 text-2xl font-bold ${
          summary.AGO.netProfit >= 0
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {formatCurrency(summary.AGO.netProfit)}
        <span className="text-sm font-medium ml-2 text-gray-400">
          Net Profit
        </span>
      </div>
    </div>

    <div className="bg-orange-50 p-6 rounded-2xl">

<h3 className="font-bold mb-2">
Products Revenue
</h3>

<p className="text-2xl font-bold text-orange-600">

{formatCurrency(summary.products.revenue)}

</p>

</div>

<div className="bg-pink-50 p-6 rounded-2xl">

<h3 className="font-bold mb-2">
Other Income
</h3>

<p className="text-2xl font-bold text-pink-600">

{formatCurrency(summary.otherIncome)}

</p>

</div>

    {/* ================= GRAND TOTAL ================= */}
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl p-8 shadow-xl">

      <h3 className="text-lg font-semibold mb-2">
        Total Daily Performance
      </h3>

      <p className="text-sm text-indigo-200 mb-6">
        Combined PMS & AGO Net Result
      </p>

      <div
        className={`text-4xl font-extrabold ${
          summary.grandTotalProfit >= 0
            ? "text-white"
            : "text-red-200"
        }`}
      >
        {formatCurrency(summary.grandTotalProfit)}
      </div>

      <p className="text-sm mt-3 opacity-80">
        {summary.grandTotalProfit >= 0
          ? "Overall Profit"
          : "Overall Loss"}
      </p>
    </div>

  </div>
)}

  <div className="flex justify-end mt-8">

    <button
      onClick={handleGenerateSummaryPDF}
      className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-green-700 transition"
      disabled={loadingPDF}
      >
        {loadingPDF ? "Generating PDF..." : "Log Info & Generate PDF"}
    </button>

    {loadingPDF && (
        <p className="text-gray-500 text-sm mt-2">
          Please wait while your PDF is being generated.
        </p>
      )}

  </div>
        </div>
      )}

    {/* ============================================================
         PUMP CALIBRATION AUDIT
      ============================================================ */}
      {activeTab === "calibration" && (

<div className="bg-white p-6 rounded-3xl shadow-xl space-y-6">

<div className="flex gap-4">

<input
type="date"
className="border p-3 rounded-xl"
value={calibrationFrom}
onChange={e=>setCalibrationFrom(e.target.value)}
/>

<input
type="date"
className="border p-3 rounded-xl"
value={calibrationTo}
onChange={e=>setCalibrationTo(e.target.value)}
/>

<button

onClick={fetchCalibrationAudit}

className="bg-red-600 text-white px-6 rounded-xl"

>

Generate

</button>

</div>

<table className="w-full">

<thead className="bg-gray-100">

<tr>

<th className="p-3">Date</th>

<th className="p-3">Pump</th>

<th className="p-3">Litres</th>

<th className="p-3">Reason</th>

<th className="p-3">Staff</th>

</tr>

</thead>

<tbody>

{calibrationData?.length ?(

calibrationData.map((item,i)=>(

<tr
key={i}
className="border-b"
>

<td className="p-3">

{new Date(item.salesDate)
.toLocaleDateString()}

</td>

<td className="p-3">

Pump {item.pumpNumber}

</td>

<td className="p-3 text-red-600 font-semibold">

{item.calibrationLitres} L

</td>

<td className="p-3">

{item.calibrationReason}

</td>

<td className="p-3">

{item.staffName || "-"}

</td>

</tr>

))

):( 

<tr>

<td
colSpan="5"
className="text-center p-6"
>

No calibration records

</td>

</tr>

)}

</tbody>

</table>

<div className="flex justify-end mt-8">

    <button
      onClick={handleGenerateCalibrationPDF}
      className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-green-700 transition"
      disabled={loadingPDF}
      >
        {loadingPDF ? "Generating PDF..." : "Log Info & Generate PDF"}
    </button>

    {loadingPDF && (
        <p className="text-gray-500 text-sm mt-2">
          Please wait while your PDF is being generated.
        </p>
      )}

  </div>

</div>

)}

      {/* ============================================================
         AUDIT TRAIL TAB
      ============================================================ */}
      {activeTab === "audit" && (
        <div className="bg-white p-6 rounded-3xl shadow-xl space-y-6">

          <div className="flex gap-4">
            <input
              type="date"
              placeholder="Enter Sales Date (YYYY-MM-DD)"
              className="border p-3 rounded-xl w-full"
              value={auditdate}
              onChange={(e) => setAuditDate(e.target.value)}
            />
            <button
              onClick={fetchAuditTrail}
              className="bg-gray-800 text-white px-6 rounded-xl"
            >
              Check
            </button>
          </div>

          {auditData && (
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl">

              <p><strong>Sales Date:</strong> {new Date(auditData.salesDate).toLocaleDateString()}</p>
              <p><strong>Created By:</strong> {auditData.createdBy?.name}</p>
              <p><strong>Submitted By:</strong> {auditData.submittedBy?.name}</p>
              <p><strong>Approved By:</strong> {auditData.approvedBy?.name}</p>
              <p><strong>Updated By:</strong> {auditData.updatedBy?.name}</p>
              <p><strong>Update Reason:</strong> {auditData.updateReason || "-"}</p>
              <p><strong>Deleted:</strong> {auditData.deleted ? "Yes" : "No"}</p>
              <p><strong>Delete Reason:</strong> {auditData.deleteReason || "-"}</p>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
