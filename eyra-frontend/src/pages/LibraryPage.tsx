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

const ITEMS_PER_PAGE = 10;

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

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const getTypeColor = (type: LibraryContent["type"]): string => {
  const colors = {
    historical: "linear-gradient(135deg, #C62328, #9d0d0b)",
    research: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    advice: "linear-gradient(135deg, #059669, #047857)",
    campaign: "linear-gradient(135deg, #dc2626, #b91c1c)",
    article: "linear-gradient(135deg, #6b7280, #4b5563)",
  };
  return colors[type] || colors.article;
};

const getTypeIcon = (type: LibraryContent["type"]): React.ReactElement => {
  const iconStyle = { width: "16px", height: "16px", color: "white" };
  
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
    advice: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
      </svg>
    ),
    campaign: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
      </svg>
    ),
    article: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
      </svg>
    ),
  };
  
  return icons[type] || icons.article;
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
    className="aspect-square cursor-pointer group relative overflow-hidden"
    style={{
      background: "linear-gradient(145deg, #fafaf9, #e7e5e4)",
      borderRadius: "20px",
      border: "1px solid rgba(91, 1, 8, 0.08)",
      boxShadow: `
        8px 8px 16px rgba(91, 1, 8, 0.06),
        -8px -8px 16px rgba(255, 255, 255, 0.4)
      `,
    }}
    whileHover={{
      scale: 1.05,
      boxShadow: `
        12px 12px 24px rgba(91, 1, 8, 0.1),
        -12px -12px 24px rgba(255, 255, 255, 0.6)
      `,
    }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    onClick={onClick}
  >
    {article.isNew && (
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-[#C62328] text-white text-xs px-2 py-1 rounded-full font-medium">
          Nuevo
        </div>
      </div>
    )}

    <div className="p-4 h-full flex flex-col justify-between">
      <div className="flex-shrink-0 mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: getTypeColor(article.type),
            boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {getTypeIcon(article.type)}
        </div>
      </div>

      <div className="flex-1 mb-3">
        <h4 className="text-sm font-semibold text-[#5b0108] leading-tight line-clamp-3 group-hover:text-[#C62328] transition-colors">
          {article.title}
        </h4>
      </div>

      <div className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs bg-[#e7e0d5] text-[#5b0108] px-2 py-1 rounded-lg font-medium">
            {article.tags[0]}
          </span>
          <span className="text-xs text-[#a62c2c] font-semibold">
            {article.readTime}
          </span>
        </div>
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(231, 224, 213, 0.7)" }}
      >
        <div className="absolute inset-0" onClick={onClose} />
        
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
        >
          <button
            type="button"
            onClick={onClose}
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
    className="relative flex-1 max-w-sm"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.3 }}
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
      className="flex-shrink-0 flex items-center justify-center gap-6 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <motion.button
        onClick={onPrevious}
        disabled={currentPage === 0}
        className={`p-3 rounded-full ${
          currentPage === 0
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#C62328]/10 cursor-pointer"
        } transition-all duration-200`}
        style={{
          background: currentPage === 0 ? "transparent" : "linear-gradient(145deg, #fafaf9, #e7e5e4)",
          boxShadow: currentPage === 0 ? "none" : `
            4px 4px 8px rgba(91, 1, 8, 0.06),
            -4px -4px 8px rgba(255, 255, 255, 0.4)
          `,
        }}
        whileHover={currentPage > 0 ? { scale: 1.1 } : {}}
        whileTap={currentPage > 0 ? { scale: 0.9 } : {}}
      >
        <svg className="w-5 h-5 text-[#C62328]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </motion.button>

      <div className="flex items-center gap-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <motion.button
            key={i}
            onClick={() => onGoToPage(i)}
            className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center text-sm font-medium ${
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
                  4px 4px 8px rgba(91, 1, 8, 0.06),
                  -4px -4px 8px rgba(255, 255, 255, 0.4)
                `,
            }}
            whileHover={{ 
              scale: 1.1,
              background: i === currentPage 
                ? "linear-gradient(135deg, #C62328, #9d0d0b)"
                : "linear-gradient(135deg, #C62328, #9d0d0b)"
            }}
            whileTap={{ scale: 0.9 }}
          >
            {i + 1}
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className={`p-3 rounded-full ${
          currentPage === totalPages - 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#C62328]/10 cursor-pointer"
        } transition-all duration-200`}
        style={{
          background: currentPage === totalPages - 1 ? "transparent" : "linear-gradient(145deg, #fafaf9, #e7e5e4)",
          boxShadow: currentPage === totalPages - 1 ? "none" : `
            4px 4px 8px rgba(91, 1, 8, 0.06),
            -4px -4px 8px rgba(255, 255, 255, 0.4)
          `,
        }}
        whileHover={currentPage < totalPages - 1 ? { scale: 1.1 } : {}}
        whileTap={currentPage < totalPages - 1 ? { scale: 0.9 } : {}}
      >
        <svg className="w-5 h-5 text-[#C62328]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </motion.button>
    </motion.div>
  );
};

const ExpandedContent: React.FC<{ categoryId: string }> = ({ categoryId }) => {
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
        <div className="flex-shrink-0 mb-8">
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

            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </motion.div>
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pagination.currentPage}
              className="grid grid-cols-5 gap-4 h-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
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

          <div className="text-center max-w-full px-1">
            <p className="text-sm font-serif font-bold text-[#7a2323] mb-1 truncate">
              {config.name}
            </p>
            <p className="text-xs font-sans text-[#5b0108] leading-tight line-clamp-2">
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

        <div className="text-center max-w-[90%] px-2 mt-3 flex-shrink-0">
          <p className="text-xl font-serif font-bold text-[#7a2323] whitespace-nowrap mb-2">
            {config.name}
          </p>
          <p className="text-sm font-sans text-[#5b0108] leading-tight">
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
    const hasExpandedItem = newItems.some((item) => item.isExpanded);
    
    const updatedItems = newItems.map((item) => {
      const isExpanded = item.isExpanded || false;
      const isSmall = hasExpandedItem && !isExpanded;
      
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
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="grid grid-cols-4 gap-8 px-8">
          <div></div>
          
          <div className="col-span-2 flex justify-center">
            <motion.div
              className="bg-white/30 backdrop-blur-sm rounded-2xl px-8 py-4 flex items-center gap-3 max-w-lg"
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
                <h1 className="text-xl font-serif font-bold text-[#7a2323] leading-none mb-2">
                  RED TENT
                </h1>
                <p className="text-sm text-[#5b0108] leading-relaxed">
                  Espacios sagrados donde las mujeres compartían relatos y sabiduría ancestral durante sus ciclos, 
                  creando vínculos que enriquecían la cultura femenina a través de generaciones.
                </p>
              </div>
            </motion.div>
          </div>
          
          <div></div>
        </div>
      </motion.div>

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
