export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
      <h3 className="text-blue-700 font-semibold mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}
