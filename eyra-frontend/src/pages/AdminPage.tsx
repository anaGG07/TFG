
// ! 31/05/2025 - Página de administración completamente actualizada con gestión de usuarios

import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import UsersTable from '../features/admin/components/UsersTable';
import AdminStats from '../features/admin/components/AdminStats';

const AdminPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'settings'>('overview');

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: '📊' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'content', label: 'Contenido', icon: '📝' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' },
  ] as const;

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-primary mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona usuarios, contenido y configuraciones del sistema EYRA
          </p>
        </div>

        {/* Navegación por pestañas */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido por pestañas */}
        {activeTab === 'overview' && (
          <div>
            <AdminStats refreshTrigger={refreshTrigger} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Acciones Rápidas">
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Gestionar Usuarios</div>
                        <div className="text-sm text-gray-500">Ver, editar y administrar cuentas de usuario</div>
                      </div>
                      <span className="text-xl">👥</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('content')}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Gestionar Contenido</div>
                        <div className="text-sm text-gray-500">Administrar artículos y recursos</div>
                      </div>
                      <span className="text-xl">📝</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Configuración</div>
                        <div className="text-sm text-gray-500">Configurar parámetros del sistema</div>
                      </div>
                      <span className="text-xl">⚙️</span>
                    </div>
                  </button>
                </div>
              </Card>
              
              <Card title="Actividad Reciente">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600">✅</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Sistema funcionando correctamente
                      </div>
                      <div className="text-xs text-gray-500">Hace 2 minutos</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600">👤</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Nuevo usuario registrado
                      </div>
                      <div className="text-xs text-gray-500">Hace 1 hora</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-600">🔧</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Mantenimiento programado
                      </div>
                      <div className="text-xs text-gray-500">Hace 3 horas</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <UsersTable onRefresh={handleRefresh} />
          </div>
        )}

        {activeTab === 'content' && (
          <Card title="Gestión de Contenido">
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🚧</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Próximamente
              </h3>
              <p className="text-gray-600">
                La gestión de contenido estará disponible en una próxima actualización.
              </p>
            </div>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card title="Configuración del Sistema">
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">⚙️</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Próximamente
              </h3>
              <p className="text-gray-600">
                Las configuraciones del sistema estarán disponibles en una próxima actualización.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
