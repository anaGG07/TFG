// ! 08/06/2025 - Modal mejorado con responsive design completo para móvil
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />

      {/* Modal - Responsive design */}
      <div
        className="relative bg-[#360001] 
                      w-full h-auto max-h-[95vh] 
                      sm:w-full sm:max-w-lg sm:max-h-[90vh] 
                      rounded-t-3xl sm:rounded-3xl 
                      shadow-2xl 
                      overflow-hidden 
                      transform transition-all duration-300 ease-out"
      >
        {/* ! 08/06/2025 - Header con botón cerrar mejorado */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E7E0D5]/20">
          <div className="flex-1">
            <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#E7E0D5]">
              {title}
            </h2>
            <p className="text-[#E7E0D5]/80 text-xs sm:text-sm mt-1">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="ml-4 p-2 text-[#E7E0D5] hover:text-white hover:bg-[#E7E0D5]/10 
                       rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
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
        </div>

        {/* ! 08/06/2025 - Contenido con scroll interno para móvil */}
        <div className="overflow-y-auto max-h-[70vh] sm:max-h-none">
          <form
            id="relationship-form"
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 space-y-4 sm:space-y-6"
          >
            {/* ! 08/06/2025 - Selector responsive con mejor spacing */}
            <div className="space-y-2 sm:space-y-3">
              {relationshipTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedType === type.value
                      ? "border-[#E7E0D5] bg-[#E7E0D5]/10"
                      : "border-[#E7E0D5]/20 hover:border-[#E7E0D5]/40 active:border-[#E7E0D5]/60"
                  }`}
                  onClick={() => setSelectedType(type.value as any)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-xl sm:text-2xl flex-shrink-0">
                      {type.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[#E7E0D5] font-semibold text-sm sm:text-base">
                          {type.label}
                        </span>
                        {selectedType === type.value && (
                          <span className="text-green-400 text-base sm:text-lg">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[#E7E0D5]/80 text-xs sm:text-sm mb-2 leading-relaxed">
                        {type.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {type.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-[#E7E0D5]/20 text-[#E7E0D5] rounded text-xs whitespace-nowrap"
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

            {/* ! 08/06/2025 - Información de selección con mejor responsive */}
            <div className="bg-[#E7E0D5]/10 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl sm:text-2xl">
                  {selectedTypeData.icon}
                </span>
                <span className="text-[#E7E0D5] font-medium text-sm sm:text-base">
                  {selectedTypeData.label} seleccionado
                </span>
              </div>
              <p className="text-[#E7E0D5]/80 text-xs sm:text-sm mb-2 leading-relaxed">
                {selectedTypeData.description}
              </p>
              <div className="space-y-1">
                <p className="text-[#E7E0D5] text-xs flex items-center">
                  <span className="mr-2">📅</span>
                  <span>La invitación expirará en 48 horas</span>
                </p>
                <p className="text-[#E7E0D5] text-xs flex items-center">
                  <span className="mr-2">🔧</span>
                  <span>Podrás modificar los permisos después</span>
                </p>
              </div>
            </div>

            {/* ! 08/06/2025 - Error message responsive */}
            {error && (
              <div className="bg-[#9d0d0b]/20 border border-[#9d0d0b]/40 text-[#E7E0D5] rounded-lg p-3 text-xs sm:text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-red-400 flex-shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ! 08/06/2025 - Botones sticky en footer para móvil */}
        <div className="border-t border-[#E7E0D5]/20 p-4 sm:p-6 bg-[#360001]">
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 sm:py-2 border border-[#E7E0D5] text-[#E7E0D5] 
                         font-semibold rounded-full hover:bg-[#E7E0D5] hover:text-[#C62328] 
                         transition-colors disabled:opacity-50 text-sm sm:text-base
                         active:scale-95 active:bg-[#E7E0D5]/20"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="relationship-form"
              disabled={isLoading}
              className="flex-1 px-4 py-3 sm:py-2 bg-[#E7E0D5] text-[#C62328] 
                         font-semibold rounded-full hover:bg-white 
                         disabled:opacity-60 disabled:cursor-not-allowed transition-colors 
                         text-sm sm:text-base active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#C62328] border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando...</span>
                </div>
              ) : (
                "Crear Invitación"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipTypeModal;
