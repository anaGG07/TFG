import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCycle } from "../../context/CycleContext";
import { useCurrentCycle } from "../../hooks/useCurrentCycle";
import { RitualIcons } from "../icons/CycleIcons";
import { CyclePhase, ContentType, Content } from "../../types/domain";
import { useViewport } from "../../hooks/useViewport";
import { apiFetch } from "../../utils/httpClient";
import { API_ROUTES } from "../../config/apiRoutes";

type Ritual = {
  title: string;
  description: string;
  duration: string;
  benefits: string[];
};

type PhaseRitual = {
  title: string;
  description: string;
  rituals: Ritual[];
};

type MoonRitual = {
  title: string;
  description: string;
  rituals: Ritual[];
};

type WellbeingRecipe = {
  title: string;
  description: string;
  ingredients: string[];
  benefits: string[];
};

type RitualData = {
  phaseRituals: Record<CyclePhase, PhaseRitual>;
  moonRituals: {
    newMoon: MoonRitual;
    fullMoon: MoonRitual;
  };
  wellbeingRecipes: WellbeingRecipe[];
};

interface RitualsViewProps {
  expanded?: boolean;
}

// ! 09/06/2025 - Componente para mostrar cada ritual individual
interface RitualCardProps {
  ritual: Content;
  index: number;
  isMobile: boolean;
  isGeneral?: boolean;
  isMoon?: boolean;
}

const RitualCard: React.FC<RitualCardProps> = ({
  ritual,
  index,
  isMobile,
  isGeneral = false,
  isMoon = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // ! 09/06/2025 - Prevenir propagación para evitar cerrar el modal
    setIsExpanded(!isExpanded);
  };

  const cardBgColor = isGeneral
    ? "#F0F8FF"
    : isMoon
    ? "#F5F0FF"
    : "transparent";
  const borderColor = isGeneral
    ? "#B3D9F7"
    : isMoon
    ? "#D4C5F9"
    : "transparent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        background: cardBgColor,
        padding: isMobile ? 16 : 20,
        borderRadius: 12,
        border:
          borderColor !== "transparent" ? `1px solid ${borderColor}` : "none",
        boxShadow: isGeneral || isMoon ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontSize: isMobile ? 16 : 18,
              color: "#4A9D7B",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {isMoon && "🌙"} {isGeneral && "✨"} {ritual.title}
          </h4>
          <p
            style={{
              color: "#666",
              marginBottom: 12,
              fontSize: isMobile ? 13 : 15,
            }}
          >
            {ritual.summary}
          </p>
        </div>
        <div style={{ marginLeft: 12 }}>
          <span style={{ color: "#4A9D7B", fontSize: 12 }}>
            {isExpanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Contenido expandido */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
      >
        <div
          style={{
            paddingTop: 12,
            borderTop: "1px solid #E5E7EB",
            marginTop: 12,
          }}
        >
          <div
            style={{
              color: "#666",
              fontSize: 13,
              marginBottom: 8,
              lineHeight: 1.6,
            }}
          >
            {ritual.body}
          </div>

          {/* Tags */}
          {ritual.tags && ritual.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 12,
              }}
            >
              {ritual.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  style={{
                    background: "#4A9D7B",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: 16,
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const RitualsView: React.FC<RitualsViewProps> = ({ expanded = true }) => {
  const { currentPhase } = useCycle();
  const { currentPhase: correctPhase } = useCurrentCycle(); // ! 08/06/2025 - Usar fase correcta
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [rituals, setRituals] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"phase" | "moon">(
    "phase"
  );

  // ! 08/06/2025 - Función mejorada para obtener rituales desde el endpoint público
  useEffect(() => {
    const fetchRituals = async () => {
      setLoading(true);
      try {
        // ! 08/06/2025 - Intentar múltiples endpoints para obtener rituales
        let response;
        const endpoints = [
          `${API_ROUTES.ADMIN.CONTENT.LIST}?type=ritual`,
          "/api/content?type=ritual",
          "/api/content",
        ];

        for (const endpoint of endpoints) {
          try {
            response = await apiFetch<any>(endpoint);
            if (response) {
              console.log(`✅ Rituales obtenidos desde: ${endpoint}`, response);
              break;
            }
          } catch (err) {
            console.log(`❌ Fallo en endpoint: ${endpoint}`, err);
            continue;
          }
        }

        // Procesar respuesta
        let ritualsData: Content[] = [];
        if (Array.isArray(response)) {
          ritualsData = response.filter(
            (item: any): item is Content => item.type === "ritual"
          );
        } else if (response && Array.isArray(response.data)) {
          ritualsData = response.data.filter(
            (item: any): item is Content => item.type === "ritual"
          );
        }

        // Si no se obtuvieron rituales de la API, usar fallback inmediatamente
        if (ritualsData.length === 0) {
          throw new Error(
            "No se encontraron rituales en la API, usando fallback"
          );
        }

        setRituals(ritualsData);
      } catch (error) {
        console.error("❌ Error al obtener rituales:", error);

        // ! 08/06/2025 - Fallback con rituales simulados basados en tu BD
        const fallbackRituals: Content[] = [
          {
            id: 16,
            title: "Ritual de inicio de ciclo menstrual",
            summary:
              "Un momento de introspección para conectar con tu cuerpo al comenzar el ciclo.",
            body: "Prepara un espacio tranquilo, enciende una vela y escribe cómo te sientes en tu primer día de menstruación. Escucha a tu cuerpo y permítete descansar.",
            type: ContentType.RITUAL,
            targetPhase: CyclePhase.MENSTRUAL,
            tags: ["introspección", "autoescucha", "descanso"],
          },
          {
            id: 17,
            title: "Ritual lunar para la fase ovulatoria",
            summary:
              "Aprovecha la luna llena para establecer intenciones durante tu ovulación.",
            body: "Durante la ovulación, medita con luz de luna y escribe afirmaciones relacionadas con tu creatividad, fertilidad o expresión personal.",
            type: ContentType.RITUAL,
            targetPhase: CyclePhase.OVULACION,
            tags: ["luna_llena", "ovulación", "creatividad"],
          },
          {
            id: 18,
            title: "Ritual de liberación en fase lútea",
            summary: "Deja ir lo que ya no te sirve emocionalmente.",
            body: "Escribe en un papel todo aquello que deseas soltar, luego quémalo en un espacio seguro. Este ritual te ayudará a preparar tu cuerpo para la menstruación.",
            type: ContentType.RITUAL,
            targetPhase: CyclePhase.LUTEA,
            tags: ["soltar", "emociones", "fase_lutea"],
          },
          {
            id: 19,
            title: "Baño relajante con hierbas durante la menstruación",
            summary:
              "Reduce el malestar físico y emocional con un baño de sales y hierbas calmantes.",
            body: "Agrega manzanilla, lavanda y sal de Epsom al agua tibia. Relájate durante 20 minutos y acompaña con música suave.",
            type: ContentType.RITUAL,
            targetPhase: CyclePhase.MENSTRUAL,
            tags: ["relajación", "autocuidado", "dolor_menstrual"],
          },
          {
            id: 20,
            title: "Ritual de gratitud en fase folicular",
            summary:
              "Reconecta con tu cuerpo y agradécele por su sabiduría cíclica.",
            body: "Frente a un espejo, repite afirmaciones positivas sobre tu cuerpo. Toca tu vientre con respeto y cariño.",
            type: ContentType.RITUAL,
            targetPhase: CyclePhase.FOLICULAR,
            tags: ["gratitud", "fase_folicular", "amor_propio"],
          },
          {
            id: 22,
            title: "Ritual de aromaterapia para cada fase del ciclo",
            summary:
              "Usa aceites esenciales específicos según tu fase hormonal.",
            body: "En fase menstrual: lavanda. Folicular: limón. Ovulación: ylang-ylang. Lútea: incienso. Aplícalos en difusor o muñecas.",
            type: ContentType.RITUAL,
            tags: ["aromaterapia", "bienestar_hormonal", "aceites"],
          },
          {
            id: 24,
            title: "Ritual de movimiento en fase ovulatoria",
            summary: "Expresa tu energía a través del cuerpo.",
            body: "Baila libremente durante 10 minutos con una canción que te motive. Mueve caderas, brazos y respira profundo. Libera tensión y activa endorfinas.",
            type: ContentType.RITUAL,
            targetPhase: CyclePhase.OVULACION,
            tags: ["baile", "energía", "fase_ovulatoria"],
          },
          {
            id: 25,
            title: "Ritual de journaling con luna nueva",
            summary:
              "Conecta tu ciclo con la luna para trabajar aspectos internos.",
            body: "Escribe qué aspectos de ti deseas cultivar en este nuevo ciclo lunar. Ideal para mujeres cuya menstruación coincide con luna nueva.",
            type: ContentType.RITUAL,
            tags: ["journaling", "luna_nueva", "reflexión"],
          },
          {
            id: 26,
            title: "Meditación de conexión con la naturaleza",
            summary: "Ritual general para conectar con los ciclos naturales.",
            body: "Siéntate al aire libre durante 15 minutos. Respira profundamente y visualiza cómo tu ciclo se sincroniza con los ritmos de la naturaleza.",
            type: ContentType.RITUAL,
            tags: ["meditación", "naturaleza", "respiración"],
          },
          {
            id: 27,
            title: "Ritual de autocompasión",
            summary: "Practica la bondad contigo misma durante cualquier fase.",
            body: "Coloca una mano en tu corazón y otra en tu vientre. Repite: 'Me acepto tal como soy. Mi cuerpo es sabio. Merezco amor y cuidado.'",
            type: ContentType.RITUAL,
            tags: ["autocompasión", "amor_propio", "afirmaciones"],
          },
        ];

        setRituals(fallbackRituals);
      } finally {
        setLoading(false);
      }
    };
    fetchRituals();
  }, []);

  // --- VISTA NO EXPANDIDA ---
  if (!expanded) {
    const svgSize = isMobile
      ? { width: 240, height: 165 }
      : isTablet
      ? { width: 280, height: 192 }
      : { width: 320, height: 220 };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          borderRadius: 18,
          padding: isMobile ? 16 : 24,
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src="/img/4.svg"
          alt="Rituales"
          style={{
            width: svgSize.width,
            height: svgSize.height,
            opacity: 0.97,
            objectFit: "contain",
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
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 360,
          width: "100%",
        }}
      >
        <div className="loading-spinner" />
      </motion.div>
    );
  }

  // ! 09/06/2025 - Filtrar rituales usando la fase correcta y mejorar clasificación
  const phaseRituals = rituals.filter((r) => r.targetPhase === correctPhase);
  const moonRituals = rituals.filter(
    (r) =>
      r.tags &&
      (r.tags.includes("luna_llena") ||
        r.tags.includes("luna_nueva") ||
        r.tags.includes("journaling") ||
        r.tags.includes("ritual_lunar"))
  );

  // Rituales generales (sin fase específica) como fallback
  const generalRituals = rituals.filter((r) => !r.targetPhase);

  console.log("🎭 Estado actual:", {
    correctPhase,
    totalRituals: rituals.length,
    phaseRituals: phaseRituals.length,
    moonRituals: moonRituals.length,
    generalRituals: generalRituals.length,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 20 : isTablet ? 24 : 32,
        background: "transparent",
        borderRadius: 24,
        padding: isMobile ? 20 : isTablet ? 28 : 32,
        minHeight: isMobile ? 360 : isTablet ? 420 : 480,
        width: "100%",
      }}
    >
      {/* Navegación de categorías */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? 8 : 16,
          borderBottom: "1px solid #eee",
          paddingBottom: 16,
          background: "transparent",
          borderRadius: 18,
          boxShadow: "none",
          marginBottom: 8,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {[
          { id: "phase", label: "Por Fase", icon: RitualIcons.sun("#4A9D7B") },
          { id: "moon", label: "Luna", icon: RitualIcons.moon("#4A9D7B") },
        ].map((category) => (
          <motion.button
            key={category.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCategory(category.id as any);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 6 : 8,
              padding: isMobile ? "6px 12px" : "8px 16px",
              borderRadius: 20,
              border: "none",
              background:
                selectedCategory === category.id ? "#E0F0E8" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.icon}
            <span
              style={{
                fontSize: isMobile ? 12 : 14,
                color: selectedCategory === category.id ? "#4A9D7B" : "#666",
              }}
            >
              {category.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Contenido de la categoría seleccionada */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 24 : isTablet ? 32 : 40,
          flexWrap: "wrap",
        }}
      >
        {selectedCategory === "phase" && (
          <>
            <div
              style={{
                flex: isMobile ? "none" : 1,
                minWidth: isMobile ? "100%" : 280,
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? 18 : isTablet ? 20 : 22,
                  fontWeight: 700,
                  color: "#4A9D7B",
                  marginBottom: 16,
                }}
              >
                Rituales para tu fase {correctPhase || "actual"}
              </h3>
              <p
                style={{
                  color: "#666",
                  marginBottom: 24,
                  fontSize: isMobile ? 14 : isTablet ? 16 : 17,
                }}
              >
                Descubre rituales especiales para esta fase de tu ciclo
              </p>
            </div>
            <div
              style={{
                flex: isMobile ? "none" : 2,
                minWidth: isMobile ? "100%" : 320,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {phaseRituals.length > 0 ? (
                phaseRituals.map((ritual, index) => (
                  <RitualCard
                    key={ritual.id}
                    ritual={ritual}
                    index={index}
                    isMobile={isMobile}
                  />
                ))
              ) : generalRituals.length > 0 ? (
                // ! 09/06/2025 - Mostrar rituales generales como fallback
                <>
                  <div
                    style={{
                      background: "#E8F4FD",
                      padding: isMobile ? 16 : 20,
                      borderRadius: 12,
                      border: "1px solid #B3D9F7",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        color: "#1976D2",
                        fontWeight: 600,
                        fontSize: 15,
                        marginBottom: 8,
                      }}
                    >
                      💡 Rituales generales adaptables
                    </div>
                    <div style={{ color: "#666", fontSize: 13 }}>
                      No hay rituales específicos para la fase {correctPhase},
                      pero estos rituales generales pueden adaptarse:
                    </div>
                  </div>
                  {generalRituals.slice(0, 3).map((ritual, index) => (
                    <RitualCard
                      key={ritual.id}
                      ritual={ritual}
                      index={index}
                      isMobile={isMobile}
                      isGeneral={true}
                    />
                  ))}
                </>
              ) : (
                <div
                  style={{
                    background: "#FFF5F5",
                    padding: isMobile ? 16 : 20,
                    borderRadius: 12,
                    border: "1px solid #FFE6E6",
                  }}
                >
                  <div
                    style={{
                      color: "#C62328",
                      fontWeight: 600,
                      fontSize: 15,
                      marginBottom: 8,
                    }}
                  >
                    No hay rituales específicos para la fase {correctPhase}
                  </div>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Prueba la sección "Luna" para ver rituales generales que
                    puedes adaptar a tu fase actual.
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {selectedCategory === "moon" && (
          <>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#4A9D7B",
                  marginBottom: 16,
                }}
              >
                Rituales de la Luna
              </h3>
              <p style={{ color: "#666", marginBottom: 24, fontSize: 17 }}>
                Conecta con la energía lunar para potenciar tu bienestar
              </p>
            </div>
            <div
              style={{
                flex: 2,
                minWidth: 320,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {moonRituals.length > 0 ? (
                moonRituals.map((ritual, index) => (
                  <RitualCard
                    key={ritual.id}
                    ritual={ritual}
                    index={index}
                    isMobile={isMobile}
                    isMoon={true}
                  />
                ))
              ) : (
                <div
                  style={{
                    background: "#FFF5F5",
                    padding: isMobile ? 16 : 20,
                    borderRadius: 12,
                    border: "1px solid #FFE6E6",
                  }}
                >
                  <div
                    style={{
                      color: "#C62328",
                      fontWeight: 600,
                      fontSize: 15,
                      marginBottom: 8,
                    }}
                  >
                    No hay rituales de luna disponibles
                  </div>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    Los rituales lunares te ayudan a conectar con los ciclos
                    naturales. ¡Próximamente más contenido!
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default RitualsView;
