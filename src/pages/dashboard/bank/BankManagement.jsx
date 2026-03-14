import { useEffect, useState } from "react";
import { bankAPI } from "../../../services/bankService";
import Permissions from "../../../components/Permission ";

export default function BankManagement(){

const [bank,setBank] = useState(null);
const [loading,setLoading] = useState(true);
const [submitting,setSubmitting] = useState(false);
const [history,setHistory] = useState([]);
const [historyLoading,setHistoryLoading] = useState(true);

const [form,setForm] = useState({

type:"PMS",
amount:"",
narration:""

});

const LOW_BALANCE_THRESHOLD = 100000;

useEffect(()=>{

fetchData();

},[]);

const fetchHistory = async ()=>{

try{

const res = await bankAPI.getBankHistory();

setHistory(res.data.history || []);

}catch{

alert("Failed to fetch history");

}

};

const fetchData = async()=>{

setLoading(true);

try{

await Promise.all([

await fetchBank(),
fetchHistory()

]);

}
finally{
alert("Failed to fetch bank data");
setLoading(false);

}
};


const fetchBank = async()=>{

try{

const res = await bankAPI.getBankBalance();

setBank(res.data);

}catch{

alert("Failed to fetch bank balance");

}

};


const handleSubmit = async(e)=>{

e.preventDefault();

if(!form.amount || !form.narration){

alert("Amount and narration required");

return;

}


setSubmitting(true);

try{

await bankAPI.addBalance(form);

setForm({

type:"PMS",
amount:"",
narration:""

});

fetchBank();

}catch{

alert("Failed to add balance");

}

setSubmitting(false);

};


const formatCurrency = (val)=>

`₦${Number(val || 0).toLocaleString()}`;


const formatDate = (date)=>

new Date(date).toLocaleString();


if(loading)

return(

<div className="min-h-[60vh] flex items-center justify-center">

<div className="bg-white/70 backdrop-blur-xl border rounded-3xl px-12 py-10 shadow-2xl text-center">

<div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">

<span className="text-white text-2xl">⏳</span>

</div>

<h2 className="text-2xl font-bold">

Loading Bank Details

</h2>

<p className="text-gray-500">

Please wait while we fetch Bank Data

</p>

</div>

</div>
);

const totalBalance =

(bank?.PMS || 0) +
(bank?.AGO || 0) +
(bank?.products || 0) +
(bank?.otherIncome || 0);


return(

<div className="p-6 space-y-8">

{/* HEADER */}

<div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-3xl shadow-xl">

<h1 className="text-3xl font-bold">

Bank Management

</h1>

<p className="text-gray-300 mt-2">

Financial overview and transaction tracking

</p>

</div>


{/* TOTAL */}

<div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow">

<h2 className="font-semibold">

Total Bank Balance

</h2>

<p className="text-4xl font-bold mt-2">

{formatCurrency(totalBalance)}

</p>

</div>


{/* ALERT */}

{totalBalance < LOW_BALANCE_THRESHOLD &&(

<div className="bg-red-600 text-white p-4 rounded-2xl">

⚠ Bank balance below healthy level

</div>

)}


{/* CATEGORY */}

<div className="grid md:grid-cols-4 gap-6">

{[

{label:"PMS",value:bank.PMS},

{label:"AGO",value:bank.AGO},

{label:"Products",value:bank.products},

{label:"Other Income",value:bank.otherIncome}

].map(item=>{

const low = item.value < LOW_BALANCE_THRESHOLD;

return(

<div

key={item.label}

className={`p-6 rounded-2xl shadow

${low ?

"bg-red-50 border border-red-400":

"bg-white"

}`}

>

<h3 className="font-semibold text-gray-600">

{item.label}

</h3>

<p className="text-2xl font-bold mt-2">

{formatCurrency(item.value)}

</p>

{low &&(

<p className="text-red-600 text-sm mt-2">

Low balance

</p>

)}

</div>

);

})}

</div>


<Permissions permission="AD_AC">

{/* FORM */}

<div className="bg-white p-6 rounded-3xl shadow">

<h2 className="text-xl font-bold mb-4">

Add Bank Entry

</h2>

<form

onSubmit={handleSubmit}

className="grid md:grid-cols-4 gap-4"

>

<select

className="border rounded-xl p-3"

value={form.type}

onChange={(e)=>

setForm({

...form,

type:e.target.value

})

}

>

<option value="PMS">PMS</option>

<option value="AGO">AGO</option>

<option value="products">Products</option>

<option value="otherIncome">

Other Income

</option>

</select>


<input

type="number"

placeholder="Amount"

className="border rounded-xl p-3"

value={form.amount}

onChange={(e)=>

setForm({

...form,

amount:e.target.value

})

}

/>


<input

placeholder="Narration"

className="border rounded-xl p-3"

value={form.narration}

onChange={(e)=>

setForm({

...form,

narration:e.target.value

})

}

/>


<button

disabled={submitting}

className="bg-indigo-600 text-white rounded-xl p-3 font-semibold hover:bg-indigo-700"

>

{submitting ?

"Adding..." :

"Add Entry"

}

</button>

</form>

</div>

</Permissions>


{/* HISTORY */}

<div className="bg-white p-6 rounded-3xl shadow">

<h2 className="text-xl font-bold mb-4">

Transaction History

</h2>

<div className="overflow-x-auto">

<table className="w-full text-sm">

<thead>

<tr className="border-b text-gray-600">

<th className="p-3 text-left">

Date

</th>

<th className="p-3 text-left">

Category

</th>

<th className="p-3 text-left">

Amount

</th>

<th className="p-3 text-left">

Narration

</th>

<th className="p-3 text-left">

Added By

</th>

</tr>

</thead>

<tbody>

{historyLoading ?(

<tr>

<td colSpan="5"
className="text-center p-6">

Loading history...

</td>

</tr>

):

history.slice(0,20).length ?(

history.map((item,i)=>(

<tr
key={i}
className="border-b hover:bg-gray-50"
>

<td className="p-3">

{formatDate(item.addedAt)}

</td>

<td className={`p-3 font-semibold ${
item.type === "PMS"
? "text-blue-600"
: item.type === "AGO"
? "text-green-600"
: "text-purple-600"
}`} >
</td>

<td className="p-3 text-green-600 font-semibold">

{formatCurrency(item.amount)}

</td>

<td className="p-3">

{item.narration}

</td>

<td className="p-3">

{item.addedBy?.name || "—"}

</td>

</tr>

))

):( 

<tr>

<td
colSpan="5"
className="text-center p-6 text-gray-500"
>

No transactions yet

</td>

</tr>

)}

</tbody>

</table>

</div>

</div>

</div>

);

}