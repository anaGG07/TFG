import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminContentService } from "../../services/adminContentService";
import type { Content } from "../../types/domain";

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const typeLabels: Record<string, string> = {
  nutrition: "Nutrición",
  exercise: "Ejercicio", 
  article: "Artículo",
  selfcare: "Autocuidado",
  recommendation: "Recomendación",
  educational: "Educativo",
  advice: "Consejo",
  research: "Investigación",
  historical: "Historia",
};

// Datos simulados similar a LibraryPage para consistencia
const fallbackArticles = [
  {
    id: "intro1",
    title: "Las Campañas Rojas: Reclamando el Poder Menstrual",
    summary: "Historia del movimiento que transformó la percepción social de la menstruación",
    content: "Este artículo explora cómo los movimientos activistas han trabajado para desmitificar la menstruación y empoderar a las mujeres a través de la educación y la normalización de los ciclos naturales.",
    type: "historical" as const,
    readTime: "8 min",
    tags: ["historia", "activismo", "sociedad"],
    isNew: true,
  },
  {
    id: "intro2", 
    title: "Rituales Ancestrales: La Menstruación en Culturas Antiguas",
    summary: "Explorando cómo las civilizaciones honraban los ciclos femeninos",
    content: "Un viaje fascinante por las diferentes culturas que veían la menstruación como un proceso sagrado, lleno de rituales de poder y conexión espiritual.",
    type: "historical" as const,
    readTime: "12 min",
    tags: ["cultura", "rituales", "ancestral"],
    isNew: false,
  },
  {
    id: "intro3",
    title: "Nuevos Hallazgos en Investigación Hormonal", 
    summary: "Últimos estudios sobre fluctuaciones hormonales y su impacto",
    content: "Descubrimientos científicos recientes revelan patrones fascinantes sobre cómo las hormonas influyen no solo en el ciclo menstrual, sino en múltiples aspectos de la salud femenina.",
    type: "research" as const,
    readTime: "15 min",
    tags: ["hormonas", "investigación", "ciencia"],
    isNew: true,
  },
];

// Tipos para mantener consistencia con LibraryPage
interface LibraryContent {
  id: string;
  title: string;
  summary: string;
  content?: string;
  type: "historical" | "research" | "phases" | "inclusivity" | "maternity" | "wisdom";
  readTime: string;
  tags: string[];
  isNew?: boolean;
}

const getTypeColor = (type: LibraryContent["type"]): string => {
  const colors = {
    historical: "linear-gradient(135deg, #C62328, #9d0d0b)",
    research: "linear-gradient(135deg, #2563eb, #1d4ed8)", 
    phases: "linear-gradient(135deg, #7c3aed, #5b21b6)",
    inclusivity: "linear-gradient(135deg, #059669, #047857)",
    maternity: "linear-gradient(135deg, #dc2626, #b91c1c)",
    wisdom: "linear-gradient(135deg, #f59e0b, #d97706)",
  };
  return colors[type] || colors.historical;
};

const getTypeIcon = (type: LibraryContent["type"]): React.ReactElement => {
  const iconStyle = { width: "16px", height: "16px", color: "white" };

  const icons = {
    historical: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    research: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path
          fillRule="evenodd"
          d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
          clipRule="evenodd"
        />
      </svg>
    ),
    phases: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
          clipRule="evenodd"
        />
      </svg>
    ),
    inclusivity: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    maternity: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    ),
    wisdom: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return icons[type] || icons.historical;
};

// Modal component reutilizado desde LibraryPage
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
          className="relative bg-[#f5f5f4] rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-lg md:max-w-2xl mx-4 min-h-[400px] sm:min-h-[500px] max-h-[85vh] sm:max-h-[80vh] overflow-auto"
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
            className="absolute top-4 sm:top-6 right-4 sm:right-6 text-[#C62328] hover:text-[#7a2323] transition-colors z-10"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="pr-4 sm:pr-6 md:pr-8">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: getTypeColor(article.type),
                    boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.1)",
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

              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#5b0108] mb-2 sm:mb-3 leading-tight">
                {article.title}
              </h2>

              <p className="text-sm sm:text-base text-[#7a2323] mb-3 sm:mb-4 leading-relaxed">
                {article.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm bg-[#e7e0d5] text-[#5b0108] px-3 py-1 rounded-xl font-medium"
                      style={{
                        boxShadow: "2px 2px 4px rgba(91, 1, 8, 0.08)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-[#a62c2c] font-semibold">
                  {article.readTime}
                </span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="text-[#5b0108] leading-relaxed space-y-4">
                <p>{article.content || article.summary}</p>
                {!article.content && (
                  <>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                      do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco
                      laboris.
                    </p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse
                      cillum dolore eu fugiat nulla pariatur. Excepteur sint
                      occaecat cupidatat non proident.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const IntrospectionBox: React.FC = () => {
  const [highlight, setHighlight] = useState<LibraryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Intentar obtener contenido real del servicio
        const allContent = await adminContentService.listContent();
        if (allContent && allContent.length > 0) {
          // Filtrar solo los que tienen description o content
          const candidates = allContent.filter(
            c => (c as any)?.description || (c as any)?.content
          );
          
          if (candidates.length > 0) {
            // Convertir Content a LibraryContent para el modal
            const randomContent = getRandomElement(candidates);
            
            // Mapear el tipo del contenido a los tipos válidos de LibraryContent
            const mapContentType = (contentType: string): LibraryContent["type"] => {
              const typeMap: Record<string, LibraryContent["type"]> = {
                article: "historical",
                nutrition: "wisdom",
                exercise: "phases", 
                selfcare: "wisdom",
                recommendation: "inclusivity",
                educational: "research",
                advice: "wisdom",
                research: "research",
                historical: "historical",
              };
              return typeMap[contentType?.toLowerCase()] || "historical";
            };
            
            const libraryContent: LibraryContent = {
              id: randomContent.id || String(Date.now()),
              title: randomContent.title || "Contenido sin título",
              summary: (randomContent as any)?.description || "Sin descripción disponible",
              content: (randomContent as any)?.content,
              type: mapContentType(randomContent.type || "article"),
              readTime: "5 min", // Valor por defecto
              tags: [randomContent.type || "general"],
              isNew: false,
            };
            setHighlight(libraryContent);
          } else {
            // Usar fallback si no hay candidatos válidos
            setHighlight(getRandomElement(fallbackArticles));
          }
        } else {
          // Usar artículos de fallback
          setHighlight(getRandomElement(fallbackArticles));
        }
      } catch (e) {
        console.log("IntrospectionBox: Usando contenido de fallback debido a error:", e);
        // En caso de error, usar artículos predefinidos
        setHighlight(getRandomElement(fallbackArticles));
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getFragment = (c: LibraryContent | null) => {
    if (!c) return "";
    // Usar summary primero, luego content truncado
    if (c.summary) return c.summary;
    if (c.content) return c.content.slice(0, 180) + (c.content.length > 180 ? "..." : "");
    return "";
  };

  const getTypeLabel = (c: LibraryContent | null) => {
    if (!c) return "";
    return typeLabels[c.type?.toLowerCase?.()] || c.type || "";
  };

  const handleClick = () => {
    if (highlight) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className="h-full flex flex-col justify-center items-center px-6 py-8 cursor-pointer"
        onClick={handleClick}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-2xl shadow-inner p-6 max-w-xl w-full hover:shadow-lg transition-shadow duration-300"
          style={{ boxShadow: "0 4px 24px 0 #e7e0d5, 0 -4px 24px 0 #fff", background: 'transparent' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="text-center text-[#C62328] text-lg font-serif italic animate-pulse">Cargando...</div>
          ) : highlight ? (
            <>
              <div className="text-center text-lg md:text-xl font-serif italic text-[#C62328] mb-4">
                "{getFragment(highlight)}"
              </div>
              <div className="text-center text-xs text-[#7a2323] opacity-80 mb-2">
                {getTypeLabel(highlight)}
              </div>
              <div className="text-center text-xs text-[#C62328] opacity-60">
                Haz clic para leer más →
              </div>
            </>
          ) : (
            <div className="text-center text-[#C62328] text-lg font-serif italic">
              "La introspección es el primer paso hacia el bienestar."
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal integrado */}
      <ArticleModal
        article={highlight}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default IntrospectionBox;
