import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DraggableGrid from "../components/DraggableGrid";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface LibraryContent {
  id: string;
  title: string;
  summary: string;
  type: "historical" | "research" | "phases" | "inclusivity" | "maternity" | "wisdom";
  readTime: string;
  tags: string[];
  isNew?: boolean;
}

interface CategoryData {
  articles: LibraryContent[];
  totalCount: number;
  newCount: number;
}

interface CategoryInfo {
  name: string;
  description: string;
  unitLabel: string;
}

interface GridItem {
  id: string;
  component: React.ReactNode;
  title: string;
  isExpanded?: boolean;
  expandedComponent?: React.ReactNode;
}

// =============================================================================
// DATA & CONSTANTS
// =============================================================================

const ITEMS_PER_PAGE = 8;

const libraryData: Record<string, CategoryData> = {
  history: {
    articles: [
      {
        id: "h1",
        title: "Las Campañas Rojas: Reclamando el Poder Menstrual",
        summary: "Historia del movimiento que transformó la percepción social de la menstruación",
        type: "historical",
        readTime: "8 min",
        tags: ["historia", "activismo", "sociedad"],
        isNew: true,
      },
      {
        id: "h2",
        title: "Rituales Ancestrales: La Menstruación en Culturas Antiguas",
        summary: "Explorando cómo las civilizaciones honraban los ciclos femeninos",
        type: "historical",
        readTime: "12 min",
        tags: ["cultura", "rituales", "ancestral"],
      },
      {
        id: "h3",
        title: "Diosas Menstruales en la Mitología Griega",
        summary: "El papel sagrado de la menstruación en las creencias helénicas",
        type: "historical",
        readTime: "15 min",
        tags: ["mitología", "grecia", "diosas"],
        isNew: true,
      },
      {
        id: "h4",
        title: "Tabús y Supersticiones Medievales",
        summary: "Cómo la Edad Media transformó la percepción menstrual",
        type: "historical",
        readTime: "10 min",
        tags: ["medieval", "tabús", "supersticiones"],
      },
      {
        id: "h5",
        title: "Pueblos Indígenas y Ceremonias Lunares",
        summary: "Tradiciones ancestrales que honran el ciclo femenino",
        type: "historical",
        readTime: "18 min",
        tags: ["indígenas", "ceremonias", "lunar"],
      },
      {
        id: "h6",
        title: "Revolución Industrial y Higiene Femenina",
        summary: "Los primeros productos comerciales para la menstruación",
        type: "historical",
        readTime: "14 min",
        tags: ["revolución", "higiene", "productos"],
      },
      {
        id: "h7",
        title: "Movimientos Feministas del Siglo XX",
        summary: "Cómo las sufragistas abordaron la menstruación",
        type: "historical",
        readTime: "16 min",
        tags: ["feminismo", "sufragistas", "s.XX"],
        isNew: true,
      },
      {
        id: "h8",
        title: "Arte y Menstruación: Expresiones Culturales",
        summary: "Representaciones artísticas del ciclo a través de la historia",
        type: "historical",
        readTime: "13 min",
        tags: ["arte", "cultura", "expresión"],
      },
      {
        id: "h9",
        title: "Medicina Antigua y Teorías Humorales",
        summary: "Concepciones médicas históricas sobre la menstruación",
        type: "historical",
        readTime: "11 min",
        tags: ["medicina", "antigua", "teorías"],
      },
      {
        id: "h10",
        title: "Ritos de Paso en Diferentes Culturas",
        summary: "La menarquia como transición hacia la adultez",
        type: "historical",
        readTime: "17 min",
        tags: ["ritos", "menarquia", "culturas"],
      },
      {
        id: "h11",
        title: "Documentos Históricos y Testimonios",
        summary: "Evidencias escritas sobre experiencias menstruales",
        type: "historical",
        readTime: "9 min",
        tags: ["documentos", "testimonios", "evidencias"],
      },
      {
        id: "h12",
        title: "Influencia Religiosa en la Percepción Menstrual",
        summary: "Cómo las religiones moldearon actitudes hacia la menstruación",
        type: "historical",
        readTime: "20 min",
        tags: ["religión", "percepción", "actitudes"],
      },
    ],
    totalCount: 24,
    newCount: 3,
  },
  science: {
    articles: [
      {
        id: "s1",
        title: "Nuevos Hallazgos en Investigación Hormonal",
        summary: "Últimos estudios sobre fluctuaciones hormonales y su impacto",
        type: "research",
        readTime: "15 min",
        tags: ["hormonas", "investigación", "ciencia"],
        isNew: true,
      },
      {
        id: "s2",
        title: "Endometriosis: Avances en Diagnóstico Temprano",
        summary: "Técnicas innovadoras para detectar endometriosis",
        type: "research",
        readTime: "10 min",
        tags: ["endometriosis", "diagnóstico", "salud"],
      },
      {
        id: "s3",
        title: "Microbioma Vaginal y Ciclo Menstrual",
        summary: "Relación entre bacterias y fluctuaciones hormonales",
        type: "research",
        readTime: "12 min",
        tags: ["microbioma", "bacterias", "vaginal"],
        isNew: true,
      },
      {
        id: "s4",
        title: "Síndrome Premenstrual: Nuevas Terapias",
        summary: "Tratamientos innovadores para el SPM",
        type: "research",
        readTime: "14 min",
        tags: ["SPM", "terapias", "tratamiento"],
      },
      {
        id: "s5",
        title: "Genética y Trastornos Menstruales",
        summary: "Factores hereditarios en irregularidades del ciclo",
        type: "research",
        readTime: "18 min",
        tags: ["genética", "trastornos", "hereditario"],
      },
      {
        id: "s6",
        title: "Neurociencia del Dolor Menstrual",
        summary: "Cómo el cerebro procesa el dolor durante la menstruación",
        type: "research",
        readTime: "16 min",
        tags: ["neurociencia", "dolor", "cerebro"],
        isNew: true,
      },
      {
        id: "s7",
        title: "Impacto del Estrés en el Ciclo Menstrual",
        summary: "Estudios sobre cortisol y irregularidades menstruales",
        type: "research",
        readTime: "11 min",
        tags: ["estrés", "cortisol", "irregularidades"],
      },
      {
        id: "s8",
        title: "Medicina Personalizada en Ginecología",
        summary: "Tratamientos adaptados al perfil hormonal individual",
        type: "research",
        readTime: "13 min",
        tags: ["personalizada", "ginecología", "hormonal"],
      },
      {
        id: "s9",
        title: "Tecnología Wearable para Seguimiento Menstrual",
        summary: "Dispositivos inteligentes para monitorear el ciclo",
        type: "research",
        readTime: "9 min",
        tags: ["tecnología", "wearable", "seguimiento"],
      },
      {
        id: "s10",
        title: "Cambio Climático y Salud Reproductiva",
        summary: "Efectos ambientales en los ciclos menstruales",
        type: "research",
        readTime: "15 min",
        tags: ["clima", "ambiental", "reproductiva"],
      },
      {
        id: "s11",
        title: "Inteligencia Artificial en Predicción Menstrual",
        summary: "Algoritmos para predecir patrones de ciclo",
        type: "research",
        readTime: "12 min",
        tags: ["IA", "predicción", "algoritmos"],
        isNew: true,
      },
    ],
    totalCount: 47,
    newCount: 8,
  },
  phases: {
    articles: [
      {
        id: "p1",
        title: "Fase Folicular: Renovación y Energía",
        summary: "Entendiendo los cambios físicos y emocionales",
        type: "phases",
        readTime: "6 min",
        tags: ["fases", "bienestar", "autoconocimiento"],
      },
    ],
    totalCount: 16,
    newCount: 2,
  },
  inclusivity: {
    articles: [
      {
        id: "i1",
        title: "Apoyo Durante la Transición: Guía Integral",
        summary: "Recursos para personas trans en su proceso de hormonización",
        type: "inclusivity",
        readTime: "20 min",
        tags: ["trans", "apoyo", "hormonización"],
        isNew: true,
      },
    ],
    totalCount: 12,
    newCount: 4,
  },
  maternity: {
    articles: [
      {
        id: "m1",
        title: "Fertilidad y Planificación Natural",
        summary: "Métodos naturales para el seguimiento de la fertilidad",
        type: "maternity",
        readTime: "14 min",
        tags: ["fertilidad", "planificación", "natural"],
      },
    ],
    totalCount: 31,
    newCount: 1,
  },
  wisdom: {
    articles: [
      {
        id: "w1",
        title: "Menopausia: Una Nueva Etapa de Sabiduría",
        summary: "Navegando los cambios con conocimiento y confianza",
        type: "wisdom",
        readTime: "18 min",
        tags: ["menopausia", "sabiduría", "cambios"],
      },
    ],
    totalCount: 19,
    newCount: 0,
  },
};

const categoryConfig: Record<string, CategoryInfo> = {
  history: {
    name: "Mnemósine",
    description: "Historias reales de la menstruación en civilizaciones antiguas",
    unitLabel: "artículos",
  },
  science: {
    name: "Atenea",
    description: "Papers científicos y estudios sobre el ciclo menstrual",
    unitLabel: "estudios",
  },
  phases: {
    name: "Selene",
    description: "Mitología y creencias ancestrales sobre la menstruación",
    unitLabel: "guías",
  },
  inclusivity: {
    name: "Artemisa",
    description: "Productos naturales y remedios para el bienestar menstrual",
    unitLabel: "recursos",
  },
  maternity: {
    name: "Deméter",
    description: "Rituales, ceremonias y tradiciones del ciclo femenino",
    unitLabel: "artículos",
  },
  wisdom: {
    name: "Hestia",
    description: "Sabiduría ancestral y enseñanzas de mujeres sabias",
    unitLabel: "artículos",
  },
};

const getShortTitle = (title: string): string => {
  // Extraer palabras clave del título para widgets pequeños
  const keyWords: Record<string, string> = {
    "Campañas Rojas": "Campañas",
    "Rituales Ancestrales": "Rituales",
    "Nuevos Hallazgos": "Hallazgos", 
    "Endometriosis": "Endometriosis",
    "Fase Folicular": "Folicular",
    "Apoyo Durante la Transición": "Transición",
    "Fertilidad y Planificación": "Fertilidad",
    "Menopausia": "Menopausia"
  };
  
  // Buscar coincidencia exacta primero
  for (const [fullTitle, shortTitle] of Object.entries(keyWords)) {
    if (title.includes(fullTitle)) {
      return shortTitle;
    }
  }
  
  // Si no hay coincidencia, tomar las primeras 2 palabras
  const words = title.split(' ');
  return words.length > 2 ? words.slice(0, 2).join(' ') : title;
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const getTypeColor = (type: LibraryContent["type"]): string => {
  const colors = {
    historical: "linear-gradient(135deg, #C62328, #9d0d0b)",    // Rojo - Mnemósine
    research: "linear-gradient(135deg, #2563eb, #1d4ed8)",     // Azul - Atenea  
    phases: "linear-gradient(135deg, #7c3aed, #5b21b6)",       // Púrpura - Selene
    inclusivity: "linear-gradient(135deg, #059669, #047857)",  // Verde - Artemisa
    maternity: "linear-gradient(135deg, #dc2626, #b91c1c)",    // Rosa/Rojo - Deméter
    wisdom: "linear-gradient(135deg, #f59e0b, #d97706)",       // Dorado - Hestia
  };
  return colors[type] || colors.historical;
};

const getTypeIcon = (type: LibraryContent["type"]): React.ReactElement => {
  const iconStyle = { width: "12px", height: "12px", color: "white" };
  
  const icons = {
    historical: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    research: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
      </svg>
    ),
    phases: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
      </svg>
    ),
    inclusivity: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    maternity: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
      </svg>
    ),
    wisdom: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
      </svg>
    ),
  };
  
  return icons[type] || icons.historical;
};

// =============================================================================
// HOOKS
// =============================================================================

const useSearch = (articles: LibraryContent[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return articles;
    
    return articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [articles, searchTerm]);
};

const usePagination = (items: LibraryContent[], itemsPerPage: number = ITEMS_PER_PAGE) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };
  
  return {
    currentPage,
    totalPages,
    currentItems,
    nextPage,
    prevPage,
    goToPage,
    setCurrentPage,
  };
};

// =============================================================================
// COMPONENTS
// =============================================================================

const ArticleWidget: React.FC<{
  article: LibraryContent;
  index: number;
  onClick: () => void;
}> = ({ article, index, onClick }) => (
  <motion.div
    className="aspect-square cursor-pointer group relative overflow-hidden w-full max-w-[120px] mx-auto"
    style={{
      background: "linear-gradient(145deg, #f4f1ed, #e7e0d5)",
      borderRadius: "12px",
      border: "1px solid rgba(91, 1, 8, 0.08)",
      boxShadow: `
        4px 4px 8px rgba(91, 1, 8, 0.06),
        -4px -4px 8px rgba(255, 255, 255, 0.7),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
    }}
    whileHover={{
      scale: 1.08,
      boxShadow: `
        6px 6px 12px rgba(91, 1, 8, 0.08),
        -6px -6px 12px rgba(255, 255, 255, 0.8),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `,
    }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    {/* Badge nuevo - estilo neomorphic */}
    {article.isNew && (
      <div className="absolute top-1 right-1 z-10">
        <div 
          className="text-white text-xs px-1.5 py-0.5 rounded-full font-medium text-[10px] leading-tight"
          style={{
            background: "linear-gradient(135deg, #C62328, #9d0d0b)",
            boxShadow: `
              2px 2px 4px rgba(91, 1, 8, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
          }}
        >
          N
        </div>
      </div>
    )}

    {/* Contenido del widget simplificado */}
    <div className="p-2 h-full flex flex-col justify-between">
      {/* Icono del tipo - más pequeño */}
      <div className="flex-shrink-0 mb-2">
        <div 
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{
            background: getTypeColor(article.type),
            boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)"
          }}
        >
          <div className="w-3 h-3">
            {getTypeIcon(article.type)}
          </div>
        </div>
      </div>

      {/* Título corto o palabra clave */}
      <div className="flex-1 flex items-center justify-center">
        <h4 className="text-xs font-bold text-[#5b0108] leading-tight text-center line-clamp-2 group-hover:text-[#C62328] transition-colors drop-shadow-sm">
          {getShortTitle(article.title)}
        </h4>
      </div>

      {/* Footer con tiempo de lectura */}
      <div className="flex-shrink-0 text-center">
        <span 
          className="text-[10px] text-[#7a2323] font-semibold px-2 py-1 rounded-lg" 
          title="Tiempo estimado de lectura"
          style={{
            background: "linear-gradient(145deg, #e7e0d5, #d5cdc0)",
            boxShadow: `
              inset 1px 1px 2px rgba(91, 1, 8, 0.1),
              inset -1px -1px 2px rgba(255, 255, 255, 0.6)
            `,
          }}
        >
          📖 {article.readTime}
        </span>
      </div>
    </div>
  </motion.div>
);

const ArticleModal: React.FC<{
  article: LibraryContent | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ article, isOpen, onClose }) => {
  if (!isOpen || !article) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(231, 224, 213, 0.7)" }}
        onClick={handleOverlayClick}
      >
        <motion.div
          className="relative bg-[#f5f5f4] rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-4 min-h-[500px] max-h-[80vh] overflow-auto"
          style={{
            background: "linear-gradient(145deg, #fafaf9, #e7e5e4)",
            boxShadow: `
              20px 20px 40px rgba(91, 1, 8, 0.1),
              -20px -20px 40px rgba(255, 255, 255, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
          }}
          initial={{ scale: 0.95, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={handleModalContentClick}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-6 right-6 text-[#C62328] hover:text-[#7a2323] transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="pr-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: getTypeColor(article.type),
                    boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.1)"
                  }}
                >
                  {getTypeIcon(article.type)}
                </div>
                {article.isNew && (
                  <span className="bg-[#C62328] text-white text-sm px-3 py-1 rounded-full font-medium">
                    Nuevo
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl font-serif font-bold text-[#5b0108] mb-3 leading-tight">
                {article.title}
              </h2>
              
              <p className="text-base text-[#7a2323] mb-4 leading-relaxed">
                {article.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm bg-[#e7e0d5] text-[#5b0108] px-3 py-1 rounded-xl font-medium"
                      style={{
                        boxShadow: "2px 2px 4px rgba(91, 1, 8, 0.08)"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-[#a62c2c] font-semibold">
                  {article.readTime}
                </span>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div className="text-[#5b0108] leading-relaxed space-y-4">
                <p>
                  Este es el contenido completo del artículo. En una implementación real, 
                  aquí se cargaría el contenido desde el backend.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                  quis nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SearchBar: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
}> = ({ searchTerm, onSearchChange }) => (
  <motion.div
    className="relative flex-1 max-w-xs mr-16"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.3 }}
    onClick={(e) => e.stopPropagation()}
  >
    <input
      type="text"
      placeholder="Buscar..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full px-4 py-2 rounded-xl border border-[#C62328]/20 focus:border-[#C62328]/40 focus:outline-none bg-white/50 backdrop-blur-sm text-[#5b0108] placeholder-[#a62c2c]/60 text-sm"
      style={{
        boxShadow: `
          inset 4px 4px 8px rgba(91, 1, 8, 0.06),
          inset -4px -4px 8px rgba(255, 255, 255, 0.6)
        `,
      }}
    />
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      <svg className="w-4 h-4 text-[#a62c2c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
    </div>
  </motion.div>
);

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToPage: (page: number) => void;
}> = ({ currentPage, totalPages, onPrevious, onNext, onGoToPage }) => {
  if (totalPages <= 1) return null;

  return (
    <motion.div
      className="flex-shrink-0 flex items-center justify-center gap-4 mt-6 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        disabled={currentPage === 0}
        className={`p-2 rounded-lg ${
          currentPage === 0
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#C62328]/10 cursor-pointer"
        } transition-all duration-200`}
        style={{
          background: currentPage === 0 ? "transparent" : "linear-gradient(145deg, #fafaf9, #e7e5e4)",
          boxShadow: currentPage === 0 ? "none" : `
            3px 3px 6px rgba(91, 1, 8, 0.06),
            -3px -3px 6px rgba(255, 255, 255, 0.4)
          `,
        }}
        whileHover={currentPage > 0 ? { scale: 1.05 } : {}}
        whileTap={currentPage > 0 ? { scale: 0.95 } : {}}
      >
        <svg className="w-4 h-4 text-[#C62328]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </motion.button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <motion.button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              onGoToPage(i);
            }}
            className={`w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-medium ${
              i === currentPage
                ? "text-white"
                : "text-[#C62328] hover:text-white"
            }`}
            style={{
              background: i === currentPage 
                ? "linear-gradient(135deg, #C62328, #9d0d0b)"
                : "linear-gradient(145deg, #fafaf9, #e7e5e4)",
              boxShadow: i === currentPage
                ? `
                  inset 2px 2px 4px rgba(91, 1, 8, 0.3),
                  inset -2px -2px 4px rgba(255, 108, 92, 0.2)
                `
                : `
                  3px 3px 6px rgba(91, 1, 8, 0.06),
                  -3px -3px 6px rgba(255, 255, 255, 0.4)
                `,
            }}
            whileHover={{ 
              scale: 1.05,
              background: i === currentPage 
                ? "linear-gradient(135deg, #C62328, #9d0d0b)"
                : "linear-gradient(135deg, #C62328, #9d0d0b)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {i + 1}
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={currentPage === totalPages - 1}
        className={`p-2 rounded-lg ${
          currentPage === totalPages - 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#C62328]/10 cursor-pointer"
        } transition-all duration-200`}
        style={{
          background: currentPage === totalPages - 1 ? "transparent" : "linear-gradient(145deg, #fafaf9, #e7e5e4)",
          boxShadow: currentPage === totalPages - 1 ? "none" : `
            3px 3px 6px rgba(91, 1, 8, 0.06),
            -3px -3px 6px rgba(255, 255, 255, 0.4)
          `,
        }}
        whileHover={currentPage < totalPages - 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage < totalPages - 1 ? { scale: 0.95 } : {}}
      >
        <svg className="w-4 h-4 text-[#C62328]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </motion.button>
    </motion.div>
  );
};

const ExpandedContent: React.FC<{ 
  categoryId: string; 
  onClose?: () => void; 
}> = ({ categoryId, onClose }) => {
  const data = libraryData[categoryId];
  const config = categoryConfig[categoryId];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<LibraryContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredArticles = useSearch(data.articles, searchTerm);
  const pagination = usePagination(filteredArticles);
  
  const handleArticleClick = (article: LibraryContent) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <>
      <div className="h-full flex flex-col p-8">
        <div className="flex-shrink-0 mb-8 pr-20">
          <motion.div
            className="flex items-start justify-between gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-shrink-0">
              <h3 className="text-3xl font-serif font-bold text-[#7a2323] mb-2">
                {config.name}
              </h3>
              <p className="text-base text-[#5b0108]">
                {data.totalCount} {config.unitLabel} • {data.newCount} nuevos
              </p>
            </div>

            <div className="flex items-center gap-4">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              
              {/* Botón de cierre elegante */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.();
                }}
                className="flex-shrink-0 p-3 rounded-full bg-white/40 backdrop-blur-sm border border-[#C62328]/20 hover:bg-[#C62328]/10 hover:border-[#C62328]/30 transition-all duration-200 group cursor-pointer"
                style={{
                  boxShadow: `
                    4px 4px 8px rgba(91, 1, 8, 0.08),
                    -4px -4px 8px rgba(255, 255, 255, 0.6)
                  `,
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `
                    6px 6px 12px rgba(91, 1, 8, 0.12),
                    -6px -6px 12px rgba(255, 255, 255, 0.8)
                  `
                }}
                whileTap={{ scale: 0.95 }}
                aria-label="Cerrar vista expandida"
              >
                <svg 
                  className="w-5 h-5 text-[#C62328] group-hover:text-[#7a2323] transition-colors duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Leyenda de categorías */}
        <motion.div
          className="flex-shrink-0 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center justify-center gap-6 px-6 py-4 rounded-2xl mx-auto max-w-5xl" 
            style={{
              background: "linear-gradient(145deg, #f4f1ed, #e7e0d5)",
              border: "1px solid rgba(91, 1, 8, 0.08)",
              boxShadow: `
                inset 2px 2px 4px rgba(91, 1, 8, 0.06),
                inset -2px -2px 4px rgba(255, 255, 255, 0.7)
              `,
            }}
          >
            <span className="text-xs font-medium text-[#5b0108] opacity-75">Categorías:</span>
            
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ background: getTypeColor("historical") }}
              />
              <span className="text-xs text-[#5b0108]">Historia</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ background: getTypeColor("research") }}
              />
              <span className="text-xs text-[#5b0108]">Ciencia</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ background: getTypeColor("phases") }}
              />
              <span className="text-xs text-[#5b0108]">Fases</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ background: getTypeColor("inclusivity") }}
              />
              <span className="text-xs text-[#5b0108]">Inclusividad</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ background: getTypeColor("maternity") }}
              />
              <span className="text-xs text-[#5b0108]">Maternidad</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ background: getTypeColor("wisdom") }}
              />
              <span className="text-xs text-[#5b0108]">Sabiduría</span>
            </div>
          </div>
        </motion.div>

        <div 
          className="flex-1 overflow-hidden px-12"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pagination.currentPage}
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6 h-full content-center py-4 md:py-8 mx-auto max-w-5xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {pagination.currentItems.map((article, index) => (
                <ArticleWidget 
                  key={article.id} 
                  article={article} 
                  index={index} 
                  onClick={() => handleArticleClick(article)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPrevious={pagination.prevPage}
          onNext={pagination.nextPage}
          onGoToPage={pagination.goToPage}
        />
      </div>

      <ArticleModal 
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

const TentButton: React.FC<{
  categoryId: string;
  onClick: () => void;
  isSmall?: boolean;
}> = ({ categoryId, onClick, isSmall = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const config = categoryConfig[categoryId];

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick();
  };

  if (isSmall) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative focus:outline-none group w-full h-full flex flex-col items-center justify-center px-2 cursor-pointer"
          aria-label={`Acceder a categoría ${categoryId}`}
        >
          <div
            className={`h-0.5 bg-gradient-to-r from-transparent via-[#C62328] to-transparent transition-all duration-300 rounded-full mb-2 flex-shrink-0 ${
              isHovered ? "w-4/5 opacity-100 shadow-lg" : "w-3/5 opacity-60"
            }`}
          />

          <div className="text-center max-w-full px-1 mt-1">
            <p className="text-xs font-serif font-bold text-[#7a2323] mb-0.5 truncate">
              {config.name}
            </p>
            <p className="text-[10px] font-sans text-[#5b0108] leading-tight line-clamp-1">
              {config.description}
            </p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center library-tent-container">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative focus:outline-none group w-full h-full flex flex-col items-center justify-center library-tent-container cursor-pointer"
        aria-label={`Acceder a categoría ${categoryId}`}
      >
        <div className="flex items-end justify-center w-full flex-shrink-0">
          <svg
            width="85%"
            height="65%"
            viewBox="0 0 300 180"
            className={`transition-all duration-500 ${
              isClicked ? "scale-95" : "scale-100"
            }`}
          >
            <path
              d={
                isHovered
                  ? "M 148 15 L 30 150 L 110 150 Z"
                  : "M 148 15 L 50 150 L 148 150 Z"
              }
              fill={isHovered ? "rgba(198, 35, 40, 0.12)" : "rgba(198, 35, 40, 0.06)"}
              stroke="#C62328"
              strokeWidth="4"
              strokeLinejoin="miter" 
              strokeLinecap="round"
              className="transition-all duration-500 ease-in-out drop-shadow-sm"
            />

            <path
              d={
                isHovered
                  ? "M 152 15 L 190 150 L 270 150 Z"
                  : "M 152 15 L 152 150 L 250 150 Z"
              }
              fill={isHovered ? "rgba(198, 35, 40, 0.18)" : "rgba(198, 35, 40, 0.09)"}
              stroke="#C62328"
              strokeWidth="4"
              strokeLinejoin="miter"
              strokeLinecap="round"
              className="transition-all duration-500 ease-in-out drop-shadow-sm"
            />

            {isHovered && (
              <g className="transition-all duration-500">
                <defs>
                  <clipPath id={`tent-clip-${categoryId}`}>
                    <path d="M 150 25 L 110 160 L 190 160 Z" />
                  </clipPath>
                  <radialGradient id={`glow-${categoryId}`} cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#C62328" stopOpacity="0.4" />
                    <stop offset="20%" stopColor="#C62328" stopOpacity="0.25" />
                    <stop offset="40%" stopColor="#C62328" stopOpacity="0.15" />
                    <stop offset="60%" stopColor="#C62328" stopOpacity="0.08" />
                    <stop offset="80%" stopColor="#C62328" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#C62328" stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                <g clipPath={`url(#tent-clip-${categoryId})`}>
                  <ellipse
                    cx="150"
                    cy="110"
                    rx="55"
                    ry="40"
                    fill={`url(#glow-${categoryId})`}
                    className="animate-pulse"
                    style={{ 
                      filter: "blur(15px)",
                      animationDuration: "3s"
                    }}
                  />
                  <ellipse
                    cx="150"
                    cy="110"
                    rx="35"
                    ry="25"
                    fill="#C62328"
                    opacity="0.15"
                    className="animate-pulse"
                    style={{ 
                      filter: "blur(8px)",
                      animationDelay: "0.8s",
                      animationDuration: "2.5s"
                    }}
                  />
                  <ellipse
                    cx="150"
                    cy="110"
                    rx="20"
                    ry="15"
                    fill="#C62328"
                    opacity="0.1"
                    className="animate-pulse"
                    style={{ 
                      filter: "blur(4px)",
                      animationDelay: "1.5s",
                      animationDuration: "2s"
                    }}
                  />
                </g>
              </g>
            )}
          </svg>
        </div>

        <div
          className={`h-0.5 bg-gradient-to-r from-transparent via-[#C62328] to-transparent transition-all duration-500 rounded-full flex-shrink-0 ${
            isHovered ? "w-4/5 opacity-100 shadow-lg" : "w-3/5 opacity-50"
          }`}
        />

        <div className="text-center max-w-[90%] px-2 mt-2 flex-shrink-0">
          <p className="text-lg md:text-xl font-serif font-bold text-[#7a2323] whitespace-nowrap mb-1">
            {config.name}
          </p>
          <p className="text-xs md:text-sm font-sans text-[#5b0108] leading-tight line-clamp-2">
            {config.description}
          </p>
        </div>
      </button>
    </div>
  );
};

const CategoryCard: React.FC<{
  categoryId: string;
  isExpanded: boolean;
  onToggle?: () => void;
  isSmall?: boolean;
}> = ({ categoryId, isExpanded, onToggle, isSmall = false }) => {
  return (
    <div className={`flex flex-col h-full ${!isExpanded ? '' : 'p-4'}`}>
      <TentButton 
        categoryId={categoryId} 
        onClick={onToggle || (() => {})} 
        isSmall={isSmall}
      />
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const LibraryPage: React.FC = () => {
  console.log("LibraryPage: Renderizando RED TENT - Salud Femenina");

  const [hasExpandedItem, setHasExpandedItem] = useState(false);

  const libraryItems = useMemo(
    () => Object.keys(categoryConfig).map(categoryId => ({
      id: categoryId,
      title: categoryConfig[categoryId].name,
      component: <CategoryCard categoryId={categoryId} isExpanded={false} />,
      expandedComponent: <ExpandedContent categoryId={categoryId} />,
      isExpanded: false,
    })),
    []
  );

  const handleItemsChange = (newItems: GridItem[]) => {
    const hasExpanded = newItems.some((item) => item.isExpanded);
    setHasExpandedItem(hasExpanded);
    
    const updatedItems = newItems.map((item) => {
      const isExpanded = item.isExpanded || false;
      const isSmall = hasExpanded && !isExpanded;
      
      const component = (
        <CategoryCard
          categoryId={item.id}
          isExpanded={isExpanded}
          isSmall={isSmall}
          onToggle={() => {
            console.log(`Toggle ${item.id}`);
          }}
        />
      );

      return {
        ...item,
        component,
      };
    });

    console.log(
      "LibraryPage: Categorías actualizadas:",
      updatedItems.map((i) => ({ id: i.id, expanded: i.isExpanded }))
    );
  };

  return (
    <motion.div
      className="w-full h-full bg-[#e7e0d5] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {!hasExpandedItem && (
          <motion.div
            className="absolute top-0 left-0 right-0 z-10 p-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ 
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1.0]
            }}
          >
            <div className="flex flex-col sm:flex sm:justify-center sm:items-center lg:grid lg:grid-cols-5 gap-4 md:gap-6 px-4 md:px-8">
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
              
              <div className="flex justify-center lg:col-span-2 lg:justify-start">
                <motion.div
                  className="bg-white/35 backdrop-blur-sm rounded-2xl px-4 py-4 md:px-8 md:py-5 flex items-center gap-3 max-w-xl w-full"
                  style={{
                    border: "1px solid rgba(198, 35, 40, 0.25)",
                    boxShadow: `
                      8px 8px 16px rgba(91, 1, 8, 0.12),
                      -8px -8px 16px rgba(255, 255, 255, 0.7)
                    `,
                  }}
                  whileHover={{ scale: 1.03, boxShadow: `
                    12px 12px 24px rgba(91, 1, 8, 0.15),
                    -12px -12px 24px rgba(255, 255, 255, 0.8)
                  ` }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center w-full flex flex-col justify-center items-center">
                    <h1 className="text-xl md:text-2xl font-serif font-bold text-[#7a2323] leading-none mb-2 md:mb-3 tracking-wide">
                      RED TENT
                    </h1>
                    <p className="text-xs md:text-sm text-[#5b0108] leading-relaxed font-medium text-center">
                      🏛️ <strong>Descubre tu herencia ancestral.</strong> Tu historia comienza aquí.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              <div className="hidden lg:block"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full h-full"
        style={{ 
          paddingTop: hasExpandedItem ? "0" : "6rem"
        }}
        animate={{ 
          paddingTop: hasExpandedItem ? "0" : "6rem"
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
      >
        <DraggableGrid items={libraryItems} onItemsChange={handleItemsChange} isLibrary={true} />
      </motion.div>
    </motion.div>
  );
};

export default LibraryPage;
