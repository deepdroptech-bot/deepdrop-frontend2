// components/ResponseModal.jsx
export default function ResponseModal({ isOpen, onClose, type, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[350px] text-center">
        
        <h2 className={`text-xl font-bold mb-3 ${
          type === "success" ? "text-green-600" : "text-red-600"
        }`}>
          {type === "success" ? "Success" : "Error"}
        </h2>

        <p className="mb-4">{message}</p>

        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          OK
        </button>
      </div>
    </div>
  );
}