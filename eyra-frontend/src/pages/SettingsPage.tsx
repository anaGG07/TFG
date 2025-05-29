import React from "react";

const SettingsPage: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-secondary-light">
      <div className="bg-white rounded-xl p-8 shadow-xl max-w-2xl w-full mx-4">
        <h1 className="text-2xl font-serif text-primary-dark mb-6">
          Configuración
        </h1>
        <div className="space-y-4">
          <div className="p-4 bg-secondary-light rounded-lg">
            <h3 className="font-medium text-primary-dark mb-2">Notificaciones</h3>
            <p className="text-gray-600 text-sm">
              Configura tus preferencias de notificaciones
            </p>
          </div>
          <div className="p-4 bg-secondary-light rounded-lg">
            <h3 className="font-medium text-primary-dark mb-2">Privacidad</h3>
            <p className="text-gray-600 text-sm">
              Gestiona tu privacidad y datos
            </p>
          </div>
          <div className="p-4 bg-secondary-light rounded-lg">
            <h3 className="font-medium text-primary-dark mb-2">Cuenta</h3>
            <p className="text-gray-600 text-sm">
              Configuración de cuenta y perfil
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
