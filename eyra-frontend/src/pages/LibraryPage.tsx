import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DraggableGrid from "../components/DraggableGrid";

// Interfaces para el contenido de la biblioteca
interface LibraryContent {
  id: string;
  title: string;
  summary: string;
  type: "article" | "research" | "historical" | "advice" | "campaign";
  readTime: string;
  tags: string[];
  isNew?: boolean;
}

interface CategoryData {
  articles: LibraryContent[];
  totalCount: number;
  newCount: number;
}

// Datos de contenido simulado
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
        type: "advice",
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
        type: "advice",
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
        type: "advice",
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
        type: "advice",
        readTime: "18 min",
        tags: ["menopausia", "sabiduría", "cambios"],
      },
    ],
    totalCount: 19,
    newCount: 0,
  },
};

// Componente para artículos dentro de categorías expandidas
const ArticlePreview = ({ article }: { article: LibraryContent }) => (
  <motion.div
    className="bg-white/40 rounded-xl p-4 cursor-pointer group"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
    style={{
      border: "1px solid rgba(198, 35, 40, 0.1)",
      boxShadow: `
        4px 4px 8px rgba(91, 1, 8, 0.05),
        -4px -4px 8px rgba(255, 255, 255, 0.4)
      `,
    }}
  >
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-sm font-semibold text-[#5b0108] group-hover:text-[#C62328] transition-colors">
        {article.title}
      </h4>
      {article.isNew && (
        <span className="bg-[#C62328] text-white text-xs px-2 py-1 rounded-full">
          Nuevo
        </span>
      )}
    </div>
    <p className="text-xs text-[#7a2323] mb-3 line-clamp-2">
      {article.summary}
    </p>
    <div className="flex justify-between items-center">
      <div className="flex flex-wrap gap-1">
        {article.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[#e7e0d5] text-[#5b0108] px-2 py-1 rounded-lg"
          >
            {tag}
          </span>
        ))}
      </div>
      <span className="text-xs text-[#a62c2c]">{article.readTime}</span>
    </div>
  </motion.div>
);

// Componente de tienda de campaña que ocupa toda la caja
const TentCard = ({ 
  categoryId, 
  onClick 
}: { 
  categoryId: string; 
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick();
  };

  const getCategoryConfig = (id: string) => {
    switch (id) {
      case "history":
        return {
          title: "Historia Menstrual",
          description: "Explorando el pasado para entender el presente",
          icon: "🕰️"
        };
      case "science":
        return {
          title: "Ciencia & Investigación",
          description: "Evidencia científica y estudios contrastados",
          icon: "🔬"
        };
      case "phases":
        return {
          title: "Fases del Ciclo",
          description: "Comprende cada etapa de tu ciclo",
          icon: "🌙"
        };
      case "inclusivity":
        return {
          title: "Inclusividad & Género",
          description: "Apoyo para todas las identidades",
          icon: "👥"
        };
      case "maternity":
        return {
          title: "Maternidad & Fertilidad",
          description: "Acompañándote en cada etapa",
          icon: "❤️"
        };
      case "wisdom":
        return {
          title: "Sabiduría & Longevidad",
          description: "Acompañándote a lo largo de la vida",
          icon: "📚"
        };
      default:
        return {
          title: "Refugio",
          description: "Tu espacio seguro",
          icon: "🏕️"
        };
    }
  };

  const config = getCategoryConfig(categoryId);
  const data = libraryData[categoryId];

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full relative focus:outline-none group cursor-pointer"
      aria-label={`Acceder a ${config.title}`}
    >
      {/* SVG que ocupa toda la caja */}
      <svg 
        className={`w-full h-full transition-all duration-300 ${isClicked ? 'scale-95' : 'scale-100'}`}
        viewBox="0 0 300 250" 
        preserveAspectRatio="none"
      >
        {/* Lado izquierdo de la tienda */}
        <path 
          d={isHovered ? "M 150 20 L 20 220 L 120 220 Z" : "M 150 20 L 40 220 L 150 220 Z"} 
          fill="none" 
          stroke={isHovered ? '#f43f5e' : '#C62328'} 
          strokeWidth="3" 
          className="transition-all duration-500 ease-in-out" 
        />
        
        {/* Lado derecho de la tienda */}
        <path 
          d={isHovered ? "M 150 20 L 180 220 L 280 220 Z" : "M 150 20 L 150 220 L 260 220 Z"} 
          fill="none" 
          stroke={isHovered ? '#f43f5e' : '#C62328'} 
          strokeWidth="3" 
          className="transition-all duration-500 ease-in-out" 
        />
        
        {/* Interior rosado cuando se abre */}
        {isHovered && (
          <path 
            d="M 150 20 L 120 220 L 180 220 Z" 
            fill="#fce7f3" 
            opacity="0.3" 
            className="transition-all duration-500" 
          />
        )}
        
        {/* Base de la tienda - línea horizontal */}
        <line 
          x1={isHovered ? "20" : "40"} 
          y1="220" 
          x2={isHovered ? "280" : "260"} 
          y2="220" 
          stroke="#C62328" 
          strokeWidth="2" 
          className="transition-all duration-300"
        />
        
        {/* Título en la parte superior */}
        <text 
          x="150" 
          y="50" 
          textAnchor="middle" 
          className="fill-[#7a2323] text-lg font-serif font-bold"
          fontSize="16"
        >
          {config.title}
        </text>
        
        {/* Descripción */}
        <text 
          x="150" 
          y="70" 
          textAnchor="middle" 
          className="fill-[#5b0108] text-sm"
          fontSize="12"
        >
          {config.description}
        </text>
        
        {/* Icono de categoría en el centro */}
        {isHovered && (
          <text 
            x="150" 
            y="140" 
            textAnchor="middle" 
            fontSize="32" 
            opacity="0.8"
            className="transition-all duration-300 animate-pulse"
          >
            {config.icon}
          </text>
        )}
        
        {/* Información de recursos en la parte inferior */}
        <text 
          x="150" 
          y="190" 
          textAnchor="middle" 
          className="fill-[#C62328] text-xs font-semibold"
          fontSize="11"
        >
          {data?.totalCount || 0} recursos
        </text>
        
        {/* Badge de nuevos si existen */}
        {data?.newCount > 0 && (
          <>
            <rect 
              x="200" 
              y="175" 
              width="80" 
              height="20" 
              rx="10" 
              fill="#C62328"
            />
            <text 
              x="240" 
              y="187" 
              textAnchor="middle" 
              className="fill-white text-xs"
              fontSize="10"
            >
              {data.newCount} nuevos
            </text>
          </>
        )}
        
        {/* Texto de acción */}
        <text 
          x="150" 
          y="240" 
          textAnchor="middle" 
          className="fill-[#7a2323] text-xs"
          fontSize="10"
        >
          {isClicked ? 'Accediendo...' : isHovered ? 'Click para explorar' : 'Haz clic para entrar'}
        </text>
      </svg>
    </button>
  );
};

// Componente genérico para todas las categorías
const CategoryCard = ({ 
  categoryId, 
  isExpanded,
  onToggle 
}: { 
  categoryId: string; 
  isExpanded: boolean;
  onToggle?: () => void;
}) => {
  const data = libraryData[categoryId];
  
  const getCategoryConfig = (id: string) => {
    switch (id) {
      case "history":
        return {
          title: "Historia Menstrual",
          description: "Explorando el pasado para entender el presente",
          unitLabel: "artículos",
          details: "Campañas rojas, rituales ancestrales y más"
        };
      case "science":
        return {
          title: "Ciencia & Investigación",
          description: "Evidencia científica y estudios contrastados",
          unitLabel: "estudios",
          details: "Papers científicos y investigaciones"
        };
      case "phases":
        return {
          title: "Fases del Ciclo",
          description: "Comprende cada etapa de tu ciclo",
          unitLabel: "guías",
          details: "Folicular, ovulación, lútea y menstrual"
        };
      case "inclusivity":
        return {
          title: "Inclusividad & Género",
          description: "Apoyo para todas las identidades",
          unitLabel: "recursos",
          details: "Transición, hormonización y apoyo"
        };
      case "maternity":
        return {
          title: "Maternidad & Fertilidad",
          description: "Acompañándote en cada etapa",
          unitLabel: "artículos",
          details: "Fertilidad, embarazo y postparto"
        };
      case "wisdom":
        return {
          title: "Sabiduría & Longevidad",
          description: "Acompañándote a lo largo de la vida",
          unitLabel: "artículos",
          details: "Menopausia, longevidad y bienestar"
        };
      default:
        return {
          title: "Categoría",
          description: "Descripción",
          unitLabel: "artículos",
          details: "Contenido variado"
        };
    }
  };

  const config = getCategoryConfig(categoryId);

  return (
    <div className="w-full h-full">
      {!isExpanded ? (
        // Vista compacta - tienda que ocupa toda la caja
        <TentCard categoryId={categoryId} onClick={onToggle || (() => {})} />
      ) : (
        // Vista expandida - contenido completo
        <div className="h-full flex flex-col p-4 bg-white/30 rounded-xl border border-[#C62328]/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#7a2323]">
                {config.title}
              </h3>
              <p className="text-sm text-[#5b0108]">
                {data.totalCount} {config.unitLabel} • {data.newCount} nuevos
              </p>
            </div>
            <button
              onClick={onToggle}
              className="text-[#C62328] hover:text-[#9d0d0b] transition-colors text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-auto space-y-4">
            <AnimatePresence>
              {data.articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArticlePreview article={article} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            <motion.button
              className="w-full py-3 bg-[#C62328] text-white rounded-xl font-medium hover:bg-[#9d0d0b] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver todos los {config.unitLabel} ({data.totalCount})
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

const LibraryPage: React.FC = () => {
  console.log('LibraryPage: Renderizando RED TENT - Salud Femenina');

  // Configurar items del grid de la biblioteca
  const libraryItems = useMemo(() => [
    {
      id: "history",
      title: "Historia Menstrual",
      component: <CategoryCard categoryId="history" isExpanded={false} />,
      isExpanded: false,
    },
    {
      id: "science", 
      title: "Ciencia & Investigación",
      component: <CategoryCard categoryId="science" isExpanded={false} />,
      isExpanded: false,
    },
    {
      id: "phases",
      title: "Fases del Ciclo", 
      component: <CategoryCard categoryId="phases" isExpanded={false} />,
      isExpanded: false,
    },
    {
      id: "inclusivity",
      title: "Inclusividad & Género",
      component: <CategoryCard categoryId="inclusivity" isExpanded={false} />,
      isExpanded: false,
    },
    {
      id: "maternity",
      title: "Maternidad & Fertilidad",
      component: <CategoryCard categoryId="maternity" isExpanded={false} />,
      isExpanded: false,
    },
    {
      id: "wisdom",
      title: "Sabiduría & Longevidad", 
      component: <CategoryCard categoryId="wisdom" isExpanded={false} />,
      isExpanded: false,
    },
  ], []);

  // Manejar expansión de categorías
  const handleItemsChange = (newItems: any[]) => {
    // Actualizar componentes con estado de expansión
    const updatedItems = newItems.map(item => {
      const isExpanded = item.isExpanded || false;
      const component = (
        <CategoryCard 
          categoryId={item.id} 
          isExpanded={isExpanded} 
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
    
    console.log("LibraryPage: Categorías actualizadas:", updatedItems.map(i => ({ id: i.id, expanded: i.isExpanded })));
  };

  return (
    <motion.div 
      className="w-full h-full bg-[#e7e0d5] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header sutil de la biblioteca */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-10 p-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="flex items-center justify-center">
          <motion.div
            className="bg-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 flex items-center gap-3"
            style={{
              border: "1px solid rgba(198, 35, 40, 0.2)",
              boxShadow: `
                8px 8px 16px rgba(91, 1, 8, 0.1),
                -8px -8px 16px rgba(255, 255, 255, 0.6)
              `,
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center">
              <h1 className="text-lg font-serif font-bold text-[#7a2323] leading-none">
                RED TENT
              </h1>
              <p className="text-xs text-[#5b0108] leading-none mt-1">
                Conocimiento y sabiduría femenina
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Grid principal de categorías */}
      <motion.div
        className="w-full h-full pt-20"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <DraggableGrid
          items={libraryItems}
          onItemsChange={handleItemsChange}
        />
      </motion.div>

      {/* Partículas flotantes de fondo para efecto mágico */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#C62328] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LibraryPage;