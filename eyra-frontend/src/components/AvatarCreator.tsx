import React, { useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';
import { motion, AnimatePresence } from 'framer-motion';

interface AvatarCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
}

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ isOpen, onClose, onSelect }) => {
  const [seed, setSeed] = useState(Math.random().toString());
  const [backgroundColor, setBackgroundColor] = useState('#C62328');
  const [avatarUrl, setAvatarUrl] = useState('');

  const generateAvatar = async () => {
    const avatar = await createAvatar(bottts, {
      seed,
      backgroundColor: [backgroundColor],
    });
    const svg = await avatar.toDataUri();
    setAvatarUrl(svg);
  };

  React.useEffect(() => {
    generateAvatar();
  }, [seed, backgroundColor]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: 'rgba(231, 224, 213, 0.7)' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" onClick={onClose} />
        {/* Modal */}
        <motion.div
          className="relative bg-[#fff] rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-4"
          initial={{ scale: 0.95, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#C62328] hover:text-[#7a2323] transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="font-serif text-2xl font-bold text-[#7a2323] mb-6 text-center">
            Crear tu avatar
          </h2>

          <div className="flex flex-col items-center gap-6">
            {/* Vista previa */}
            <div className="w-48 h-48 rounded-full overflow-hidden bg-[#C62328] flex items-center justify-center">
              {avatarUrl && (
                <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Controles */}
            <div className="w-full space-y-4">
              {/* Color de fondo */}
              <div>
                <label className="block text-[#7a2323] font-medium mb-2">Color de fondo</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Generar nuevo */}
              <button
                type="button"
                className="w-full px-4 py-2 bg-[#C62328] text-white rounded-lg hover:bg-[#7a2323] transition-colors"
                onClick={() => setSeed(Math.random().toString())}
              >
                Generar nuevo
              </button>

              {/* Seleccionar */}
              <button
                type="button"
                className="w-full px-4 py-2 bg-[#5b0108] text-white rounded-lg hover:bg-[#7a2323] transition-colors"
                onClick={() => onSelect(avatarUrl)}
              >
                Seleccionar avatar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AvatarCreator; 