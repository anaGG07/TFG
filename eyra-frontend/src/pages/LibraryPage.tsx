import React, { useMemo } from "react";
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

// Iconos SVG especializados para cada categoría
const HistoryIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    <path d="M12 6v6l4 2"/>
    <path d="M8 2v4"/>
    <path d="M16 2v4"/>
  </svg>
);

const ScienceIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 11a3 3 0 0 1 6 0l-6 0z"/>
    <path d="M6 21h12l-6-9-6 9z"/>
    <circle cx="12" cy="7" r="1"/>
  </svg>
);

const PhasesIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a10 10 0 0 0 0 20"/>
    <path d="M12 2a10 10 0 0 1 0 20"/>
  </svg>
);

const InclusivityIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const MaternityIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const WisdomIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    <path d="M12 7v14"/>
  </svg>
);

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

// Componente genérico para todas las categorías
const CategoryCard = ({ 
  categoryId, 
  isExpanded 
}: { 
  categoryId: string; 
  isExpanded: boolean; 
}) => {
  const data = libraryData[categoryId];
  
  const getCategoryConfig = (id: string) => {
    switch (id) {
      case "history":
        return {
          icon: HistoryIcon,
          title: "Historia Menstrual",
          description: "Explorando el pasado para entender el presente",
          unitLabel: "artículos",
          details: "🔴 Campañas rojas, rituales ancestrales y más"
        };
      case "science":
        return {
          icon: ScienceIcon,
          title: "Ciencia & Investigación",
          description: "Evidencia científica y estudios contrastados",
          unitLabel: "estudios",
          details: "🔴 Papers científicos y investigaciones"
        };
      case "phases":
        return {
          icon: PhasesIcon,
          title: "Fases del Ciclo",
          description: "Comprende cada etapa de tu ciclo",
          unitLabel: "guías",
          details: "🔴 Folicular, ovulación, lútea y menstrual"
        };
      case "inclusivity":
        return {
          icon: InclusivityIcon,
          title: "Inclusividad & Género",
          description: "Apoyo para todas las identidades",
          unitLabel: "recursos",
          details: "🔴 Transición, hormonización y apoyo"
        };
      case "maternity":
        return {
          icon: MaternityIcon,
          title: "Maternidad & Fertilidad",
          description: "Acompañándote en cada etapa",
          unitLabel: "artículos",
          details: "🔴 Fertilidad, embarazo y postparto"
        };
      case "wisdom":
        return {
          icon: WisdomIcon,
          title: "Sabiduría & Longevidad",
          description: "Acompañándote a lo largo de la vida",
          unitLabel: "artículos",
          details: "🔴 Menopausia, longevidad y bienestar"
        };
      default:
        return {
          icon: WisdomIcon,
          title: "Categoría",
          description: "Descripción",
          unitLabel: "artículos",
          details: "🔴 Contenido variado"
        };
    }
  };

  const config = getCategoryConfig(categoryId);
  const IconComponent = config.icon;

  return (
    <div className="flex flex-col h-full">
      {!isExpanded ? (
        // Vista compacta
        <>
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
            style={{
              background: "#f5ede6",
              boxShadow: `
                inset 2px 2px 4px rgba(91, 1, 8, 0.1),
                inset -2px -2px 4px rgba(255, 255, 255, 0.8)
              `,
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <IconComponent className="w-6 h-6" />
          </motion.div>
          <h3 className="text-lg font-serif font-bold text-[#7a2323] mb-3 text-center">
            {config.title}
          </h3>
          <p className="text-sm text-[#5b0108] mb-4 text-center">
            {config.description}
          </p>
          <div className="mt-auto text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <span className="text-xs text-[#C62328] font-semibold">
                {data.totalCount} {config.unitLabel}
              </span>
              {data.newCount > 0 && (
                <span className="bg-[#C62328] text-white text-xs px-2 py-1 rounded-full">
                  {data.newCount} nuevos
                </span>
              )}
            </div>
            <p className="text-xs text-[#a62c2c]">
              {config.details}
            </p>
          </div>
        </>
      ) : (
        // Vista expandida
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <IconComponent className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-serif font-bold text-[#7a2323]">
                {config.title}
              </h3>
              <p className="text-sm text-[#5b0108]">
                {data.totalCount} {config.unitLabel} • {data.newCount} nuevos
              </p>
            </div>
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
  console.log('LibraryPage: Renderizando Biblioteca de Alejandría - Salud Femenina');

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
      const component = <CategoryCard categoryId={item.id} isExpanded={isExpanded} />;
      
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
            <WisdomIcon className="w-6 h-6" />
            <div className="text-center">
              <h1 className="text-lg font-serif font-bold text-[#7a2323] leading-none">
                Biblioteca de Alejandría
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