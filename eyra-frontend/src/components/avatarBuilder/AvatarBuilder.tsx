import React, { useState, useEffect } from 'react';
import AvatarPreview from './AvatarPreview';
import { getRandomAvatarConfig } from './randomAvatar';
import { AvatarConfig, defaultAvatarConfig } from '../../types/avatar';



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
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {showPreview && (
        <div className="w-64 h-64 mx-auto">
          <AvatarPreview config={config} className="w-full h-full" />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {/* Controles para cada parte, sin botón Aleatorio arriba */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Color de piel:</label>
            <input type="color" value={config.skinColor} onChange={e => handleChange('skinColor', e.target.value)} className="rounded-full w-10 h-10 border-none shadow-neomorphic" />
          </div>
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Ojos:</label>
            <select value={config.eyes} onChange={e => handleChange('eyes', e.target.value)} className="w-full rounded-xl py-2 px-3 shadow-neomorphic">
              <option value="happy">Felices</option>
              <option value="normal">Normales</option>
              <option value="sleepy">Soñolientos</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Cejas:</label>
            <select value={config.eyebrows} onChange={e => handleChange('eyebrows', e.target.value)} className="w-full rounded-xl py-2 px-3 shadow-neomorphic">
              <option value="up">Arriba</option>
              <option value="down">Abajo</option>
              <option value="angry">Enfadadas</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Boca:</label>
            <select value={config.mouth} onChange={e => handleChange('mouth', e.target.value)} className="w-full rounded-xl py-2 px-3 shadow-neomorphic">
              <option value="smile">Sonrisa</option>
              <option value="open">Abierta</option>
              <option value="sad">Triste</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Estilo de pelo:</label>
            <select value={config.hairStyle} onChange={e => handleChange('hairStyle', e.target.value)} className="w-full rounded-xl py-2 px-3 shadow-neomorphic">
              <option value="short">Corto</option>
              <option value="long">Largo</option>
              <option value="curly">Rizado</option>
            </select>
            <input type="color" value={config.hairColor} onChange={e => handleChange('hairColor', e.target.value)} className="rounded-full w-10 h-10 border-none shadow-neomorphic ml-2" />
          </div>
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Vello facial:</label>
            <select value={config.facialHair} onChange={e => handleChange('facialHair', e.target.value)} className="w-full rounded-xl py-2 px-3 shadow-neomorphic">
              <option value="none">Ninguno</option>
              <option value="mustache">Bigote</option>
              <option value="beard">Barba</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Ropa:</label>
            <select value={config.clothes} onChange={e => handleChange('clothes', e.target.value)} className="w-full rounded-xl py-2 px-3 shadow-neomorphic">
              <option value="tshirt">Camiseta</option>
              <option value="hoodie">Sudadera</option>
              <option value="dress">Vestido</option>
            </select>
            <input type="color" value={config.fabricColor} onChange={e => handleChange('fabricColor', e.target.value)} className="rounded-full w-10 h-10 border-none shadow-neomorphic ml-2" />
          </div>
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Gafas:</label>
            <select value={config.glasses} onChange={e => handleChange('glasses', e.target.value)} className="w-full rounded-xl py-2 px-3 shadow-neomorphic">
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
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Accesorios:</label>
            <select value={config.accessories} onChange={e => handleChange('accessories', e.target.value)} className="w-full rounded-xl py-2 px-3 shadow-neomorphic">
              <option value="none">Ninguno</option>
              <option value="earring">Pendiente</option>
              <option value="necklace">Collar</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Tatuajes:</label>
            <select value={config.tattoos} onChange={e => handleChange('tattoos', e.target.value)} className="w-full rounded-xl py-2 px-3 shadow-neomorphic">
              <option value="none">Ninguno</option>
              <option value="star">Estrella</option>
              <option value="heart">Corazón</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#7a2323] mb-1">Color de fondo:</label>
            <input type="color" value={config.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} className="rounded-full w-10 h-10 border-none shadow-neomorphic" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarBuilder;
