import { useEffect,useState } from "react";
import { useSearchParams } from "react-router-dom";
import { inventoryAPI } from "../../services/inventoryService";

export default function FuelHistory(){

const [data,setData] = useState([]);

const [params] = useSearchParams();

const type = params.get("type");

const well = params.get("well");

useEffect(()=>{

fetchHistory();

},[type,well]);

const fetchHistory = async()=>{

const res = await inventoryAPI.getFuelHistory({

type

});

let history = res.data.history;

if(well){

history = history.filter(
item=> item.wellNumber == well
);

}

setData(history);

};

return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">

Fuel History {type}

</h1>

<div className="bg-white rounded-2xl shadow">

<table className="w-full">

<thead>

<tr className="border-b">

<th className="p-3">Date</th>

<th>Type</th>

<th>Well</th>

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

<td>{item.type}</td>

<td>

{item.wellNumber || "-"}

</td>

<td className="text-green-600">

{item.Quantity}

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