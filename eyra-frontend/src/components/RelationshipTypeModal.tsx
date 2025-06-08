import React, { useState, useEffect } from "react";

export interface RelationshipTypeData {
  guestType: "partner" | "parental" | "friend" | "healthcare_provider";
  accessPermissions: string[];
  expirationHours: number;
}

interface RelationshipTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RelationshipTypeData) => Promise<void>;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

const RelationshipTypeModal: React.FC<RelationshipTypeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  title = "Tipo de Relación",
  subtitle = "Selecciona qué tipo de relación tienes con esta persona",
}) => {
  const [selectedType, setSelectedType] = useState<
    "partner" | "parental" | "friend" | "healthcare_provider"
  >("friend");
  const [error, setError] = useState<string | null>(null);

  const relationshipTypes = [
    {
      value: "friend",
      label: "Amigo/a",
      icon: "👥",
      description: "Amigos, familiares o personas de confianza",
      permissions: ["view_cycle", "view_symptoms"],
    },
    {
      value: "partner",
      label: "Pareja",
      icon: "💕",
      description: "Pareja romántica o cónyuge",
      permissions: [
        "view_cycle",
        "view_symptoms",
        "view_moods",
        "view_predictions",
      ],
    },
    {
      value: "healthcare_provider",
      label: "Profesional Médico",
      icon: "🩺",
      description: "Ginecólogo, médico o profesional de la salud",
      permissions: [
        "view_cycle",
        "view_symptoms",
        "view_analytics",
        "view_predictions",
      ],
    },
    {
      value: "parental",
      label: "Familiar/Tutor",
      icon: "👨‍👩‍👧",
      description: "Padres, tutores o cuidadores",
      permissions: ["view_cycle", "view_calendar"],
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setSelectedType("friend"); // Default más neutral
      setError(null);
    }
  }, [isOpen]);

  const getSelectedTypeData = () => {
    const selected = relationshipTypes.find(
      (type) => type.value === selectedType
    );
    return selected || relationshipTypes[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const typeData = getSelectedTypeData();

    try {
      await onSubmit({
        guestType: selectedType,
        accessPermissions: typeData.permissions,
        expirationHours: 48,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al procesar la invitación");
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const selectedTypeData = getSelectedTypeData();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-auto"
      style={{ zIndex: 9999 }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#E7E0D5] bg-opacity-50 pointer-events-auto"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="relative bg-[#360001] rounded-3xl p-4 sm:p-8 w-full max-w-lg mx-4 shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-[#E7E0D5] hover:text-white transition-colors pointer-events-auto z-10 disabled:opacity-50"
        >
          <svg
            className="w-6 h-6"
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

        {/* Contenido */}
        <div className="text-center mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#E7E0D5] mb-2">
            {title}
          </h2>
          <p className="text-[#E7E0D5] text-xs sm:text-sm">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pointer-events-auto">
          {/* Selector de tipo de relación */}
          <div className="space-y-3">
            {relationshipTypes.map((type) => (
              <div
                key={type.value}
                className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedType === type.value
                    ? "border-[#E7E0D5] bg-[#E7E0D5]/10"
                    : "border-[#E7E0D5]/20 hover:border-[#E7E0D5]/40"
                }`}
                onClick={() => setSelectedType(type.value as any)}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-xl sm:text-2xl">{type.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[#E7E0D5] font-semibold text-sm sm:text-base">
                        {type.label}
                      </span>
                      {selectedType === type.value && (
                        <span className="text-green-400 text-lg">✓</span>
                      )}
                    </div>
                    <p className="text-[#E7E0D5]/80 text-xs sm:text-sm mb-2">
                      {type.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {type.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-[#E7E0D5]/20 text-[#E7E0D5] rounded text-xs"
                        >
                          {permission.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Información de la selección actual */}
          <div className="bg-[#E7E0D5]/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl sm:text-2xl">
                {selectedTypeData.icon}
              </span>
              <span className="text-[#E7E0D5] font-medium text-sm sm:text-base">
                {selectedTypeData.label} seleccionado
              </span>
            </div>
            <p className="text-[#E7E0D5]/80 text-xs sm:text-sm mb-2">
              {selectedTypeData.description}
            </p>
            <p className="text-[#E7E0D5] text-xs">
              📅 La invitación expirará en 48 horas
            </p>
            <p className="text-[#E7E0D5] text-xs">
              🔧 Podrás modificar los permisos después
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-[#9d0d0b]/20 border border-[#9d0d0b]/40 text-[#E7E0D5] rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-[#E7E0D5] text-[#E7E0D5] font-semibold rounded-full hover:bg-[#E7E0D5] hover:text-[#C62328] transition-colors pointer-events-auto disabled:opacity-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#E7E0D5] text-[#C62328] font-semibold rounded-full hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors pointer-events-auto"
            >
              {isLoading ? "Creando..." : "Crear Invitación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelationshipTypeModal;
