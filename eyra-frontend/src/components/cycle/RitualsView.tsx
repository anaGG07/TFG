import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCycle } from '../../context/CycleContext';
import { RitualIcons } from '../icons/CycleIcons';
import { CyclePhase } from '../../types/domain';
import { useViewport } from '../../hooks/useViewport';

type Ritual = {
  title: string;
  description: string;
  duration: string;
  benefits: string[];
}

type PhaseRitual = {
  title: string;
  description: string;
  rituals: Ritual[];
}

type MoonRitual = {
  title: string;
  description: string;
  rituals: Ritual[];
}

type WellbeingRecipe = {
  title: string;
  description: string;
  ingredients: string[];
  benefits: string[];
}

type RitualData = {
  phaseRituals: Record<CyclePhase, PhaseRitual>;
  moonRituals: {
    newMoon: MoonRitual;
    fullMoon: MoonRitual;
  };
  wellbeingRecipes: WellbeingRecipe[];
}

interface RitualsViewProps {
  expanded?: boolean;
}

const RitualsView: React.FC<RitualsViewProps> = ({ expanded = true }) => {
  const { currentPhase } = useCycle();
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [selectedCategory, setSelectedCategory] = useState<'phase' | 'moon' | 'recipes'>('phase');

  // Datos de ejemplo - Después se moverán a un servicio
  const ritualData: RitualData = {
    phaseRituals: {
      [CyclePhase.MENSTRUAL]: {
        title: "Rituales de Renacimiento",
        description: "Momento de introspección y renovación",
        rituals: [
          {
            title: "Baño de Sales",
            description: "Prepara un baño con sales de Epsom y aceites esenciales de lavanda",
            duration: "20 min",
            benefits: ["Relajación", "Alivio de cólicos", "Renovación"]
          },
          {
            title: "Meditación Lunar",
            description: "Meditación guiada para conectar con tu energía interior",
            duration: "15 min",
            benefits: ["Paz mental", "Autoconocimiento", "Equilibrio"]
          }
        ]
      },
      [CyclePhase.FOLICULAR]: {
        title: "Rituales de Energía",
        description: "Momento de crecimiento y expansión",
        rituals: [
          {
            title: "Ejercicio Matutino",
            description: "Rutina suave de yoga o estiramientos",
            duration: "30 min",
            benefits: ["Energía", "Flexibilidad", "Vitalidad"]
          }
        ]
      },
      [CyclePhase.OVULACION]: {
        title: "Rituales de Fertilidad",
        description: "Momento de máxima energía y creatividad",
        rituals: [
          {
            title: "Danza del Vientre",
            description: "Movimientos suaves para conectar con tu energía femenina",
            duration: "20 min",
            benefits: ["Fertilidad", "Energía", "Creatividad"]
          }
        ]
      },
      [CyclePhase.LUTEA]: {
        title: "Rituales de Nutrición",
        description: "Momento de preparación y cuidado",
        rituals: [
          {
            title: "Té de Hierbas",
            description: "Infusión de manzanilla y menta para el equilibrio hormonal",
            duration: "10 min",
            benefits: ["Equilibrio", "Nutrición", "Bienestar"]
          }
        ]
      }
    },
    moonRituals: {
      newMoon: {
        title: "Ritual de Luna Nueva",
        description: "Momento de intención y nuevos comienzos",
        rituals: [
          {
            title: "Establecer Intenciones",
            description: "Escribe tus intenciones para el nuevo ciclo",
            duration: "10 min",
            benefits: ["Claridad", "Propósito", "Manifestación"]
          }
        ]
      },
      fullMoon: {
        title: "Ritual de Luna Llena",
        description: "Momento de celebración y gratitud",
        rituals: [
          {
            title: "Meditación de Gratitud",
            description: "Reflexiona sobre tus logros y bendiciones",
            duration: "15 min",
            benefits: ["Gratitud", "Celebración", "Abundancia"]
          }
        ]
      }
    },
    wellbeingRecipes: [
      {
        title: "Té de Manzanilla y Jengibre",
        description: "Infusión calmante para momentos de tensión",
        ingredients: ["Manzanilla", "Jengibre", "Miel"],
        benefits: ["Calma", "Digestión", "Relajación"]
      },
      {
        title: "Smoothie de Frutos Rojos",
        description: "Bebida energética rica en antioxidantes",
        ingredients: ["Frambuesas", "Arándanos", "Plátano", "Leche de Almendras"],
        benefits: ["Energía", "Antioxidantes", "Vitalidad"]
      }
    ]
  };

  // --- VISTA NO EXPANDIDA ---
  if (!expanded) {
    const svgSize = isMobile ? { width: 240, height: 165 } : 
                   isTablet ? { width: 280, height: 192 } : 
                   { width: 320, height: 220 };
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          borderRadius: 18,
          padding: isMobile ? 16 : 24,
          minHeight: isMobile ? 160 : 180,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <img 
          src="/img/4.svg" 
          alt="Rituales" 
          style={{ 
            width: svgSize.width, 
            height: svgSize.height, 
            opacity: 0.97 
          }} 
        />
      </motion.div>
    );
  }

  // --- VISTA EXPANDIDA ---
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 20 : isTablet ? 24 : 32,
        background: 'transparent',
        borderRadius: 24,
        padding: isMobile ? 20 : isTablet ? 28 : 32,
        minHeight: isMobile ? 360 : isTablet ? 420 : 480,
        width: '100%',
      }}
    >
      {/* Navegación de categorías */}
      <div style={{
        display: 'flex',
        gap: isMobile ? 8 : 16,
        borderBottom: '1px solid #eee',
        paddingBottom: 16,
        background: 'transparent',
        borderRadius: 18,
        boxShadow: 'none',
        marginBottom: 8,
        flexWrap: isMobile ? 'wrap' : 'nowrap',
      }}>
        {[ 
          { id: 'phase', label: 'Por Fase', icon: RitualIcons.sun("#4A9D7B") },
          { id: 'moon', label: 'Luna', icon: RitualIcons.moon("#4A9D7B") },
          { id: 'recipes', label: 'Recetas', icon: RitualIcons.heart("#4A9D7B") }
        ].map(category => (
          <motion.button
            key={category.id}
            onClick={e => { e.stopPropagation(); setSelectedCategory(category.id as any); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 6 : 8,
              padding: isMobile ? '6px 12px' : '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: selectedCategory === category.id ? '#E0F0E8' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.icon}
            <span style={{ 
              fontSize: isMobile ? 12 : 14, 
              color: selectedCategory === category.id ? '#4A9D7B' : '#666' 
            }}>
              {category.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Contenido de la categoría seleccionada */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 24 : isTablet ? 32 : 40,
        flexWrap: 'wrap',
      }}>
        {selectedCategory === 'phase' && (
          <>
            <div style={{ flex: isMobile ? 'none' : 1, minWidth: isMobile ? '100%' : 280 }}>
              <h3 style={{ 
                fontSize: isMobile ? 18 : isTablet ? 20 : 22, 
                fontWeight: 700, 
                color: '#4A9D7B', 
                marginBottom: 16 
              }}>
                {ritualData.phaseRituals[currentPhase]?.title || "Rituales para tu fase"}
              </h3>
              <p style={{ 
                color: '#666', 
                marginBottom: 24, 
                fontSize: isMobile ? 14 : isTablet ? 16 : 17 
              }}>
                {ritualData.phaseRituals[currentPhase]?.description || "Descubre rituales especiales para esta fase de tu ciclo"}
              </p>
            </div>
            <div style={{ 
              flex: isMobile ? 'none' : 2, 
              minWidth: isMobile ? '100%' : 320, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 16 
            }}>
              {ritualData.phaseRituals[currentPhase]?.rituals.map((ritual: Ritual, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'transparent',
                    padding: isMobile ? 16 : 20,
                    borderRadius: 12,
                    boxShadow: 'none',
                  }}
                >
                  <h4 style={{ 
                    fontSize: isMobile ? 16 : 18, 
                    color: '#4A9D7B', 
                    marginBottom: 8 
                  }}>
                    {ritual.title}
                  </h4>
                  <p style={{ 
                    color: '#666', 
                    marginBottom: 12, 
                    fontSize: isMobile ? 13 : 15 
                  }}>
                    {ritual.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginBottom: 12,
                  }}>
                    {ritual.benefits.map((benefit: string, idx: number) => (
                      <span key={idx} style={{
                        background: '#4A9D7B',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: 12,
                        fontSize: 12,
                      }}>
                        {benefit}
                      </span>
                    ))}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#666',
                    fontSize: 13,
                  }}>
                    <span>⏱️ {ritual.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
        {selectedCategory === 'moon' && (
          <>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#4A9D7B', marginBottom: 16 }}>
                Rituales de la Luna
              </h3>
              <p style={{ color: '#666', marginBottom: 24, fontSize: 17 }}>
                Conecta con la energía lunar para potenciar tu bienestar
              </p>
            </div>
            <div style={{ flex: 2, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Object.entries(ritualData.moonRituals).map(([phase, data]: [string, MoonRitual], index: number) => (
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'transparent',
                    padding: 20,
                    borderRadius: 12,
                    boxShadow: 'none',
                  }}
                >
                  <h4 style={{ fontSize: 18, color: '#4A9D7B', marginBottom: 8 }}>
                    {data.title}
                  </h4>
                  <p style={{ color: '#666', marginBottom: 12, fontSize: 15 }}>
                    {data.description}
                  </p>
                  {data.rituals.map((ritual: Ritual, idx: number) => (
                    <div key={idx} style={{ marginTop: 12 }}>
                      <h5 style={{ fontSize: 15, color: '#4A9D7B', marginBottom: 8 }}>
                        {ritual.title}
                      </h5>
                      <p style={{ color: '#666', marginBottom: 8, fontSize: 14 }}>
                        {ritual.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap',
                        marginBottom: 8,
                      }}>
                        {ritual.benefits.map((benefit: string, bIdx: number) => (
                          <span key={bIdx} style={{
                            background: '#4A9D7B',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: 12,
                            fontSize: 12,
                          }}>
                            {benefit}
                          </span>
                        ))}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: '#666',
                        fontSize: 13,
                      }}>
                        <span>⏱️ {ritual.duration}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default RitualsView; 