// components/avatarBuilder/AvatarBuilder.tsx - ACTUALIZADO con todas las opciones

import React, { useState, useEffect } from "react";
import {
  AvatarConfig,
  defaultAvatarConfig,
  AVATAR_OPTIONS,
} from "../../types/avatar";
import AvatarPreview from "./AvatarPreview";
import {
  User,
  Eye,
  Smile,
  Palette,
  Scissors,
  Glasses,
  Gem,
  Star,
  Shirt,
  PaintBucket,
  Sparkles,
  Zap,
  Settings,
} from "lucide-react";

interface AvatarBuilderProps {
  onChange?: (config: AvatarConfig) => void;
  initialConfig?: AvatarConfig;
  showPreview?: boolean;
}

const TABS = [
  { key: 'rostro', label: 'Rostro', icon: <User size={20} stroke="#C62328" /> },
  { key: 'expresion', label: 'Expresión', icon: <Smile size={20} stroke="#C62328" /> },
  { key: 'cabello', label: 'Cabello', icon: <Scissors size={20} stroke="#C62328" /> },
  { key: 'vestimenta', label: 'Vestimenta', icon: <Shirt size={20} stroke="#C62328" /> },
  { key: 'gafas', label: 'Gafas', icon: <Glasses size={20} stroke="#C62328" /> },
  { key: 'extras', label: 'Extras', icon: <Gem size={20} stroke="#C62328" /> },
];

const AvatarBuilder: React.FC<AvatarBuilderProps> = ({
  onChange,
  initialConfig,
  showPreview = true,
}) => {
  const [config, setConfig] = useState<AvatarConfig>(
    initialConfig || defaultAvatarConfig
  );
  const [activeTab, setActiveTab] = useState('rostro');

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
    <div className="w-full flex flex-col gap-6 justify-center max-w-6xl mx-auto">
      {/* Vista previa del avatar (opcional) */}
      {showPreview && (
        <div className="flex justify-center mb-6">
          <div className="bg-[#f5ede6] rounded-2xl shadow-neomorphic p-6 max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <User size={22} stroke="#C62328" />
              <span className="font-bold text-lg text-[#7a2323]">
                Vista previa
              </span>
            </div>
            <div className="flex justify-center">
              <AvatarPreview
                config={config}
                className="w-48 h-48 shadow-neomorphic rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs de edición */}
      <div className="flex flex-row justify-center gap-2 mb-4 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl font-semibold shadow-neomorphic transition-all duration-200 text-[#7a2323] bg-[#f5ede6] border-2 ${activeTab === tab.key ? 'border-[#C62328] bg-[#fff]' : 'border-transparent hover:border-[#C62328]/40'}`}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Renderizado de la caja de edición según tab */}
      <div className="flex justify-center">
        {activeTab === 'rostro' && (
          <div className="bg-[#f5ede6] rounded-2xl shadow-neomorphic p-6 min-w-[280px] max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <User size={22} stroke="#C62328" />
              <span className="font-bold text-lg text-[#7a2323]">
                Rostro básico
              </span>
            </div>
            {/* Color de piel */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Palette size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">
                  Color de piel:
                </label>
              </div>
              <input
                type="color"
                value={config.skinColor}
                onChange={e => handleChange("skinColor", e.target.value)}
                className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-neomorphic"
                title="Color de piel"
              />
            </div>
            {/* Ojos */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Ojos:</label>
              </div>
              <select
                value={config.eyes}
                onChange={(e) => handleChange("eyes", e.target.value)}
                className="w-full rounded-xl py-2 px-3 shadow-neomorphic bg-white text-[#7a2323]"
              >
                {AVATAR_OPTIONS.eyes.map((eye) => (
                  <option key={eye.value} value={eye.value}>
                    {eye.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Cejas */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Cejas:</label>
              </div>
              <select
                value={config.eyebrows}
                onChange={(e) => handleChange("eyebrows", e.target.value)}
                className="w-full rounded-xl py-2 px-3 shadow-neomorphic bg-white text-[#7a2323]"
              >
                {AVATAR_OPTIONS.eyebrows.map((eyebrow) => (
                  <option key={eyebrow.value} value={eyebrow.value}>
                    {eyebrow.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {activeTab === 'expresion' && (
          <div className="bg-[#f5ede6] rounded-2xl shadow-neomorphic p-6 min-w-[280px] max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <Smile size={22} stroke="#C62328" />
              <span className="font-bold text-lg text-[#7a2323]">Expresión</span>
            </div>
            {/* Boca */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Smile size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Boca:</label>
              </div>
              <select
                value={config.mouth}
                onChange={(e) => handleChange("mouth", e.target.value)}
                className="w-full rounded-xl py-2 px-3 shadow-neomorphic bg-white text-[#7a2323]"
              >
                {AVATAR_OPTIONS.mouths.map((mouth) => (
                  <option key={mouth.value} value={mouth.value}>
                    {mouth.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Vello facial */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">
                  Vello facial:
                </label>
              </div>
              <select
                value={config.facialHair}
                onChange={(e) => handleChange("facialHair", e.target.value)}
                className="w-full rounded-xl py-2 px-3 shadow-neomorphic bg-white text-[#7a2323]"
              >
                {AVATAR_OPTIONS.facialHair.map((hair) => (
                  <option key={hair.value} value={hair.value}>
                    {hair.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {activeTab === 'cabello' && (
          <div className="bg-[#f5ede6] rounded-2xl shadow-neomorphic p-6 min-w-[280px] max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <Scissors size={22} stroke="#C62328" />
              <span className="font-bold text-lg text-[#7a2323]">Cabello</span>
            </div>
            {/* Estilo de cabello */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Scissors size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Estilo:</label>
              </div>
              <select
                value={config.hairStyle}
                onChange={(e) => handleChange("hairStyle", e.target.value)}
                className="w-full rounded-xl py-2 px-3 shadow-neomorphic bg-white text-[#7a2323]"
              >
                {AVATAR_OPTIONS.hairStyles.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Color de cabello */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Palette size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Color:</label>
              </div>
              <input
                type="color"
                value={config.hairColor.split("_")[0]}
                onChange={e => handleChange("hairColor", e.target.value)}
                className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-neomorphic"
                title="Color de cabello"
              />
            </div>
          </div>
        )}
        {activeTab === 'vestimenta' && (
          <div className="bg-[#f5ede6] rounded-2xl shadow-neomorphic p-6 min-w-[280px] max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <Shirt size={22} stroke="#C62328" />
              <span className="font-bold text-lg text-[#7a2323]">Vestimenta</span>
            </div>
            {/* Tipo de ropa */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Shirt size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Tipo:</label>
              </div>
              <select
                value={config.clothes}
                onChange={(e) => handleChange("clothes", e.target.value)}
                className="w-full rounded-xl py-2 px-3 shadow-neomorphic bg-white text-[#7a2323]"
              >
                {AVATAR_OPTIONS.clothes.map((cloth) => (
                  <option key={cloth.value} value={cloth.value}>
                    {cloth.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Color de tela */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PaintBucket size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Color:</label>
              </div>
              <input
                type="color"
                value={config.fabricColor}
                onChange={e => handleChange("fabricColor", e.target.value)}
                className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-neomorphic"
                title="Color de ropa"
              />
            </div>
          </div>
        )}
        {activeTab === 'gafas' && (
          <div className="bg-[#f5ede6] rounded-2xl shadow-neomorphic p-6 min-w-[280px] max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <Glasses size={22} stroke="#C62328" />
              <span className="font-bold text-lg text-[#7a2323]">Gafas</span>
            </div>
            {/* Tipo de gafas */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Glasses size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Tipo:</label>
              </div>
              <select
                value={config.glasses}
                onChange={(e) => handleChange("glasses", e.target.value)}
                className="w-full rounded-xl py-2 px-3 shadow-neomorphic bg-white text-[#7a2323]"
              >
                {AVATAR_OPTIONS.glasses.map((glass) => (
                  <option key={glass.value} value={glass.value}>
                    {glass.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Opacidad de cristales */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Settings size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Opacidad:</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={parseFloat(config.glassOpacity) || 0.5}
                  onChange={(e) => handleChange("glassOpacity", e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm text-[#7a2323] min-w-[3rem]">
                  {Math.round((parseFloat(config.glassOpacity) || 0.5) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'extras' && (
          <div className="bg-[#f5ede6] rounded-2xl shadow-neomorphic p-6 min-w-[280px] max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <Gem size={22} stroke="#C62328" />
              <span className="font-bold text-lg text-[#7a2323]">Extras</span>
            </div>
            {/* Accesorios */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Gem size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">
                  Accesorios:
                </label>
              </div>
              <select
                value={config.accessories}
                onChange={(e) => handleChange("accessories", e.target.value)}
                className="w-full rounded-xl py-2 px-3 shadow-neomorphic bg-white text-[#7a2323]"
              >
                {AVATAR_OPTIONS.accessories.map((accessory) => (
                  <option key={accessory.value} value={accessory.value}>
                    {accessory.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Color de accesorios */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Gem size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Color de accesorio:</label>
              </div>
              <input
                type="color"
                value={config.accessoryColor}
                onChange={e => handleChange("accessoryColor", e.target.value)}
                className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-neomorphic"
                title="Color de accesorio"
              />
            </div>
            {/* Tatuajes */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Tatuajes:</label>
              </div>
              <select
                value={config.tattoos}
                onChange={(e) => handleChange("tattoos", e.target.value)}
                className="w-full rounded-xl py-2 px-3 shadow-neomorphic bg-white text-[#7a2323]"
              >
                {AVATAR_OPTIONS.tattoos.map((tattoo) => (
                  <option key={tattoo.value} value={tattoo.value}>
                    {tattoo.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Color de tatuaje */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={18} stroke="#C62328" />
                <label className="font-semibold text-[#7a2323]">Color de tatuaje:</label>
              </div>
              <input
                type="color"
                value={config.tattooColor}
                onChange={e => handleChange("tattooColor", e.target.value)}
                className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-neomorphic"
                title="Color de tatuaje"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sección 3: Fondo */}
      <div className="flex justify-center">
        <div className="bg-[#f5ede6] rounded-2xl shadow-neomorphic p-6 w-full max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <PaintBucket size={22} stroke="#C62328" />
            <span className="font-bold text-lg text-[#7a2323]">Fondo</span>
          </div>

          {/* Color de fondo */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PaintBucket size={18} stroke="#C62328" />
              <label className="font-semibold text-[#7a2323]">
                Color de fondo:
              </label>
            </div>
            <input
              type="color"
              value={config.backgroundColor}
              onChange={e => handleChange("backgroundColor", e.target.value)}
              className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-neomorphic"
              title="Color de fondo"
            />
          </div>
        </div>
      </div>

      {/* Ocultar barra de scroll en tabs para todos los navegadores */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AvatarBuilder;
