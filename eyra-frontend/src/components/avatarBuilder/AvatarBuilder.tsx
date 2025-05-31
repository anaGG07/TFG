import React, { useState, useEffect } from 'react';
import AvatarPreview from './AvatarPreview';
import { getRandomAvatarConfig } from './randomAvatar';
import { AvatarConfig, defaultAvatarConfig } from '../../types/avatar';
import { User, Eye, Smile, Palette, Scissors, Glasses, Gem, Star, Shirt, PaintBucket, Sparkles } from 'lucide-react';



interface AvatarBuilderProps {
  onChange?: (config: AvatarConfig) => void;
  initialConfig?: AvatarConfig;
  showPreview?: boolean;
}

const AvatarBuilder: React.FC<AvatarBuilderProps> = ({ onChange, initialConfig, showPreview = true }) => {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig || defaultAvatarConfig);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const handleChange = (key: keyof AvatarConfig, value: string) => { 
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    if (onChange) onChange(newConfig);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 justify-center">
      {/* Tarjeta 1: Rostro */}
      <div className="flex-1 min-w-[260px] max-w-md bg-[#f5ede6] rounded-2xl shadow-neomorphic p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <User size={22} stroke="#C62328" />
          <span className="font-bold text-lg text-[#7a2323]">Rostro</span>
        </div>
        <div className="flex items-center gap-2">
          <Palette size={18} stroke="#C62328" className="cursor-help" aria-label="Color de piel" />
          <label className="font-semibold text-[#7a2323]">Color de piel:</label>
          <input type="color" value={config.skinColor} onChange={e => handleChange('skinColor', e.target.value)} className="rounded-full w-8 h-8 border-none shadow-neomorphic ml-2" />
        </div>
        <div className="flex items-center gap-2">
          <Eye size={18} stroke="#C62328" className="cursor-help" aria-label="Ojos" />
          <label className="font-semibold text-[#7a2323]">Ojos:</label>
          <select value={config.eyes} onChange={e => handleChange('eyes', e.target.value)} className="flex-1 rounded-xl py-2 px-3 shadow-neomorphic ml-2">
            <option value="happy">Felices</option>
            <option value="normal">Normales</option>
            <option value="sleepy">Soñolientos</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={18} stroke="#C62328" className="cursor-help" aria-label="Cejas" />
          <label className="font-semibold text-[#7a2323]">Cejas:</label>
          <select value={config.eyebrows} onChange={e => handleChange('eyebrows', e.target.value)} className="flex-1 rounded-xl py-2 px-3 shadow-neomorphic ml-2">
            <option value="up">Arriba</option>
            <option value="down">Abajo</option>
            <option value="angry">Enfadadas</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Smile size={18} stroke="#C62328" className="cursor-help" aria-label="Boca" />
          <label className="font-semibold text-[#7a2323]">Boca:</label>
          <select value={config.mouth} onChange={e => handleChange('mouth', e.target.value)} className="flex-1 rounded-xl py-2 px-3 shadow-neomorphic ml-2">
            <option value="smile">Sonrisa</option>
            <option value="open">Abierta</option>
            <option value="sad">Triste</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={18} stroke="#C62328" className="cursor-help" aria-label="Vello facial" />
          <label className="font-semibold text-[#7a2323]">Vello facial:</label>
          <select value={config.facialHair} onChange={e => handleChange('facialHair', e.target.value)} className="flex-1 rounded-xl py-2 px-3 shadow-neomorphic ml-2">
            <option value="none">Ninguno</option>
            <option value="mustache">Bigote</option>
            <option value="beard">Barba</option>
          </select>
        </div>
      </div>
      {/* Tarjeta 2: Cabello y complementos */}
      <div className="flex-1 min-w-[260px] max-w-md bg-[#f5ede6] rounded-2xl shadow-neomorphic p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Scissors size={22} stroke="#C62328" />
          <span className="font-bold text-lg text-[#7a2323]">Cabello y complementos</span>
        </div>
        <div className="flex items-center gap-2">
          <Scissors size={18} stroke="#C62328" className="cursor-help" aria-label="Estilo de pelo" />
          <label className="font-semibold text-[#7a2323]">Estilo de pelo:</label>
          <select value={config.hairStyle} onChange={e => handleChange('hairStyle', e.target.value)} className="rounded-xl py-2 px-3 shadow-neomorphic ml-2">
            <option value="short">Corto</option>
            <option value="long">Largo</option>
            <option value="curly">Rizado</option>
          </select>
          <Palette size={18} stroke="#C62328" className="ml-2 cursor-help" aria-label="Color de pelo" />
          <input type="color" value={config.hairColor} onChange={e => handleChange('hairColor', e.target.value)} className="rounded-full w-8 h-8 border-none shadow-neomorphic ml-2" />
        </div>
        <div className="flex items-center gap-2">
          <Shirt size={18} stroke="#C62328" className="cursor-help" aria-label="Ropa" />
          <label className="font-semibold text-[#7a2323]">Ropa:</label>
          <select value={config.clothes} onChange={e => handleChange('clothes', e.target.value)} className="rounded-xl py-2 px-3 shadow-neomorphic ml-2">
            <option value="tshirt">Camiseta</option>
            <option value="hoodie">Sudadera</option>
            <option value="dress">Vestido</option>
          </select>
          <Palette size={18} stroke="#C62328" className="ml-2 cursor-help" aria-label="Color de ropa" />
          <input type="color" value={config.fabricColor} onChange={e => handleChange('fabricColor', e.target.value)} className="rounded-full w-8 h-8 border-none shadow-neomorphic ml-2" />
        </div>
        <div className="flex items-center gap-2">
          <Glasses size={18} stroke="#C62328" className="cursor-help" aria-label="Gafas" />
          <label className="font-semibold text-[#7a2323]">Gafas:</label>
          <select value={config.glasses} onChange={e => handleChange('glasses', e.target.value)} className="rounded-xl py-2 px-3 shadow-neomorphic ml-2">
            <option value="none">Ningunas</option>
            <option value="round">Redondas</option>
            <option value="square">Cuadradas</option>
          </select>
          <label className="ml-2 font-semibold text-[#7a2323]">Opacidad:</label>
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.05} 
            value={parseFloat(config.glassOpacity) || 0.7}
            onChange={e => handleChange('glassOpacity', e.target.value)}
            className="ml-2 align-middle"
          />
        </div>
        <div className="flex items-center gap-2">
          <Gem size={18} stroke="#C62328" className="cursor-help" aria-label="Accesorios" />
          <label className="font-semibold text-[#7a2323]">Accesorios:</label>
          <select value={config.accessories} onChange={e => handleChange('accessories', e.target.value)} className="rounded-xl py-2 px-3 shadow-neomorphic ml-2">
            <option value="none">Ninguno</option>
            <option value="earring">Pendiente</option>
            <option value="necklace">Collar</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Star size={18} stroke="#C62328" className="cursor-help" aria-label="Tatuajes" />
          <label className="font-semibold text-[#7a2323]">Tatuajes:</label>
          <select value={config.tattoos} onChange={e => handleChange('tattoos', e.target.value)} className="rounded-xl py-2 px-3 shadow-neomorphic ml-2">
            <option value="none">Ninguno</option>
            <option value="star">Estrella</option>
            <option value="heart">Corazón</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <PaintBucket size={18} stroke="#C62328" className="cursor-help" aria-label="Color de fondo" />
          <label className="font-semibold text-[#7a2323]">Color de fondo:</label>
          <input type="color" value={config.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} className="rounded-full w-8 h-8 border-none shadow-neomorphic ml-2" />
        </div>
      </div>
    </div>
  );
};

export default AvatarBuilder;
