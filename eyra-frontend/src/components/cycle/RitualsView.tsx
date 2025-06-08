import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCycle } from '../../context/CycleContext';
import { RitualIcons } from '../icons/CycleIcons';
import { CyclePhase, ContentType, Content } from '../../types/domain';
import { useViewport } from '../../hooks/useViewport';
import { adminContentService } from '../../services/adminContentService';

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
  const [rituals, setRituals] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'phase' | 'moon'>('phase');

  useEffect(() => {
    const fetchRituals = async () => {
      setLoading(true);
      try {
        const allContent = await adminContentService.listContent();
        const ritualContent = allContent.filter(c => c.type === ContentType.RITUAL);
        setRituals(ritualContent);
      } catch (e) {
        setRituals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRituals();
  }, []);

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
          height: '100%',
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
            opacity: 0.97,
            objectFit: 'contain'
          }} 
        />
      </motion.div>
    );
  }

  // --- VISTA EXPANDIDA ---
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360, width: '100%' }}
      >
        <div className="loading-spinner" />
      </motion.div>
    );
  }

  // Filtrar rituales por fase si se desea
  const phaseRituals = rituals.filter(r => r.targetPhase === currentPhase);
  const moonRituals = rituals.filter(r => r.tags && r.tags.includes('moon'));

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
                Rituales para tu fase
              </h3>
              <p style={{ color: '#666', marginBottom: 24, fontSize: isMobile ? 14 : isTablet ? 16 : 17 }}>
                Descubre rituales especiales para esta fase de tu ciclo
              </p>
            </div>
            <div style={{ flex: isMobile ? 'none' : 2, minWidth: isMobile ? '100%' : 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {phaseRituals.length > 0 ? phaseRituals.map((ritual, index) => (
                <motion.div
                  key={ritual.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ background: 'transparent', padding: isMobile ? 16 : 20, borderRadius: 12, boxShadow: 'none' }}
                >
                  <h4 style={{ fontSize: isMobile ? 16 : 18, color: '#4A9D7B', marginBottom: 8 }}>{ritual.title}</h4>
                  <p style={{ color: '#666', marginBottom: 12, fontSize: isMobile ? 13 : 15 }}>{ritual.summary}</p>
                  <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>
                    {ritual.body}
                  </div>
                </motion.div>
              )) : (
                <div style={{ color: '#C62328', fontWeight: 500, fontSize: 15 }}>No hay rituales para esta fase.</div>
              )}
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
              {moonRituals.length > 0 ? moonRituals.map((ritual, index) => (
                <motion.div
                  key={ritual.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ background: 'transparent', padding: 20, borderRadius: 12, boxShadow: 'none' }}
                >
                  <h4 style={{ fontSize: 18, color: '#4A9D7B', marginBottom: 8 }}>{ritual.title}</h4>
                  <p style={{ color: '#666', marginBottom: 12, fontSize: 15 }}>{ritual.summary}</p>
                  <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>{ritual.body}</div>
                </motion.div>
              )) : (
                <div style={{ color: '#C62328', fontWeight: 500, fontSize: 15 }}>No hay rituales de luna.</div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default RitualsView; 