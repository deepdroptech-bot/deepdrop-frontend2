import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import {staffAPI} from "../../../services/staffService";

export default function StaffHistory(){

const {id} = useParams();

const [history,setHistory] = useState([]);

useEffect(()=>{

fetchHistory();

},[]);

const fetchHistory = async()=>{

try{

const res =
await staffAPI.getStaffHistory(id);

setHistory(res.data);

}
catch(err){

console.error(err);

}

};

return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">

Staff Activity History

</h1>

<div className="bg-white rounded-2xl shadow">

<table className="w-full">

<thead>

<tr className="border-b bg-gray-50">

<th className="p-3 text-left">
Date
</th>

<th className="text-left">
Action
</th>

<th className="text-left">
Details
</th>

<th className="text-left">
Amount
</th>

<th className="text-left">
Salary Change
</th>

<th className="text-left">
Performed By
</th>

</tr>

</thead>

<tbody>

{history.map((item,i)=>(

<tr key={i}
className="border-b hover:bg-gray-50">

<td className="p-3">

{new Date(item.createdAt)
.toLocaleString()}

</td>

<td>

<span
className={`px-2 py-1 rounded text-sm font-medium

${item.action==="BONUS_ADDED"
?"bg-green-100 text-green-700":

item.action==="DEDUCTION_ADDED"
?"bg-red-100 text-red-700":

item.action==="SALARY_PAID"
?"bg-blue-100 text-blue-700":

"bg-gray-100 text-gray-700"

}`}

>

{item.action}

</span>

</td>

<td>

{item.details || "-"}

</td>

<td>

{item.amount
? `₦${item.amount}`
: "-"}

</td>

<td>

{item.previousSalary ?

`₦${item.previousSalary}
→
₦${item.newSalary}`

:"-"}

</td>

<td>

{item.performedBy?.name}

</td>

</tr>

))}

{history.length===0 &&(

<tr>

<td
colSpan="6"
className="text-center p-6 text-gray-400"
>

No history found

</td>

</tr>

)}

</tbody>

</table>

</div>

</div>

);

}