import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function EditSubcontractorModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: ""
  });

  const [loading, setLoading] = useState(false);

  const isEditMode = initialData !== null;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          location: initialData.location || ""
        });
      } else {
        setFormData({ name: "", email: "", phone: "", location: "" });
      }
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    const phoneRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      toast.error("Enter a valid email");
      return;
    }

    // if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
    //   toast.error("Phone must contain only numbers");
    //   return;
    // }

    // if (!formData.location.trim()) {
    //   toast.error("Address is required");
    //   return;
    // }

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", phone: "", location: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Subcontractor" : "Add Subcontractor"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              maxLength={30}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Phone
            </label>
            <input
              type="text"
              placeholder="Enter phone"
              value={formData.phone}
              onChange={(e) =>
                handleInputChange("phone", e.target.value.replace(/\D/g, ""))
              }
              maxLength={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter address"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              maxLength={140}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400"
              required
            />
          </div>
        </div>

        <div className="p-6 pt-0 w-full">
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-10 py-3 rounded-lg font-medium cursor-pointer transition-colors ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#152A45] text-white hover:bg-slate-900"
                }`}
            >
              {loading ? "Saving..." : isEditMode ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
