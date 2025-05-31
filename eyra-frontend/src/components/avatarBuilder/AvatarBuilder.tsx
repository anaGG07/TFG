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
    <div className="flex flex-col md:flex-row gap-8">
      {showPreview && (
        <div className="w-64 h-64 mx-auto">
          <AvatarPreview config={config} className="w-full h-full" />
        </div>
      )}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="mb-2 px-4 py-2 bg-[#C62328] text-white rounded-lg hover:bg-[#7a2323] transition-colors"
          onClick={() => {
            const random = getRandomAvatarConfig();
            setConfig(random);
            if (onChange) onChange(random);
          }}
        >
          Aleatorio
        </button>
        
        {/* Controles para cada parte */}
        <div>
          <label>Color de piel:</label>
          <input type="color" value={config.skinColor} onChange={e => handleChange('skinColor', e.target.value)} />
        </div>
        
        <div>
          <label>Ojos:</label>
          <select value={config.eyes} onChange={e => handleChange('eyes', e.target.value)}>
            <option value="happy">Felices</option>
            <option value="normal">Normales</option>
            <option value="sleepy">Soñolientos</option>
          </select>
        </div>
        
        <div>
          <label>Cejas:</label>
          <select value={config.eyebrows} onChange={e => handleChange('eyebrows', e.target.value)}>
            <option value="up">Arriba</option>
            <option value="down">Abajo</option>
            <option value="angry">Enfadadas</option>
          </select>
        </div>
        
        <div>
          <label>Boca:</label>
          <select value={config.mouth} onChange={e => handleChange('mouth', e.target.value)}>
            <option value="smile">Sonrisa</option>
            <option value="open">Abierta</option>
            <option value="sad">Triste</option>
          </select>
        </div>
        
        <div>
          <label>Estilo de pelo:</label>
          <select value={config.hairStyle} onChange={e => handleChange('hairStyle', e.target.value)}>
            <option value="short">Corto</option>
            <option value="long">Largo</option>
            <option value="curly">Rizado</option>
          </select>
          <input type="color" value={config.hairColor} onChange={e => handleChange('hairColor', e.target.value)} />
        </div>
        
        <div>
          <label>Vello facial:</label>
          <select value={config.facialHair} onChange={e => handleChange('facialHair', e.target.value)}>
            <option value="none">Ninguno</option>
            <option value="mustache">Bigote</option>
            <option value="beard">Barba</option>
          </select>
        </div>
        
        <div>
          <label>Ropa:</label>
          <select value={config.clothes} onChange={e => handleChange('clothes', e.target.value)}>
            <option value="tshirt">Camiseta</option>
            <option value="hoodie">Sudadera</option>
            <option value="dress">Vestido</option>
          </select>
          <input type="color" value={config.fabricColor} onChange={e => handleChange('fabricColor', e.target.value)} />
        </div>
        
        <div>
          <label>Gafas:</label>
          <select value={config.glasses} onChange={e => handleChange('glasses', e.target.value)}>
            <option value="none">Ningunas</option>
            <option value="round">Redondas</option>
            <option value="square">Cuadradas</option>
          </select>
          <label>Opacidad:</label>
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.05} 
            value={parseFloat(config.glassOpacity) || 0.7} // ✅ CORREGIDO: Parsea string a number para el slider
            onChange={e => handleChange('glassOpacity', e.target.value)} // ✅ CORREGIDO: Se mantiene como string
          />
        </div>
        
        <div>
          <label>Accesorios:</label>
          <select value={config.accessories} onChange={e => handleChange('accessories', e.target.value)}>
            <option value="none">Ninguno</option>
            <option value="earring">Pendiente</option>
            <option value="necklace">Collar</option>
          </select>
        </div>
        
        <div>
          <label>Tatuajes:</label>
          <select value={config.tattoos} onChange={e => handleChange('tattoos', e.target.value)}>
            <option value="none">Ninguno</option>
            <option value="star">Estrella</option>
            <option value="heart">Corazón</option>
          </select>
        </div>
        
        <div>
          <label>Color de fondo:</label>
          <input type="color" value={config.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default AvatarBuilder;
