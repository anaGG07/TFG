import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCycle } from '../../context/CycleContext';
import { RitualIcons } from '../icons/CycleIcons';
import { CyclePhase } from '../../types/domain';

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
          padding: 24,
          minHeight: 180,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Ritual del día */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16 
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#E0F0E8',
            padding: '8px 16px',
            borderRadius: 20,
            gap: 8,
          }}>
            {RitualIcons.star("#4A9D7B")}
            <span style={{ fontSize: 14, color: '#222' }}>Ritual del Día</span>
          </div>
          
          <div style={{
            background: '#F0FAF5',
            padding: 16,
            borderRadius: 12,
            width: '100%',
            textAlign: 'center'
          }}>
            <h4 style={{ fontSize: 16, color: '#4A9D7B', marginBottom: 8 }}>
              {ritualData.phaseRituals[currentPhase]?.rituals[0]?.title || "Meditación Lunar"}
            </h4>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
              {ritualData.phaseRituals[currentPhase]?.rituals[0]?.description || "Conecta con tu energía interior"}
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              flexWrap: 'wrap'
            }}>
              {ritualData.phaseRituals[currentPhase]?.rituals[0]?.benefits.map((benefit: string, index: number) => (
                <span key={index} style={{
                  background: '#4A9D7B',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: 12,
                  fontSize: 11,
                }}>
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Fase lunar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#E0F0E8',
          padding: '8px 16px',
          borderRadius: 20,
          gap: 8,
        }}>
          {RitualIcons.moon("#4A9D7B")}
          <span style={{ fontSize: 14, color: '#222' }}>Luna Creciente</span>
        </div>
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
        gap: 32,
        background: '#fff',
        borderRadius: 24,
        padding: 32,
        minHeight: 480,
        width: '100%',
      }}
    >
      {/* Navegación de categorías */}
      <div style={{
        display: 'flex',
        gap: 16,
        borderBottom: '1px solid #eee',
        paddingBottom: 16,
      }}>
        {[
          { id: 'phase', label: 'Por Fase', icon: RitualIcons.sun("#4A9D7B") },
          { id: 'moon', label: 'Luna', icon: RitualIcons.moon("#4A9D7B") },
          { id: 'recipes', label: 'Recetas', icon: RitualIcons.heart("#4A9D7B") }
        ].map(category => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: selectedCategory === category.id ? '#E0F0E8' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.icon}
            <span style={{ 
              fontSize: 14, 
              color: selectedCategory === category.id ? '#4A9D7B' : '#666' 
            }}>
              {category.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Contenido de la categoría seleccionada */}
      <div>
        {selectedCategory === 'phase' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#4A9D7B', marginBottom: 16 }}>
              {ritualData.phaseRituals[currentPhase]?.title || "Rituales para tu fase"}
            </h3>
            <p style={{ color: '#666', marginBottom: 24 }}>
              {ritualData.phaseRituals[currentPhase]?.description || "Descubre rituales especiales para esta fase de tu ciclo"}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {ritualData.phaseRituals[currentPhase]?.rituals.map((ritual: Ritual, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: '#F0FAF5',
                    padding: 20,
                    borderRadius: 12,
                  }}
                >
                  <h4 style={{ fontSize: 16, color: '#4A9D7B', marginBottom: 8 }}>
                    {ritual.title}
                  </h4>
                  <p style={{ color: '#666', marginBottom: 12 }}>
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
          </div>
        )}

        {selectedCategory === 'moon' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#4A9D7B', marginBottom: 16 }}>
              Rituales de la Luna
            </h3>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Conecta con la energía lunar para potenciar tu bienestar
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Object.entries(ritualData.moonRituals).map(([phase, data]: [string, MoonRitual], index: number) => (
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: '#F0FAF5',
                    padding: 20,
                    borderRadius: 12,
                  }}
                >
                  <h4 style={{ fontSize: 16, color: '#4A9D7B', marginBottom: 8 }}>
                    {data.title}
                  </h4>
                  <p style={{ color: '#666', marginBottom: 12 }}>
                    {data.description}
                  </p>
                  {data.rituals.map((ritual: Ritual, idx: number) => (
                    <div key={idx} style={{ marginTop: 12 }}>
                      <h5 style={{ fontSize: 14, color: '#4A9D7B', marginBottom: 8 }}>
                        {ritual.title}
                      </h5>
                      <p style={{ color: '#666', marginBottom: 8 }}>
                        {ritual.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap',
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
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {selectedCategory === 'recipes' && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#4A9D7B', marginBottom: 16 }}>
              Recetas de Bienestar
            </h3>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Recetas naturales para cuidar tu cuerpo y mente
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {ritualData.wellbeingRecipes.map((recipe: WellbeingRecipe, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: '#F0FAF5',
                    padding: 20,
                    borderRadius: 12,
                  }}
                >
                  <h4 style={{ fontSize: 16, color: '#4A9D7B', marginBottom: 8 }}>
                    {recipe.title}
                  </h4>
                  <p style={{ color: '#666', marginBottom: 12 }}>
                    {recipe.description}
                  </p>
                  <div style={{ marginBottom: 12 }}>
                    <h5 style={{ fontSize: 14, color: '#4A9D7B', marginBottom: 8 }}>
                      Ingredientes:
                    </h5>
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0,
                      display: 'flex',
                      gap: 8,
                      flexWrap: 'wrap',
                    }}>
                      {recipe.ingredients.map((ingredient: string, idx: number) => (
                        <li key={idx} style={{
                          background: '#E0F0E8',
                          padding: '4px 12px',
                          borderRadius: 12,
                          fontSize: 12,
                          color: '#4A9D7B',
                        }}>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}>
                    {recipe.benefits.map((benefit: string, idx: number) => (
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
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RitualsView; 