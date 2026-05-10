import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useUploadStory } from '../../hooks/useUploadStory';
import { useAuth } from '../../hooks/useAuth';

const getAvatar = (user) => {
  return user?.avatar || user?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'Guest'}`;
};

export default function StoryCreateModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { upload, isUploading, error, success, reset } = useUploadStory();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUser) return;
    
    const wasSuccessful = await upload(currentUser, selectedFile);
    // Removed auto-close to allow for 'Broadcast Another' or manual close
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Camera className="text-cyan-400" />
              Create Story
            </h2>
            <button 
              onClick={handleClose}
              disabled={isUploading}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8">
            {!previewUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[9/16] max-h-[400px] border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all group"
              >
                <div className="p-4 bg-slate-800 rounded-2xl text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all shadow-lg">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">Capture or Select Signal</p>
                  <p className="text-slate-500 text-sm mt-1">Images or Videos (max 15MB)</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*,video/*" 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-[9/16] max-h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700 mx-auto">
                  {selectedFile.type.startsWith('video') ? (
                    <video src={previewUrl} className="w-full h-full object-cover" autoPlay muted loop />
                  ) : (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  )}
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                      <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                      <p className="text-cyan-400 font-bold tracking-widest text-xs uppercase animate-pulse">Uploading Signal...</p>
                    </div>
                  )}

                  {success && (
                    <div className="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center gap-3 backdrop-blur-md">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-4 bg-white rounded-full text-green-500 shadow-xl"
                      >
                        <CheckCircle2 size={40} />
                      </motion.div>
                      <p className="text-white font-bold tracking-widest text-sm uppercase">Transmission Successful</p>
                      <button 
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); reset(); }}
                        className="mt-4 px-6 py-2 bg-white text-green-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-green-50 transition-all shadow-lg"
                      >
                        Broadcast Another
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    disabled={isUploading}
                    className="flex-1 py-4 px-6 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all disabled:opacity-50"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || success}
                    className="flex-[2] py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    Share Moment
                  </button>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
