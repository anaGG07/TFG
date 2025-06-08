import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const IntrospectionBox: React.FC = () => {
  const [highlight, setHighlight] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const allContent = await adminContentService.listContent();
        if (allContent && allContent.length > 0) {
          // Filtrar solo los que tienen description o content
          const candidates = allContent.filter(
            c => (c as any)?.description || (c as any)?.content
          );
          // Elegir aleatoriamente uno
          setHighlight(getRandomElement(candidates));
        }
      } catch (e) {
        setHighlight(null);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getFragment = (c: Content | null) => {
    if (!c) return "";
    if ((c as any)?.description) return (c as any).description;
    if ((c as any)?.content) return (c as any).content.slice(0, 180) + ((c as any).content.length > 180 ? "..." : "");
    return "";
  };

  const getTypeLabel = (c: Content | null) => {
    if (!c) return "";
    return typeLabels[c.type?.toLowerCase?.()] || c.type || "";
  };

  const getDate = (_c: Content | null) => "";

  return (
    <div className="h-full flex flex-col justify-center items-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="rounded-2xl shadow-inner p-6 max-w-xl w-full"
        style={{ boxShadow: "0 4px 24px 0 #e7e0d5, 0 -4px 24px 0 #fff", background: 'transparent' }}
      >
        {loading ? (
          <div className="text-center text-[#C62328] text-lg font-serif italic animate-pulse">Cargando...</div>
        ) : highlight ? (
          <>
            <div className="text-center text-lg md:text-xl font-serif italic text-[#C62328] mb-4">
              “{getFragment(highlight)}”
            </div>
            <div className="text-center text-xs text-[#7a2323] opacity-80">
              {getTypeLabel(highlight)}
            </div>
          </>
        ) : (
          <div className="text-center text-[#C62328] text-lg font-serif italic">
            "La introspección es el primer paso hacia el bienestar."
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default IntrospectionBox; 