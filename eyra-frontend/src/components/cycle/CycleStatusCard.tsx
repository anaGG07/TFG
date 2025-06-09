// ! 08/06/2025 - Componente CycleStatusCard que mantiene tu estética
// Muestra correctamente los datos del ciclo con el diseño visual que ya tienes

import React from "react";
import { useCurrentCycle } from "../../hooks/useCurrentCycle";
import { useViewport } from "../../hooks/useViewport";

interface CycleStatusCardProps {
  className?: string;
  expanded?: boolean;
  onMoodColorChange?: (color: string) => void;
}

export const CycleStatusCard: React.FC<CycleStatusCardProps> = ({
  className = "",
  expanded = false,
  onMoodColorChange,
}) => {
  const {
    currentDay,
    currentPhase,
    phaseName,
    phaseDescription,
    nextPeriodDate,
    daysUntilNext,
    cycleLength,
    isLoading,
    error,
    refreshCycleInfo,
  } = useCurrentCycle();

  const { isMobile, isTablet } = useViewport();

  // Formatear fecha
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "No disponible";

    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });
  };

  // Estado de carga - mantener tu estética
  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          padding: isMobile ? 16 : 24,
          minHeight: "auto",
        }}
      >
        <img
          src="/img/UteroRojo.svg"
          alt="Cargando ciclo"
          style={{
            width: isMobile ? 240 : isTablet ? 280 : 320,
            height: isMobile ? 165 : isTablet ? 192 : 220,
            opacity: 0.5,
            objectFit: "contain",
          }}
        />
        <p
          style={{ fontSize: isMobile ? 12 : 14, color: "#666", marginTop: 8 }}
        >
          Cargando...
        </p>
      </div>
    );
  }

  // Error - mantener tu estética
  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          padding: isMobile ? 16 : 24,
          minHeight: "auto",
        }}
      >
        <img
          src="/img/UteroRojo.svg"
          alt="Error"
          style={{
            width: isMobile ? 240 : isTablet ? 280 : 320,
            height: isMobile ? 165 : isTablet ? 192 : 220,
            opacity: 0.3,
            objectFit: "contain",
          }}
        />
        <p
          style={{
            fontSize: isMobile ? 12 : 14,
            color: "#C62328",
            marginTop: 8,
          }}
        >
          Error al cargar
        </p>
        <button
          onClick={refreshCycleInfo}
          style={{
            marginTop: 8,
            padding: "6px 12px",
            background: "#C62328",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: isMobile ? 11 : 12,
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Vista NO expandida - tu estética actual
  if (!expanded) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          padding: isMobile ? 16 : 24,
          minHeight: "auto",
          position: "relative",
        }}
      >
        <img
          src="/img/UteroRojo.svg"
          alt="Útero central del ciclo"
          style={{
            width: isMobile ? 240 : isTablet ? 280 : 320,
            height: isMobile ? 165 : isTablet ? 192 : 220,
            opacity: 0.97,
            objectFit: "contain",
          }}
        />

        {/* Información superpuesta - DATOS CORRECTOS */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            top: "20%",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? 32 : 40,
              fontWeight: "bold",
              color: "white",
              marginBottom: 4,
            }}
          >
            Día {currentDay}
          </h1>
          <p
            style={{
              color: "white",
              fontSize: isMobile ? 16 : 20,
              opacity: 0.9,
            }}
          >
            {phaseName}
          </p>

          {/* Probabilidad de embarazo */}
          <div style={{ marginTop: 16 }}>
            <p
              style={{
                color: "white",
                fontSize: isMobile ? 12 : 14,
                opacity: 0.8,
              }}
            >
              Probabilidad de embarazo:{" "}
              <span style={{ fontWeight: "bold" }}>
                {currentPhase === "ovulacion"
                  ? "Alta"
                  : currentPhase === "folicular" && currentDay > 10
                  ? "Media"
                  : "Muy baja"}
              </span>
            </p>
          </div>
        </div>

        {/* Sección ¿Cómo te sientes hoy? - igual que tu estilo */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: isMobile ? 12 : 14,
              color: "#666",
              marginBottom: 12,
            }}
          >
            ¿Cómo te sientes hoy?
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {["😊", "😐", "😟", "😔", "😡"].map((emoji, index) => (
              <button
                key={index}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: isMobile ? 20 : 24,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  padding: 4,
                }}
                onClick={() => {
                  // Cambiar color de fondo según emoción
                  const colors = [
                    "#E8F5E9",
                    "#FFF3E0",
                    "#FFEBEE",
                    "#F3E5F5",
                    "#FFEBEE",
                  ];
                  onMoodColorChange?.(colors[index]);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vista expandida - mantener tu estilo pero con datos correctos
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: isMobile ? 16 : 24,
        background: "transparent",
        gap: isMobile ? 16 : 20,
        overflow: "auto",
      }}
    >
      {/* Header con día y fase - DATOS CORRECTOS */}
      <div
        style={{
          background: "linear-gradient(to right, #C62328, #E73B3E)",
          borderRadius: isMobile ? 16 : 20,
          padding: isMobile ? 20 : 24,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: isMobile ? 32 : 40,
              fontWeight: "bold",
              margin: 0,
              marginBottom: 4,
            }}
          >
            Día {currentDay}
          </h1>
          <p
            style={{
              fontSize: isMobile ? 16 : 18,
              margin: 0,
              opacity: 0.9,
            }}
          >
            {phaseName}
          </p>
        </div>
        <div
          style={{
            fontSize: isMobile ? 40 : 48,
            opacity: 0.8,
          }}
        >
          {currentPhase === "menstrual"
            ? "🔴"
            : currentPhase === "folicular"
            ? "🌱"
            : currentPhase === "ovulacion"
            ? "🥚"
            : "🌙"}
        </div>
      </div>

      {/* Descripción de la fase */}
      <div
        style={{
          background: "#F5F5F5",
          padding: isMobile ? 16 : 20,
          borderRadius: isMobile ? 12 : 16,
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? 14 : 16,
            fontWeight: "bold",
            color: "#333",
            margin: 0,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: 8 }}>✨</span>
          ¿Qué pasa en tu cuerpo hoy?
        </h3>
        <p
          style={{
            fontSize: isMobile ? 12 : 14,
            color: "#666",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {phaseDescription}
        </p>
      </div>

      {/* Información del ciclo en grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 12 : 16,
        }}
      >
        {/* Duración del ciclo */}
        <div
          style={{
            background: "#E6F0FF",
            padding: isMobile ? 16 : 20,
            borderRadius: isMobile ? 12 : 16,
            border: "1px solid #B3D9FF",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: isMobile ? 16 : 18, marginRight: 8 }}>
              ⏱️
            </span>
            <h4
              style={{
                fontSize: isMobile ? 12 : 14,
                fontWeight: "bold",
                color: "#1E40AF",
                margin: 0,
              }}
            >
              Duración del ciclo
            </h4>
          </div>
          <p
            style={{
              fontSize: isMobile ? 18 : 20,
              fontWeight: "bold",
              color: "#1E3A8A",
              margin: 0,
              marginBottom: 4,
            }}
          >
            {cycleLength} días
          </p>
          <p
            style={{
              fontSize: isMobile ? 10 : 12,
              color: "#3B82F6",
              margin: 0,
            }}
          >
            Promedio personal
          </p>
        </div>

        {/* Próximo período */}
        {nextPeriodDate && daysUntilNext !== null && (
          <div
            style={{
              background: "#F3E8FF",
              padding: isMobile ? 16 : 20,
              borderRadius: isMobile ? 12 : 16,
              border: "1px solid #D8B4FE",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: isMobile ? 16 : 18, marginRight: 8 }}>
                📅
              </span>
              <h4
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "bold",
                  color: "#7C3AED",
                  margin: 0,
                }}
              >
                Próximo período
              </h4>
            </div>
            <p
              style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: "bold",
                color: "#6B21A8",
                margin: 0,
                marginBottom: 4,
              }}
            >
              {formatDate(nextPeriodDate)}
            </p>
            <p
              style={{
                fontSize: isMobile ? 10 : 12,
                color: "#8B5CF6",
                margin: 0,
              }}
            >
              {daysUntilNext > 0 ? `En ${daysUntilNext} días` : "Hoy"}
            </p>
          </div>
        )}
      </div>

      {/* Botón de actualizar */}
      <div style={{ textAlign: "center", marginTop: "auto" }}>
        <button
          onClick={refreshCycleInfo}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontSize: isMobile ? 11 : 12,
            textDecoration: "underline",
            cursor: "pointer",
            padding: 8,
          }}
        >
          🔄 Actualizar información
        </button>
      </div>
    </div>
  );
};
