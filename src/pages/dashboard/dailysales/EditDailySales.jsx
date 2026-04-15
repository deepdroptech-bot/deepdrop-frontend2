import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { dailySalesAPI } from "../../../services/dailySalesService";

export default function EditDailySales(){

const {id}=useParams();

const navigate=useNavigate();

const [loading,setLoading]=useState(true);

const [loadingButton,setLoadingButton]=useState(false);

const [message,setMessage]=useState("");

const [error,setError]=useState("");

const [showPriceModal,setShowPriceModal]=useState(false);

const [newPrice,setNewPrice]=useState("");

const [segmentTotals,setSegmentTotals]=useState({});


const [form,setForm] = useState({

salesDate:"",

PMS:{
 priceSegments:[],

 pumps:[1,2,3,4].map(num=>({

  pumpNumber:num,

  sales:[{
   openingMeter:"",
   closingMeter:"",
   calibrationLitres:"",
   calibrationReason:"",
   priceIndex:0
  }]
 })),
 expenses:[{description:"",amount:""}]
},

AGO:{
 openingMeter:"",
 closingMeter:"",
 calibrationLitres:"",
 calibrationReason:"",
 pricePerLitre:"",
 expenses:[{description:"",amount:""}]
},

productsSold:[
 {itemName:"",quantitySold:"",pricePerUnit:""}
],

otherIncome:[
 {itemName:"",amount:""}
],

notes:[""],

updateReason:""

});


useEffect(()=>{

fetchSale();

},[]);



const fetchSale = async ()=>{

try{

const res = await dailySalesAPI.getById(id);

const data = res.data;

if(data.isLocked){

alert("Approved sales cannot be edited");

navigate("/dashboard/daily-sales");

return;

}

setForm({

salesDate:data.salesDate?.substring(0,10),

PMS:{
 priceSegments:data.PMS?.priceSegments || [],

 pumps:data.PMS?.pumps || [],

expenses: data.PMS?.expenses || [{ description:"", amount:"" }]
},

AGO: {
    ...form.AGO,
    ...data.AGO,
    expenses: data.AGO?.expenses || [{ description:"", amount:"" }] // ✅ FIX
  },

productsSold:data.productsSold || [],

otherIncome:data.otherIncome || [],

notes:data.notes || [""],

updateReason:""

});

setLoading(false);

}catch{

alert("Failed to load");

navigate("/dashboard/daily-sales");

}

};

const updateExpense = (type, index, field, value) => {
  const updated = { ...form };

  updated[type] = { ...form[type] };

  updated[type].expenses = [...form[type].expenses];

  updated[type].expenses[index] = {
    ...updated[type].expenses[index],
    [field]: value
  };

  setForm(updated);
};

const addExpense = (type) => {
  setForm({
    ...form,
    [type]: {
      ...form[type],
      expenses: [
        ...form[type].expenses,
        { description: "", amount: "" }
      ]
    }
  });
};

const updateProduct = (index, field, value) => {
  const updated = [...form.productsSold];

  updated[index] = {
    ...updated[index],
    [field]: value
  };

  setForm({ ...form, productsSold: updated });
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

const updateIncome = (index, field, value) => {
  const updated = [...form.otherIncome];

  updated[index] = {
    ...updated[index],
    [field]: value
  };

  setForm({ ...form, otherIncome: updated });
};

const addIncome = () => {
  setForm({
    ...form,
    otherIncome: [
      ...form.otherIncome,
      { itemName: "", amount: "" }
    ]
  });
};

const updateNote = (index, value) => {
  const updated = [...form.notes];

  updated[index] = value;

  setForm({ ...form, notes: updated });
};

const addNote = () => {
  setForm({
    ...form,
    notes: [...form.notes, ""]
  });
};


/* LIVE SEGMENT TOTALS */

const calculateSegmentTotals = (index)=>{

let totalLitres=0;

let totalAmount=0;

const price =
form.PMS.priceSegments[index]
?.pricePerLitre || 0;

form.PMS.pumps.forEach(pump=>{

const sale = pump.sales[index];

if(!sale) return;

const opening =
Number(sale.openingMeter)||0;

const closing =
Number(sale.closingMeter)||0;

const calibration =
Number(sale.calibrationLitres)||0;

const litres =
Math.max(closing - opening,0);

const net =
Math.max(litres - calibration,0);

totalLitres+=net;

totalAmount+= net * price;

});

return{

totalLitres,

totalAmount

};

};



useEffect(()=>{

const totals={};

form.PMS?.priceSegments?.forEach((segment,index)=>{

totals[index]=
calculateSegmentTotals(index);

});

setSegmentTotals(totals);

},[form]);



/* ADD PRICE SEGMENT */

const addPriceSegment = ()=>{

if(!newPrice) return;

const newIndex =
form.PMS.priceSegments.length;

const newSegments = [

...form.PMS.priceSegments,

{
 pricePerLitre:Number(newPrice),
 startTime:new Date()
}

];

const newPumps =
form.PMS?.pumps.map(pump=>{

const lastSale =
pump.sales[pump.sales.length-1];

return{

...pump,

sales:[

...pump.sales,

{

openingMeter:
lastSale?.closingMeter || "",

closingMeter:"",

calibrationLitres:"",

calibrationReason:"",

priceIndex:newIndex

}

]

};

});

setForm({

...form,

PMS:{
 priceSegments:newSegments,
 pumps:newPumps
}

});

setNewPrice("");

setShowPriceModal(false);

};

const updateSale = (pumpIndex, segmentIndex, field, value) => {

const updated = {...form};

updated.PMS = {...form.PMS};

updated.PMS.pumps = [...form.PMS.pumps];

updated.PMS.pumps[pumpIndex] = {
  ...updated.PMS.pumps[pumpIndex]
};

updated.PMS.pumps[pumpIndex].sales = [
  ...updated.PMS.pumps[pumpIndex].sales
];

updated.PMS.pumps[pumpIndex].sales[segmentIndex] = {
  ...updated.PMS.pumps[pumpIndex].sales[segmentIndex],
  [field]: value
};

setForm(updated);

};

/* SUBMIT */

const handleSubmit=async(e)=>{

e.preventDefault();

setLoadingButton(true);

setError("");

if(!form.updateReason.trim()){

setError("Update reason required");

setLoadingButton(false);

return;

}

try{

const res=
await dailySalesAPI.update(id,form);

if(!res.data.success){

setError(res.data.msg);

return;

}

setMessage(res.data.msg);

setTimeout(()=>{

navigate("/dashboard/daily-sales");

},1000);

}catch(err){

console.log(err.response?.data);
console.log(err.response?.status); 

setError(
err.response?.data?.msg ||
err.response?.data?.error ||
"Update failed"
);

}
finally{

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
            Loading Daily Sales Record
          </h2>
          <p className="text-gray-500 text-base">
            Please wait while we fetch the daily sales record
          </p>
        </div>
      </div>
    );



return(
  
<div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">

<h2 className="text-3xl font-bold">
Edit Daily Sales
</h2>


<form
onSubmit={handleSubmit}
className="space-y-10"
>


{/* DATE */}

<input

type="date"

value={form.salesDate}

onChange={(e)=>

setForm({
...form,
salesDate:e.target.value
})

}

className="input-premium"

/>



{/* PRICE MODAL */}

{showPriceModal &&(

<div className="fixed inset-0 bg-black/40 flex justify-center items-center">

<div className="bg-white p-8 rounded-2xl w-96 space-y-5">

<h3 className="text-xl font-bold">

Change Price

</h3>


<input

type="number"

placeholder="New Price"

value={newPrice}

onChange={(e)=>
setNewPrice(e.target.value)
}

className="input-premium w-full"

/>


<div className="flex gap-4">

<button

type="button"

onClick={addPriceSegment}

className="bg-blue-600 text-white px-6 py-2 rounded-xl">

Confirm

</button>


<button

type="button"

onClick={()=>
setShowPriceModal(false)
}

className="bg-gray-300 px-6 py-2 rounded-xl">

Cancel

</button>

</div>

</div>

</div>

)}



{/* PMS */}

<div className="bg-blue-50 p-6 rounded-3xl space-y-6">

<h3 className="text-xl font-bold">

PMS Sales

</h3>


{form.PMS?.priceSegments?.map((segment, segmentIndex) => (

<div
  key={segmentIndex}
  className="bg-white p-6 rounded-xl space-y-6"
>

<div className="flex justify-between">

<h4 className="font-bold">
Price Segment {segmentIndex + 1}
</h4>

<div>
₦{segment.pricePerLitre}
</div>

</div>


{form.PMS?.pumps?.map((pump, pumpIndex) => {

const sale = pump.sales?.[segmentIndex];

if(!sale) return null;

return(

<div
key={pumpIndex}
className="bg-gray-50 p-4 rounded-xl space-y-4"
>

<h5>
Pump {pump.pumpNumber}
</h5>

<div className="grid md:grid-cols-2 gap-4">

<input
type="number"
placeholder="Opening"
value={sale.openingMeter || ""}
onChange={(e)=>updateSale(pumpIndex,segmentIndex,"openingMeter",e.target.value)}
className="input-premium"
/>


<input
type="number"
placeholder="Closing"
value={sale.closingMeter || ""}
onChange={(e)=>updateSale(pumpIndex,segmentIndex,"closingMeter",e.target.value)}
className="input-premium"
/>


<input
type="number"
placeholder="Calibration"
value={sale.calibrationLitres || ""}
onChange={(e)=>updateSale(pumpIndex,segmentIndex,"calibrationLitres",e.target.value)}
className="input-premium"
/>

<input
type="text"
placeholder="Reason"
value={sale.calibrationReason || ""}
onChange={(e)=>updateSale(pumpIndex,segmentIndex,"calibrationReason",e.target.value)}
className="input-premium"
/>

<div>

Litres:

{Math.max(

(Number(sale.closingMeter) || 0)
-
(Number(sale.openingMeter) || 0)
-
(Number(sale.calibrationLitres) || 0)

,0)}

</div>

</div>

</div>

)

})}


{/* SEGMENT TOTAL */}

<div className="flex justify-between bg-blue-50 p-4 rounded">

<div>
Litres:
{segmentTotals[segmentIndex]?.totalLitres || 0}
</div>

<div>
Amount:
₦{segmentTotals[segmentIndex]?.totalAmount?.toLocaleString() || 0}
</div>

</div>

</div>

))}

{/* EXPENSES */}
{(form.PMS.expenses || []).map((exp, index) => (

<div key={index} className="grid md:grid-cols-2 gap-4">

<input
type="text"
value={exp.description}
onChange={(e)=>updateExpense("PMS", index, "description", e.target.value)}
className="input-premium"
/>

<input
type="number"
value={exp.amount}
onChange={(e)=>updateExpense("PMS", index, "amount", e.target.value)}
className="input-premium"
/>

</div>

))}

<button type="button" onClick={()=>addExpense("PMS")} className="btn-secondary">
Add PMS Expense
</button>


<button

type="button"

onClick={()=>
setShowPriceModal(true)
}

className="bg-blue-600 text-white px-6 py-3 rounded-xl">

Change Price

</button>

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

          <input
            type="number"
            placeholder="Calibration Litres"
            value={form.AGO.calibrationLitres}
            onChange={(e) =>
              setForm({
                ...form,
                AGO: { ...form.AGO, calibrationLitres: e.target.value }
              })
            }
            className="input-premium"
          />

          <input
            type="text"
            placeholder="Calibration Reason"  
            value={form.AGO.calibrationReason}
            onChange={(e) =>
              setForm({
                ...form,
                AGO: { ...form.AGO, calibrationReason: e.target.value }
              })
            }
            className="input-premium"
          />
        </div>
        {(form.AGO.expenses || []).map((exp, index) => (

<div key={index} className="grid md:grid-cols-2 gap-4">

<input
type="text"
value={exp.description}
onChange={(e)=>updateExpense("AGO", index, "description", e.target.value)}
className="input-premium"
/>

<input
type="number"
value={exp.amount}
onChange={(e)=>updateExpense("AGO", index, "amount", e.target.value)}
className="input-premium"
/>

</div>

))}

<button type="button" onClick={()=>addExpense("AGO")} className="btn-secondary">
Add AGO Expense
</button>
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
value={item.itemName}
onChange={(e)=>updateProduct(index,"itemName",e.target.value)}
className="input-premium"
/>

<input
type="number"
value={item.quantitySold}
onChange={(e)=>updateProduct(index,"quantitySold",e.target.value)}
className="input-premium"
/>

<input
type="number"
value={item.pricePerUnit}
onChange={(e)=>updateProduct(index,"pricePerUnit",e.target.value)}
className="input-premium"
/>

</div>

))}

<button type="button" onClick={addProduct} className="btn-secondary">
Add Product
</button>
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
value={item.itemName}
onChange={(e)=>updateIncome(index,"itemName",e.target.value)}
className="input-premium"
/>

<input
type="number"
value={item.amount}
onChange={(e)=>updateIncome(index,"amount",e.target.value)}
className="input-premium"
/>

</div>

))}

<button type="button" onClick={addIncome} className="btn-secondary">
Add Income
</button>
      </div>

{form.notes.map((note, index) => (

<input
key={index}
value={note}
onChange={(e)=>updateNote(index,e.target.value)}
placeholder={`Note ${index + 1}`}
className="input-premium w-full"
/>

))}

<button type="button" onClick={addNote} className="btn-secondary">
Add Note
</button>

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
          className="input-premium min-h-[80px]"
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
