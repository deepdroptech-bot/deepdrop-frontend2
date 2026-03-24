import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { inventoryAPI } from "../../../services/inventoryService";

export default function FuelHistory() {
  const [data, setData] = useState([]);
  const [params] = useSearchParams();

  const type = params.get("type");
  const well = params.get("well");

  useEffect(() => {
    fetchHistory();
  }, [type, well]);

  const fetchHistory = async () => {
    try {
      const res = await inventoryAPI.getFuelHistory({ type, well });

      // extract the array safely
      const history = res.data.history || [];
      setData(history);
    } catch (error) {
      console.error("Failed to fetch fuel history:", error);
      setData([]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Fuel History {type}</h1>

      <div className="bg-white rounded-2xl shadow">
        <table className="w-full table-auto border-collapse shadow rounded-xl overflow-hidden">

  <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
    <tr className="border-b text-center">

      <th className="p-3">Date</th>

      <th className="p-3">Type</th>

      <th className="p-3">Well</th>

      <th className="p-3">Quantity</th>

      <th className="p-3">User</th>

      <th className="p-3">Details</th>

    </tr>
  </thead>

  <tbody>

    {data.map((item, i) => (

      <tr key={i} className="border-b text-center hover:bg-gray-50">

        <td className="p-3">

          {new Date(item.addedAt).toLocaleString()}

        </td>

        <td className="p-3">

          {item.type}

        </td>

        <td className="p-3">

          {item.wellNumber || "-"}

        </td>

        <td className="p-3 text-green-600 font-semibold">

          {item.Quantity}

        </td>

        <td className="p-3">

          {item.addedBy?.name || "-"}

        </td>

        <td className="p-3">

          {item.details || "-"}

        </td>

      </tr>

    ))}

    {data.length === 0 && (

      <tr>

        <td
          colSpan={6}
          className="text-center p-6 text-gray-500"
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