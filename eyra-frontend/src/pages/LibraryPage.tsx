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
        summary:
          "Historia del movimiento que transformó la percepción social de la menstruación",
        type: "historical",
        readTime: "8 min",
        tags: ["historia", "activismo", "sociedad"],
        isNew: true,
      },
      {
        id: "h2",
        title: "Rituales Ancestrales: La Menstruación en Culturas Antiguas",
        summary:
          "Explorando cómo las civilizaciones honraban los ciclos femeninos",
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

// Componente de tienda de campaña rediseñado - Solo la tienda, sin caja
const TentButton = ({
  categoryId,
  onClick,
  isSmall = false, // Nueva prop para distinguir tamaño
}: {
  categoryId: string;
  onClick: () => void;
  isSmall?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick();
  };

  const getCategoryTitle = (id: string) => {
    switch (id) {
      case "history":
        return {
          name: "Mnemósine",
          description: "Historias reales de la menstruación en civilizaciones antiguas"
        };
      case "science":
        return {
          name: "Atenea", 
          description: "Papers científicos y estudios sobre el ciclo menstrual"
        };
      case "phases":
        return {
          name: "Selene",
          description: "Mitología y creencias ancestrales sobre la menstruación"
        };
      case "inclusivity":
        return {
          name: "Artemisa",
          description: "Productos naturales y remedios para el bienestar menstrual"
        };
      case "maternity":
        return {
          name: "Deméter",
          description: "Rituales, ceremonias y tradiciones del ciclo femenino"
        };
      case "wisdom":
        return {
          name: "Hestia",
          description: "Sabiduría ancestral y enseñanzas de mujeres sabias"
        };
      default:
        return {
          name: "Refugio",
          description: "Tu espacio sagrado de conocimiento"
        };
    }
  };

  const titleData = getCategoryTitle(categoryId);

  // Si es pequeño (versión expandida), mostrar solo texto
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
          {/* Línea base expandible */}
          <div
            className={`h-0.5 bg-gradient-to-r from-transparent via-[#C62328] to-transparent transition-all duration-300 rounded-full mb-2 ${
              isHovered ? "w-4/5 opacity-100 shadow-lg" : "w-3/5 opacity-60"
            }`}
          />

          {/* Título y descripción */}
          <div className="text-center max-w-full px-1">
            <p className="text-sm font-serif font-bold text-[#7a2323] mb-1 truncate">
              {titleData.name}
            </p>
            <p className="text-xs font-sans text-[#5b0108] leading-tight line-clamp-2">
              {titleData.description}
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
        {/* Tienda de campaña - más centrada y elevada */}
        <div className="flex items-center justify-center w-full mb-2">
          <svg
            width="85%"
            height="60%"
            viewBox="0 0 300 180"
            className={`transition-all duration-500 ${
              isClicked ? "scale-95" : "scale-100"
            }`}
          >
            {/* Lado izquierdo de la tienda - ajustado para unión perfecta */}
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

            {/* Lado derecho de la tienda - ajustado para unión perfecta */}
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

            {/* Interior visible cuando se abre - solo efecto glow, sin círculos */}
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
                
                {/* Solo efecto glow difuminado - clipeado dentro de la tienda */}
                <g clipPath={`url(#glow-${categoryId})`}>
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

        {/* Línea base expandible - más cerca de la tienda */}
        <div
          className={`h-0.5 bg-gradient-to-r from-transparent via-[#C62328] to-transparent transition-all duration-500 rounded-full mb-4 ${
            isHovered ? "w-4/5 opacity-100 shadow-lg" : "w-3/5 opacity-50"
          }`}
        />

        {/* Título y descripción mitológicos */}
        <div className="text-center max-w-[90%] px-2">
          <p className="text-xl font-serif font-bold text-[#7a2323] whitespace-nowrap mb-2">
            {titleData.name}
          </p>
          <p className="text-sm font-sans text-[#5b0108] leading-tight">
            {titleData.description}
          </p>
        </div>
      </button>
    </div>
  );
};

// Componente genérico para todas las categorías
const CategoryCard = ({
  categoryId,
  isExpanded,
  onToggle,
  isSmall = false, // Nueva prop
}: {
  categoryId: string;
  isExpanded: boolean;
  onToggle?: () => void;
  isSmall?: boolean;
}) => {
  const data = libraryData[categoryId];

  const getCategoryTitle = (id: string) => {
    switch (id) {
      case "history":
        return {
          name: "Mnemósine",
          description: "Historias reales de la menstruación en civilizaciones antiguas"
        };
      case "science":
        return {
          name: "Atenea", 
          description: "Papers científicos y estudios sobre el ciclo menstrual"
        };
      case "phases":
        return {
          name: "Selene",
          description: "Mitología y creencias ancestrales sobre la menstruación"
        };
      case "inclusivity":
        return {
          name: "Artemisa",
          description: "Productos naturales y remedios para el bienestar menstrual"
        };
      case "maternity":
        return {
          name: "Deméter",
          description: "Rituales, ceremonias y tradiciones del ciclo femenino"
        };
      case "wisdom":
        return {
          name: "Hestia",
          description: "Sabiduría ancestral y enseñanzas de mujeres sabias"
        };
      default:
        return {
          name: "Refugio",
          description: "Tu espacio sagrado de conocimiento"
        };
    }
  };

  const titleData = getCategoryTitle(categoryId);

  const getCategoryConfig = (id: string) => {
    switch (id) {
      case "history":
        return {
          title: "Historia Menstrual",
          description: "Explorando el pasado para entender el presente",
          unitLabel: "artículos",
          details: "Campañas rojas, rituales ancestrales y más",
        };
      case "science":
        return {
          title: "Ciencia & Investigación",
          description: "Evidencia científica y estudios contrastados",
          unitLabel: "estudios",
          details: "Papers científicos y investigaciones",
        };
      case "phases":
        return {
          title: "Fases del Ciclo",
          description: "Comprende cada etapa de tu ciclo",
          unitLabel: "guías",
          details: "Folicular, ovulación, lútea y menstrual",
        };
      case "inclusivity":
        return {
          title: "Inclusividad & Género",
          description: "Apoyo para todas las identidades",
          unitLabel: "recursos",
          details: "Transición, hormonización y apoyo",
        };
      case "maternity":
        return {
          title: "Maternidad & Fertilidad",
          description: "Acompañándote en cada etapa",
          unitLabel: "artículos",
          details: "Fertilidad, embarazo y postparto",
        };
      case "wisdom":
        return {
          title: "Sabiduría & Longevidad",
          description: "Acompañándote a lo largo de la vida",
          unitLabel: "artículos",
          details: "Menopausia, longevidad y bienestar",
        };
      default:
        return {
          title: "Categoría",
          description: "Descripción",
          unitLabel: "artículos",
          details: "Contenido variado",
        };
    }
  };

  const config = getCategoryConfig(categoryId);

  return (
    <div className={`flex flex-col h-full ${!isExpanded ? '' : 'p-4'}`}>
      {!isExpanded ? (
        // Vista compacta - botón de tienda (pasamos isSmall)
        <TentButton 
          categoryId={categoryId} 
          onClick={onToggle || (() => {})} 
          isSmall={isSmall}
        />
      ) : (
        // Vista expandida - contenido completo
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#7a2323]">
                {titleData.name}
              </h3>
              <p className="text-sm text-[#5b0108]">
                {data.totalCount} {config.unitLabel} • {data.newCount} nuevos
              </p>
            </div>
            <button
              onClick={onToggle}
              className="text-[#C62328] hover:text-[#9d0d0b] transition-colors"
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
  console.log("LibraryPage: Renderizando RED TENT - Salud Femenina");

  // Configurar items del grid de la biblioteca
  const libraryItems = useMemo(
    () => [
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
    ],
    []
  );

  // Manejar expansión de categorías
  const handleItemsChange = (newItems: any[]) => {
    // Determinar si hay algún item expandido
    const hasExpandedItem = newItems.some((item) => item.isExpanded);
    
    // Actualizar componentes con estado de expansión
    const updatedItems = newItems.map((item) => {
      const isExpanded = item.isExpanded || false;
      // Si hay un item expandido, los demás son "small"
      const isSmall = hasExpandedItem && !isExpanded;
      
      const component = (
        <CategoryCard
          categoryId={item.id}
          isExpanded={isExpanded}
          isSmall={isSmall}
          onToggle={() => {
            // Aquí manejarías el toggle, pero DraggableGrid debería exponer esta funcionalidad
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
      {/* Header sutil de la biblioteca - reducido el padding */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 p-4"
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

      {/* Grid principal de categorías - menos padding top */}
      <motion.div
        className="w-full h-full pt-16"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <DraggableGrid items={libraryItems} onItemsChange={handleItemsChange} isLibrary={true} />
      </motion.div>
    </motion.div>
  );
};

export default LibraryPage;
