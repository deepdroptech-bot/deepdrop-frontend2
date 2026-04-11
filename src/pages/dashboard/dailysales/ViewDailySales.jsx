import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dailySalesAPI } from "../../../services/dailySalesService";
import { pdfAPI } from "../../../services/pdfService";

export default function ViewDailySales() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);

  useEffect(() => {
    fetchSales();
  }, [id]);

  const fetchSales = async () => {
    try {
      const res = await dailySalesAPI.getById(id);
      setSales(res.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load daily sales");
      navigate("/dashboard/daily-sales");
    }
  };

   const handleDownloadPDF = async (id) => {
    try {
      setLoadingPDF(true); // Start loading

      const res = await pdfAPI.generateSalesPDF(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Daily_Sales_${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoadingPDF(false); // Stop loading
    }
  };

  // const salesId = sales._id

  const formatCurrency = (value) =>
    `₦${Number(value || 0).toLocaleString()}`;

  

  if (loading)
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl px-12 py-10 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-red-500 to-blue-600 flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-black">⏳</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Loading Daily Sales Records For Viewing
        </h2>
        <p className="text-gray-500 text-base">
          Please wait while we fetch daily sales records for viewing
        </p>
      </div>
    </div>
  );

  if (!sales)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Sales Record Not Found
          </h2>
        </div>
      </div>
    );

  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Daily Sales Report
          </h1>
          <p className="text-gray-500">
            {new Date(sales.salesDate).toDateString()}
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-bold ${
            sales.approvalStatus === "approved"
              ? "bg-green-100 text-green-600"
              : sales.approvalStatus === "submitted"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {sales.approvalStatus.toUpperCase()}
        </span>
      </div>

      {/* ================= PMS & AGO ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PMS */}
        {/* PMS */}
<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-3xl shadow-lg">

<h2 className="text-xl font-bold text-blue-800 mb-6">
PMS Sales
</h2>

{sales.PMS.priceSegments?.map((segment,index)=>{

let segmentLitres=0;

let segmentAmount=0;

sales.PMS.pumps.forEach(pump=>{

pump.sales.forEach(sale=>{

if(sale.priceIndex !== index) return;

const litres =
Math.max(
(Number(sale.closingMeter)||0)
-
(Number(sale.openingMeter)||0)
-
(Number(sale.calibrationLitres)||0)
,0);

segmentLitres += litres;

segmentAmount +=
litres*(Number(segment.pricePerLitre)||0);

});

});

return(

<div
key={index}
className="mb-6 bg-white p-5 rounded-2xl shadow space-y-4"
>

<div className="flex justify-between border-b pb-2">

<h3 className="font-bold text-blue-700">

Price Segment {index+1}

</h3>

<div className="font-semibold">

₦{Number(segment.pricePerLitre)
.toLocaleString()}/L

</div>

</div>


{/* PUMPS */}

{sales.PMS.pumps.map((pump)=>(
<div
key={pump.pumpNumber}
className="bg-gray-50 p-4 rounded-xl mb-3"
>

<p className="font-semibold text-gray-700 mb-2">

Pump {pump.pumpNumber}

</p>


{pump.sales
.filter(sale=>sale.priceIndex===index)
.map((sale,i)=>{

const litres=
Math.max(

(Number(sale.closingMeter)||0)

-

(Number(sale.openingMeter)||0)

-

(Number(sale.calibrationLitres)||0)

,0);

const amount=
litres*(Number(segment.pricePerLitre)||0);

return(

<div
key={i}
className="grid md:grid-cols-3 gap-3 text-sm mb-3"
>

<div>

Opening: {sale.openingMeter}

</div>

<div>

Closing: {sale.closingMeter}

</div>

<div>

Calibration: {sale.calibrationLitres}

</div>

<div>

Reason: {sale.calibrationReason || "-"}

</div>

<div className="font-medium text-blue-700">

Litres: {litres}

</div>

<div className="font-medium text-green-600">

Amount:
₦{amount.toLocaleString()}

</div>

</div>

);

})}

</div>

))}


{/* SEGMENT TOTAL */}

<div className="border-t pt-3 flex justify-between font-semibold">

<div>

Segment Litres:
{segmentLitres}

</div>

<div>

Segment Amount:
₦{segmentAmount.toLocaleString()}

</div>

</div>

</div>

);

})}


{/* PMS TOTALS */}

<div className="bg-blue-200 p-5 rounded-xl space-y-2">

<p>

Total PMS Amount:

{formatCurrency(sales.PMS.totalAmount)}

</p>


<p>

Total PMS Expenses:

{formatCurrency(sales.PMS.totalExpenses)}

</p>


<p className="font-bold text-lg">

Net PMS Sales:

{formatCurrency(sales.PMS.pNetSales)}

</p>

</div>

</div>

        {/* AGO */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
          <h2 className="text-xl font-bold text-green-800 mb-4">
            AGO Sales
          </h2>

          <div className="space-y-1">
            <p>Opening: {sales.AGO?.openingMeter}</p>
            <p>Closing: {sales.AGO?.closingMeter}</p>
            <p>Calibration: {sales.AGO?.calibrationLitres}</p>
            <p>Calibration Reason: {sales.AGO?.calibrationReason}</p>
            <p className="font-medium text-green-700">
              Litres Sold: {sales.AGO?.litresSold}
            </p>
            <p>Price/Litre: {formatCurrency(sales.AGO?.pricePerLitre)}</p>
            <p>Total Amount: {formatCurrency(sales.AGO?.totalAmount)}</p>

            {/* AGO Expense Details */}
            {sales.AGO?.expenses?.map((expense, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-600">
                <span>{expense.description}</span>
                <span>{formatCurrency(expense.amount)}</span>
              </div>
            ))}

             <p>Total Expenses: {formatCurrency(sales.AGO?.totalExpenses)}</p>

            <p className="font-bold text-lg text-green-900 mt-2">
              Net Sales: {formatCurrency(sales.AGO?.ANetSales)}
            </p>
          </div>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold text-purple-700 mb-4">
          Products Sold
        </h2>

        {sales.productsSold.map((item, index) => (
          <div
            key={index}
            className="flex justify-between border-b py-2 hover:bg-gray-50 transition"
          >
            <span>
              {item.itemName} ({item.quantitySold} × {formatCurrency(item.pricePerUnit)})
            </span>
            <span className="font-semibold text-purple-700">
              {formatCurrency(item.totalAmount)}
            </span>
          </div>
        ))}

        <p className="mt-4 font-bold text-lg text-purple-900">
          Total Product Sales: {formatCurrency(sales.totalProductsSales)}
        </p>
      </div>

      {/* ================= OTHER INCOME ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Other Income
        </h2>

        {sales.otherIncome.map((item, index) => (
          <div key={index} className="flex justify-between py-1">
            <span>{item.itemName}</span>
            <span className="font-medium">
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}

        <p className="mt-4 font-bold text-lg text-indigo-900">
          Total Other Income: {formatCurrency(sales.totalOtherIncome)}
        </p>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Financial Summary</h2>
        <p>Total PMS Sales: {formatCurrency(sales.PMS.totalAmount)}</p>
        <p>Total AGO Sales: {formatCurrency(sales.AGO.totalAmount)}</p>
        <p>Total Other Income: {formatCurrency(sales.totalOtherIncome)}</p>
        <p>Total Products Sales: {formatCurrency(sales.totalProductsSales)}</p>
        <p>Total Net Sales: {formatCurrency(sales.totalSalesAmount)}</p>
        <p>Total Expenses: {formatCurrency(sales.totalExpenses)}</p>
        <p className="text-2xl font-extrabold mt-4">
          Net Sales: {formatCurrency(sales.netSales)}
        </p>
      </div>

      {/* ================= NOTES ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Notes
        </h2>

        {sales.notes.map((note, index) => (
          <p key={index} className="text-gray-600 mb-2">
            {note}
          </p>
        ))}
      </div>

      {/* ================= AUDIT ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Audit Information
        </h2>

        <p>Created By: {sales.createdBy?.name}</p>
        {sales.submittedBy && <p>Submitted By: {sales.submittedBy?.name}</p>}
        {sales.approvedBy && <p>Approved By: {sales.approvedBy?.name}</p>}
        {sales.updateReason && <p>Update Reason: {sales.updateReason}</p>}

        {sales.isLocked && (
          <span className="inline-block mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-full font-semibold">
            LOCKED
          </span>
        )}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex gap-4">
        {!sales.isLocked && (
          <button
            onClick={() => navigate(`/dashboard/daily-sales/${id}/edit`)}
            className="px-6 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition"
          >
            Edit Daily Sales
          </button>
        )}
      
        <button
        
        onClick={() => handleDownloadPDF(id)}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        disabled={loadingPDF}
      >
        {loadingPDF ? "Generating PDF..." : "Download PDF"}
      </button>

      {loadingPDF && (
        <p className="text-gray-500 text-sm mt-2">
          Please wait while your PDF is being generated.
        </p>
      )}
      </div>
    </div>
  );
}