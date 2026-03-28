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


const [form,setForm]=useState({

salesDate:"",

PMS:{
priceSegments:[
{
pricePerLitre:"",

pumps:[1,2,3,4].map(num=>({

pumpNumber:num,

sales:[{

openingMeter:"",

closingMeter:"",

calibrationLitres:"",

calibrationReason:""

}]

}))
}
]
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



const fetchSale=async()=>{

try{

const res=await dailySalesAPI.getById(id);

if(res.data.isLocked){

alert("Approved sales cannot be edited");

navigate("/dashboard/daily-sales");

return;

}

setForm({

...res.data,

salesDate:
res.data.salesDate?.substring(0,10),

updateReason:""

});

setLoading(false);

}catch{

alert("Failed to load record");

navigate("/dashboard/daily-sales");

}

};



/* LIVE SEGMENT TOTALS */

const calculateSegmentTotals=(segment)=>{

let totalLitres=0;

let totalAmount=0;

segment.pumps.forEach(pump=>{

pump.sales.forEach(sale=>{

const opening=
Number(sale.openingMeter)||0;

const closing=
Number(sale.closingMeter)||0;

const calibration=
Number(sale.calibrationLitres)||0;

const litres=
Math.max(closing-opening,0);

const net=
Math.max(litres-calibration,0);

const amount=
net*(Number(segment.pricePerLitre)||0);

totalLitres+=net;

totalAmount+=amount;

});

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
calculateSegmentTotals(segment);

});

setSegmentTotals(totals);

},[form]);



/* ADD PRICE SEGMENT */

const addPriceSegment=()=>{

if(!newPrice) return;

const lastSegment=
form.PMS.priceSegments[
form.PMS.priceSegments.length-1
];

const newSegment={

pricePerLitre:newPrice,

pumps:[1,2,3,4].map(num=>{

const lastPump=
lastSegment.pumps.find(
p=>p.pumpNumber===num
);

const lastSale=
lastPump.sales[
lastPump.sales.length-1
];

return{

pumpNumber:num,

sales:[{

openingMeter:
lastSale?.closingMeter||"",

closingMeter:"",

calibrationLitres:"",

calibrationReason:""

}]

};

})

};

setForm({

...form,

PMS:{

...form.PMS,

priceSegments:[
...form.PMS.priceSegments,
newSegment
]

}

});

setNewPrice("");

setShowPriceModal(false);

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

setError(
err.response?.data?.msg ||
"Update failed"
);

}
finally{

setLoadingButton(false);

}

};



if(loading)

return <div>Loading...</div>;



return(

<div className="max-w-6xl mx-auto space-y-10">

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


{form.PMS.priceSegments.map(
(segment,segmentIndex)=>(
<div

key={segmentIndex}

className={`bg-white p-6 rounded-xl space-y-6

${segmentIndex !==
form.PMS.priceSegments.length-1

?
"opacity-60 pointer-events-none"
:
""
}

`}

>


<div className="flex justify-between">

<h4 className="font-bold">

Price Segment {segmentIndex+1}

</h4>


<div>

₦{segment.pricePerLitre}

</div>

</div>



{segment.pumps.map(
(pump,pumpIndex)=>(
<div
key={pumpIndex}
className="bg-gray-50 p-4 rounded-xl space-y-4"
>

<h5>

Pump {pump.pumpNumber}

</h5>



{pump.sales.map(
(sale,saleIndex)=>(
<div
key={saleIndex}
className="grid md:grid-cols-2 gap-4"
>

<input

type="number"

placeholder="Opening"

value={sale.openingMeter}

onChange={(e)=>{

const updated=
{...form};

updated.PMS
.priceSegments
[segmentIndex]

.pumps[pumpIndex]

.sales[saleIndex]

.openingMeter=
e.target.value;

setForm(updated);

}}

className="input-premium"

/>


<input

type="number"

placeholder="Closing"

value={sale.closingMeter}

onChange={(e)=>{

const updated=
{...form};

updated.PMS
.priceSegments
[segmentIndex]

.pumps[pumpIndex]

.sales[saleIndex]

.closingMeter=
e.target.value;

setForm(updated);

}}

className="input-premium"

/>


<input

type="number"

placeholder="Calibration"

value={sale.calibrationLitres}

onChange={(e)=>{

const updated=
{...form};

updated.PMS
.priceSegments
[segmentIndex]

.pumps[pumpIndex]

.sales[saleIndex]

.calibrationLitres=
e.target.value;

setForm(updated);

}}

className="input-premium"

/>


<input

type="text"

placeholder="Reason"

value={sale.calibrationReason}

onChange={(e)=>{

const updated=
{...form};

updated.PMS
.priceSegments
[segmentIndex]

.pumps[pumpIndex]

.sales[saleIndex]

.calibrationReason=
e.target.value;

setForm(updated);

}}

className="input-premium"

/>



<div>

Litres:

{Math.max(

(Number(sale.closingMeter)||0)

-

(Number(sale.openingMeter)||0)

-

(Number(sale.calibrationLitres)||0)

,0)}

</div>

</div>

))

}

</div>

))

}


{/* SEGMENT TOTAL */}

<div className="flex justify-between bg-blue-50 p-4 rounded">

<div>

Litres:

{segmentTotals[segmentIndex]?.totalLitres||0}

</div>


<div>

Amount:

₦
{segmentTotals[segmentIndex]
?.totalAmount?.toLocaleString()||0}

</div>

</div>


</div>

))

}



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
