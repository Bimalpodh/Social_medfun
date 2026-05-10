import { useState, useEffect, useCallback } from 'react';

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setModalData(null), 300); // Clear data after animation sequence perfectly
    document.body.style.overflow = 'auto'; // Restore background scrolling
  }, []);

  // Handle ESC key listener globally when modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  return { isOpen, modalData, openModal, closeModal };
}
