  const titleData = getCategoryTitle(categoryId);
  const config = getCategoryConfig(categoryId);

  // Filtrar artículos según búsqueda
  const filteredArticles = data.articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calcular paginación
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const currentArticles = filteredArticles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Navegación de páginas
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

  // Manejar apertura de modal
  const handleArticleClick = (article: LibraryContent) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  // Manejar cierre de modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <>
      <div className="h-full flex flex-col p-8">
        {/* Header rediseñado - título a la izquierda, buscador a la derecha */}
        <div className="flex-shrink-0 mb-8">
          <motion.div
            className="flex items-start justify-between gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Título y resumen - lado izquierdo */}
            <div className="flex-shrink-0">
              <h3 className="text-3xl font-serif font-bold text-[#7a2323] mb-2">
                {titleData.name}
              </h3>
              <p className="text-base text-[#5b0108]">
                {data.totalCount} {config.unitLabel} • {data.newCount} nuevos
              </p>
            </div>

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
                onChange={(e) => setSearchTerm(e.target.value)}
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
          </motion.div>
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="grid grid-cols-5 gap-4 h-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentArticles.map((article, index) => (
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

        {totalPages > 1 && (
          <motion.div
            className="flex-shrink-0 flex items-center justify-center gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <motion.button
              onClick={prevPage}
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
                  onClick={() => setCurrentPage(i)}
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
              onClick={nextPage}
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
        )}
      </div>

      <ArticleModal 
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

// Componente genérico para categorías
const CategoryCard = ({
  categoryId,
  isExpanded,
  onToggle,
  isSmall = false,
}: {
  categoryId: string;
  isExpanded: boolean;
  onToggle?: () => void;
  isSmall?: boolean;
}) => {
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
// COMPONENTE PRINCIPAL
// =============================================================================

const LibraryPage: React.FC = () => {
  console.log("LibraryPage: Renderizando RED TENT - Salud Femenina");

  const libraryItems = useMemo(
    () => [
      {
        id: "history",
        title: "Historia Menstrual",
        component: <CategoryCard categoryId="history" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="history" />,
        isExpanded: false,
      },
      {
        id: "science",
        title: "Ciencia & Investigación",
        component: <CategoryCard categoryId="science" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="science" />,
        isExpanded: false,
      },
      {
        id: "phases",
        title: "Fases del Ciclo",
        component: <CategoryCard categoryId="phases" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="phases" />,
        isExpanded: false,
      },
      {
        id: "inclusivity",
        title: "Inclusividad & Género",
        component: <CategoryCard categoryId="inclusivity" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="inclusivity" />,
        isExpanded: false,
      },
      {
        id: "maternity",
        title: "Maternidad & Fertilidad",
        component: <CategoryCard categoryId="maternity" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="maternity" />,
        isExpanded: false,
      },
      {
        id: "wisdom",
        title: "Sabiduría & Longevidad",
        component: <CategoryCard categoryId="wisdom" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="wisdom" />,
        isExpanded: false,
      },
    ],
    []
  );

  const handleItemsChange = (newItems: any[]) => {
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
                {titleData.name}
              </h3>
              <p className="text-base text-[#5b0108]">
                {data.totalCount} {config.unitLabel} • {data.newCount} nuevos
              </p>
            </div>

            {/* Buscador - lado derecho */}
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
          </motion.div>
        </div>

        {/* Grid de widgets */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="grid grid-cols-5 gap-4 h-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentArticles.map((article, index) => (
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

        {/* Paginación mejorada */}
        {totalPages > 1 && (
          <motion.div
            className="flex-shrink-0 flex items-center justify-center gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <motion.button
              onClick={prevPage}
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
                  onClick={() => setCurrentPage(i)}
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
              onClick={nextPage}
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
        )}
      </div>

      {/* Modal de artículo */}
      <ArticleModal 
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );import React, { useMemo, useState } from "react";
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

// Componente para cada "icono" del grid tipo app store
const ContentCard = ({ article, index }: { article: LibraryContent, index: number }) => (
  <motion.div
    className="aspect-square cursor-pointer group relative overflow-hidden"
    style={{
      background: "linear-gradient(145deg, #fafaf9, #e7e5e4)",
      borderRadius: "16px",
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
  >
    {/* Badge nuevo */}
    {article.isNew && (
      <div className="absolute top-2 right-2 z-10">
        <div className="bg-[#C62328] text-white text-xs px-2 py-1 rounded-full font-medium">
          Nuevo
        </div>
      </div>
    )}

    {/* Contenido de la tarjeta */}
    <div className="p-4 h-full flex flex-col justify-between">
      {/* Icono/Ilustración */}
      <div className="flex-shrink-0 mb-3">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: getTypeColor(article.type),
            boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {getTypeIcon(article.type)}
        </div>
      </div>

      {/* Título */}
      <div className="flex-1 mb-2">
        <h4 className="text-sm font-semibold text-[#5b0108] leading-tight line-clamp-2 group-hover:text-[#C62328] transition-colors">
          {article.title}
        </h4>
      </div>

      {/* Footer con tags y tiempo */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs bg-[#e7e0d5] text-[#5b0108] px-2 py-1 rounded-lg">
            {article.tags[0]}
          </span>
          <span className="text-xs text-[#a62c2c] font-medium">
            {article.readTime}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Funciones helper para iconos y colores
const getTypeColor = (type: string) => {
  switch (type) {
    case "historical": return "linear-gradient(135deg, #C62328, #9d0d0b)";
    case "research": return "linear-gradient(135deg, #2563eb, #1d4ed8)";
    case "advice": return "linear-gradient(135deg, #059669, #047857)";
    case "campaign": return "linear-gradient(135deg, #dc2626, #b91c1c)";
    default: return "linear-gradient(135deg, #6b7280, #4b5563)";
  }
};

const getTypeIcon = (type: string) => {
  const iconStyle = { width: "16px", height: "16px", color: "white" };
  switch (type) {
    case "historical":
      return <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
    case "research":
      return <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>;
    case "advice":
      return <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>;
    default:
      return <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg>;
  }
};

// Modal para mostrar contenido de artículos
const ArticleModal = ({ 
  article, 
  isOpen, 
  onClose 
}: { 
  article: LibraryContent | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
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
        {/* Overlay */}
        <div className="absolute inset-0" onClick={onClose} />
        
        {/* Modal */}
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
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-[#C62328] hover:text-[#7a2323] transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contenido del modal */}
          <div className="pr-8">
            {/* Header del artículo */}
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
            
            {/* Contenido del artículo (simulado) */}
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

// Widget component para artículos
const ArticleWidget = ({ 
  article, 
  index, 
  onClick 
}: { 
  article: LibraryContent; 
  index: number; 
  onClick: () => void; 
}) => (
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
    {/* Badge nuevo */}
    {article.isNew && (
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-[#C62328] text-white text-xs px-2 py-1 rounded-full font-medium">
          Nuevo
        </div>
      </div>
    )}

    {/* Contenido del widget */}
    <div className="p-4 h-full flex flex-col justify-between">
      {/* Icono del tipo */}
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

      {/* Título */}
      <div className="flex-1 mb-3">
        <h4 className="text-sm font-semibold text-[#5b0108] leading-tight line-clamp-3 group-hover:text-[#C62328] transition-colors">
          {article.title}
        </h4>
      </div>

      {/* Footer con tag principal y tiempo */}
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

// Componente SOLO para contenido expandido (SIN TIENDA) - REDISEÑADO
const ExpandedContent = ({ categoryId }: { categoryId: string }) => {
  const data = libraryData[categoryId];
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<LibraryContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10; // 10 widgets por página
  
  const getCategoryTitle = (id: string) => {
    switch (id) {
      case "history":
        return { name: "Mnemósine" };
      case "science":
        return { name: "Atenea" };
      case "phases":
        return { name: "Selene" };
      case "inclusivity":
        return { name: "Artemisa" };
      case "maternity":
        return { name: "Deméter" };
      case "wisdom":
        return { name: "Hestia" };
      default:
        return { name: "Refugio" };
    }
  };

  const getCategoryConfig = (id: string) => {
    switch (id) {
      case "history":
        return { unitLabel: "artículos" };
      case "science":
        return { unitLabel: "estudios" };
      case "phases":
        return { unitLabel: "guías" };
      case "inclusivity":
        return { unitLabel: "recursos" };
      case "maternity":
        return { unitLabel: "artículos" };
      case "wisdom":
        return { unitLabel: "artículos" };
      default:
        return { unitLabel: "artículos" };
    }
  };

};

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
            className={`h-0.5 bg-gradient-to-r from-transparent via-[#C62328] to-transparent transition-all duration-300 rounded-full mb-2 flex-shrink-0 ${
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
        {/* Tienda de campaña - tamaño grande, espaciado controlado */}
        <div className="flex items-end justify-center w-full flex-shrink-0">
          <svg
            width="85%"
            height="65%"
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

        {/* Línea base expandible - pegada a la tienda */}
        <div
          className={`h-0.5 bg-gradient-to-r from-transparent via-[#C62328] to-transparent transition-all duration-500 rounded-full flex-shrink-0 ${
            isHovered ? "w-4/5 opacity-100 shadow-lg" : "w-3/5 opacity-50"
          }`}
        />

        {/* Título y descripción mitológicos - con espaciado controlado */}
        <div className="text-center max-w-[90%] px-2 mt-3 flex-shrink-0">
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
        // Vista expandida - contenido completo SIN TIENDA
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
        expandedComponent: <ExpandedContent categoryId="history" />,
        isExpanded: false,
      },
      {
        id: "science",
        title: "Ciencia & Investigación",
        component: <CategoryCard categoryId="science" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="science" />,
        isExpanded: false,
      },
      {
        id: "phases",
        title: "Fases del Ciclo",
        component: <CategoryCard categoryId="phases" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="phases" />,
        isExpanded: false,
      },
      {
        id: "inclusivity",
        title: "Inclusividad & Género",
        component: <CategoryCard categoryId="inclusivity" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="inclusivity" />,
        isExpanded: false,
      },
      {
        id: "maternity",
        title: "Maternidad & Fertilidad",
        component: <CategoryCard categoryId="maternity" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="maternity" />,
        isExpanded: false,
      },
      {
        id: "wisdom",
        title: "Sabiduría & Longevidad",
        component: <CategoryCard categoryId="wisdom" isExpanded={false} />,
        expandedComponent: <ExpandedContent categoryId="wisdom" />,
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
      {/* Header sutil de la biblioteca - desplazado hacia la derecha respecto a las tiendas */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="grid grid-cols-4 gap-8 px-8">
          {/* Columna vacía izquierda */}
          <div></div>
          
          {/* Columnas central-derecha con header */}
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
          
          {/* Columna vacía derecha */}
          <div></div>
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
