import { useEffect,useState } from "react";
import { useSearchParams } from "react-router-dom";
import { inventoryAPI } from "../../services/inventoryService";

export default function ProductHistory(){

const [data,setData] = useState([]);

const [params] = useSearchParams();

const slot = params.get("slot");

useEffect(()=>{

fetchHistory();

},[slot]);

const fetchHistory = async()=>{

const res =
await inventoryAPI.getProductHistory({

slotNumber:slot

});

setData(res.data.history);

};

return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">

Product Slot {slot} History

</h1>

<div className="bg-white rounded-2xl shadow">

<table className="w-full">

<thead>

<tr className="border-b">

<th className="p-3">Date</th>

<th>Product</th>

<th>Quantity</th>

<th>User</th>

<th>Details</th>

</tr>

</thead>

<tbody>

{data.map((item,i)=>(

<tr key={i} className="border-b">

<td className="p-3">

{new Date(item.createdAt)
.toLocaleString()}

</td>

<td>{item.itemName}</td>

<td className="text-green-600">

{item.quantity}

</td>

<td>

{item.createdBy?.name}

</td>

<td>

{item.details}

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}