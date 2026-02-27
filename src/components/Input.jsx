export default function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 
                   focus:ring-2 focus:ring-blue-500 outline-none transition"
      />
    </div>
  );
}
