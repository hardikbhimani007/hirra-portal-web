import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { CreateCategory, UpdateCategories } from '../services/adminService';
import { toast } from 'react-toastify';

export default function TradeSkillsModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({ trade: '', skills: [] });
  const [skillInput, setSkillInput] = useState('');
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          trade: initialData.trade || '',
          skills: initialData.skills ? initialData.skills.split(',').map(s => s.trim()) : []
        });
      } else {
        setFormData({ trade: '', skills: [] });
      }
      setSkillInput('');
    }
  }, [isOpen, initialData]);

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;

    const newSkills = skillInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s && !formData.skills.includes(s));

    if (newSkills.length) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, ...newSkills]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  };

  const handleSubmit = async () => {
    let updatedSkills = [...formData.skills];
    if (skillInput.trim()) {
      const newSkills = skillInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s && !updatedSkills.includes(s));

      if (newSkills.length) {
        updatedSkills = [...updatedSkills, ...newSkills];
      }
      setSkillInput('');
    }

    if (!formData.trade.trim()) return toast.error('Trade name is required!');
    if (updatedSkills.length === 0) return toast.error('At least one skill is required!');

    setLoading(true);
    try {
      const skillsString = updatedSkills.join(',');

      if (isEditMode) {
        await UpdateCategories(initialData.id, formData.trade, skillsString);
        toast.success('Category updated successfully!');
      } else {
        await CreateCategory(formData.trade, skillsString);
        toast.success('Category created successfully!');
      }

      setFormData(prev => ({ ...prev, skills: updatedSkills }));

      onSubmit?.();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ trade: '', skills: [] });
    setSkillInput('');
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    } else if (e.key === 'Backspace' && skillInput === '' && formData.skills.length) {
      handleRemoveSkill(formData.skills[formData.skills.length - 1]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40" onClick={handleClose}>
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Trade & Skills' : 'Add Trade & Skills'}
          </h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">Trade</label>
            <input
              type="text"
              placeholder="Enter trade name"
              value={formData.trade}
              onChange={(e) => setFormData(prev => ({ ...prev, trade: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">Skills</label>
            <div className="flex flex-wrap items-center gap-2 px-2 py-2 border border-gray-300 rounded-lg" onClick={() => inputRef.current.focus()}>
              {formData.skills.map((skill, idx) => (
                <span key={idx} className="bg-[#FF5800] text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                  {skill}
                  <X onClick={() => handleRemoveSkill(skill)} className="w-4 h-4 cursor-pointer" />
                </span>
              ))}
              <input
                ref={inputRef}
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type skill and press Enter"
                className="flex-1 min-w-[120px] px-2 py-1 outline-none no-global-style"
              />
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 w-full">
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-10 py-3 text-white rounded-lg font-medium cursor-pointer transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#152A45] hover:bg-slate-900'}`}
            >
              {isEditMode ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
