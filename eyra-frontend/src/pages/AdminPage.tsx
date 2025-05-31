
// ! 31/05/2025 - Página de administración completamente actualizada con gestión de usuarios
// ! 31/05/2025 - Activados componentes de gestión de usuarios

import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminStatsService, AdminStats, RecentActivity } from '../services/adminStatsService';
import UsersTable from '../features/admin/components/UsersTable';

const AdminPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'settings'>('overview');
  
  // Estados para datos reales
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos cuando el componente se monta
  const loadData = async () => {
    if (!user || !user.roles.includes('ROLE_ADMIN')) {
      return;
    }

    try {
      setIsLoadingStats(true);
      setError(null);
      
      const [statsData, activityData] = await Promise.all([
        adminStatsService.getSystemStats(),
        adminStatsService.getRecentActivity()
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err: any) {
      console.error('Error cargando datos de administración:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (authLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b91c1c]"></div>
      </div>
    );
  }

  if (!user || !user.roles.includes('ROLE_ADMIN')) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: '📊' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'content', label: 'Contenido', icon: '📝' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' },
  ] as const;

  return (
    <div className="w-full h-full bg-[#f8f9fa] overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#b91c1c] mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Bienvenido/a, {user.name}. Aquí puedes gestionar el sistema EYRA.
          </p>
        </div>

        {/* Navegación por pestañas */}
        <div className="mb-8">
          <div className="border-b border-gray-200 bg-white rounded-t-lg">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-[#b91c1c] text-[#b91c1c]'
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Resumen del Sistema</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">Error al cargar datos: {error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Recargar página
                  </button>
                </div>
              )}
              
              {/* Estadísticas simples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#fff1f1] p-6 rounded-lg border border-[#fecaca]">
                  <h3 className="text-lg font-semibold text-[#b91c1c] mb-2">👥 Usuarios</h3>
                  {isLoadingStats ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-[#991b1b]">{stats?.totalUsers.toLocaleString() || '0'}</p>
                      <p className="text-sm text-[#b91c1c]">Total de usuarios</p>
                    </>
                  )}
                </div>
                <div className="bg-[#f0fdf4] p-6 rounded-lg border border-[#bbf7d0]">
                  <h3 className="text-lg font-semibold text-[#166534] mb-2">✅ Activos</h3>
                  {isLoadingStats ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-[#15803d]">{stats?.activeUsers.toLocaleString() || '0'}</p>
                      <p className="text-sm text-[#166534]">Usuarios activos</p>
                    </>
                  )}
                </div>
                <div className="bg-[#fdf4ff] p-6 rounded-lg border border-[#e9d5ff]">
                  <h3 className="text-lg font-semibold text-[#7c2d12] mb-2">👑 Admins</h3>
                  {isLoadingStats ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-[#a16207]">{stats?.adminUsers.toLocaleString() || '0'}</p>
                      <p className="text-sm text-[#7c2d12]">Administradores</p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Acciones rápidas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab('users')}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Gestionar Usuarios</div>
                          <div className="text-sm text-gray-500">Ver, editar y administrar cuentas</div>
                        </div>
                        <span className="text-2xl">👥</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('content')}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Gestionar Contenido</div>
                          <div className="text-sm text-gray-500">Administrar artículos y recursos</div>
                        </div>
                        <span className="text-2xl">📝</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
                  <div className="space-y-3">
                    {isLoadingStats ? (
                      // Skeleton loading para actividad reciente
                      <>
                        <div className="animate-pulse flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="animate-pulse flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      recentActivity.slice(0, 5).map((activity) => {
                        const bgColor = activity.color === 'green' 
                          ? 'bg-[#f0fdf4] border-[#bbf7d0]' 
                          : activity.color === 'red'
                          ? 'bg-[#fff1f1] border-[#fecaca]'
                          : 'bg-[#f0f9ff] border-[#bae6fd]';
                        
                        const textColor = activity.color === 'green'
                          ? 'text-[#15803d]'
                          : activity.color === 'red'
                          ? 'text-[#b91c1c]'
                          : 'text-[#0369a1]';
                        
                        return (
                          <div key={activity.id} className={`flex items-center space-x-3 p-3 ${bgColor} rounded-lg border`}>
                            <span className={textColor}>{activity.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {activity.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {adminStatsService.formatRelativeTime(activity.timestamp)}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    
                    {!isLoadingStats && recentActivity.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No hay actividad reciente
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Gestión de Usuarios</h2>
              <UsersTable onRefresh={() => loadData()} />
            </div>
          )}

          {activeTab === 'content' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Gestión de Contenido</h2>
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🚧</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Próximamente
                </h3>
                <p className="text-gray-600">
                  La gestión de contenido estará disponible en una próxima actualización.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Configuración del Sistema</h2>
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">⚙️</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Próximamente
                </h3>
                <p className="text-gray-600">
                  Las configuraciones del sistema estarán disponibles en una próxima actualización.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
