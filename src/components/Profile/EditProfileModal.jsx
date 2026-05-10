import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Camera, User, AtSign, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditProfileModal({ isOpen, onClose, profile, onSave, isSaving }) {
  const [formData, setFormData] = useState(profile);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(profile);
      setAvatarFile(null);
      setCoverFile(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, [field]: imageUrl }));
      
      if (field === 'avatar') {
        setAvatarFile(file);
      } else if (field === 'coverImage') {
        setCoverFile(file);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, { avatarFile, coverFile });
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           transition={{ type: "spring", damping: 25, stiffness: 300 }}
           className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-xl font-bold text-white tracking-wide">Edit Profile</h2>
            <button 
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <form id="editProfileForm" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Avatar Preview */}
              <div className="flex flex-col items-center justify-center relative mb-4">
                <div className="relative group overflow-hidden rounded-full cursor-pointer border-2 border-slate-700 hover:border-cyan-500 transition-colors shadow-lg">
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-10 pointer-events-none">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <img src={formData.avatar} alt="Avatar Preview" className="w-24 h-24 object-cover" />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
                    title="Change Avatar"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-widest">Tap image to change avatar</p>
              </div>

              {/* Cover Image Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Cover Image</label>
                
                {/* Cover Preview Box */}
                <div className="relative w-full h-32 sm:h-40 rounded-xl border-2 border-slate-800 overflow-hidden group bg-slate-950">
                  <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Change Cover
                    </div>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'coverImage')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Change Cover Image"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Display Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                <div className="relative flex items-center">
                  <AtSign className="absolute left-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Bio</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none custom-scrollbar text-sm"
                  ></textarea>
                </div>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md flex justify-end gap-3 rounded-b-3xl">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              form="editProfileForm"
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-full bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none min-w-[140px]"
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
