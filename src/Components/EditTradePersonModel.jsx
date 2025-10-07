import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Edit } from 'lucide-react'
import { toast } from 'react-toastify'
import { UpdateTradeperson } from '../services/adminService'

const EditTradepersonModal = ({ isOpen, onClose, tradeperson = {}, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profile_pictures: ''
  })
  const [imagePreview, setImagePreview] = useState('')
  const [imageBase64, setImageBase64] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tradeperson && tradeperson.id) {
      setFormData({
        name: tradeperson.name || '',
        email: tradeperson.email || '',
        phone: tradeperson.phone || '',
        profile_pictures: tradeperson.profile || ''
      })
      setImagePreview(tradeperson.profile || '')
      setImageBase64('')
    }
  }, [tradeperson])

  if (!isOpen) return null

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setImageBase64(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (formData.name.length > 50) {
      toast.error("Name can't exceed 50 characters");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    if (formData.email.length > 100) {
      toast.error("Email can't exceed 100 characters");
      return;
    }

    if (!tradeperson?.id) {
      toast.error("Invalid tradeperson data");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        id: tradeperson.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        profile_pictures: imageBase64 || formData.profile_pictures
      };

      const res = await UpdateTradeperson(payload);

      if (res.success) {
        toast.success("Tradeperson updated successfully");
        onSave({ ...formData, id: tradeperson.id, profile: imageBase64 || formData.profile_pictures });
        onClose();
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#1A202C] flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Tradeperson
          </h2>
          <button
            onClick={onClose}
            className="text-[#718096] hover:text-[#1A202C] transition-colors"
          >
            <FaTimes size={20} className="cursor-pointer" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#E2E8F0]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl border-2 border-[#E2E8F0]">
                  ?
                </div>
              )}
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-[#152A45] text-white p-2 rounded-full cursor-pointer hover:bg-[#1e3a5f] transition-colors shadow-lg"
              >
                <Edit className="w-4 h-4" />
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-[#718096]">Click the icon to change profile picture</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[#1A202C] mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              maxLength={50}
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#152A45]"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#1A202C] mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={100}
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#152A45]"
              placeholder="Enter email"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-[#E2E8F0] text-[#718096] cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 px-6 py-2 text-white rounded-lg cursor-pointer transition-colors ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#152A45] hover:bg-[#1e3a5f]"
                }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditTradepersonModal
