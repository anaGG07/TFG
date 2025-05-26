import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useCycle } from '../../../context/CycleContext';
import { cycleService } from '../../../services/cycleService';
import { Content, ContentType } from '../../../types/domain';

export const ContentRecommendations = () => {
  const { currentDay } = useCycle();
  const [recommendations, setRecommendations] = useState<Content[]>([]);
  const [activeTab, setActiveTab] = useState<ContentType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar recomendaciones
  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        const response = await cycleService.getRecommendations();
        if (response.success && response.recommendations) {
          setRecommendations(response.recommendations);
        }
      } catch (error) {
        console.error('Error al cargar recomendaciones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [currentDay]);

  // Filtrar recomendaciones por tipo
  const filteredRecommendations = activeTab === 'all'
    ? recommendations
    : recommendations.filter(item => item.type === activeTab);

  // Renderizar iconos según el tipo de contenido
  const renderContentIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.NUTRITION:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case ContentType.EXERCISE:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case ContentType.ARTICLE:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case ContentType.SELFCARE:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case ContentType.RECOMMENDATION:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Obtener color según el tipo de contenido
  const getContentTypeColor = (type: ContentType) => {
    switch (type) {
      case ContentType.NUTRITION:
        return 'bg-green-100 text-green-800';
      case ContentType.EXERCISE:
        return 'bg-blue-100 text-blue-800';
      case ContentType.ARTICLE:
        return 'bg-purple-100 text-purple-800';
      case ContentType.SELFCARE:
        return 'bg-pink-100 text-pink-800';
      case ContentType.RECOMMENDATION:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener nombre del tipo de contenido
  const getContentTypeName = (type: ContentType) => {
    switch (type) {
      case ContentType.NUTRITION:
        return 'Receta';
      case ContentType.EXERCISE:
        return 'Ejercicio';
      case ContentType.ARTICLE:
        return 'Artículo';
      case ContentType.SELFCARE:
        return 'Autocuidado';
      case ContentType.RECOMMENDATION:
        return 'Recomendación';
      default:
        return 'Contenido';
    }
  };

  return (
    <Card title="Recomendaciones para ti">
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeTab === 'all' ? 'primary' : 'light'}
            size="sm"
            onClick={() => setActiveTab('all')}
          >
            Todos
          </Button>
          {Object.values(ContentType).map((type) => (
            <Button 
              key={type}
              variant={activeTab === type ? 'primary' : 'light'}
              size="sm"
              onClick={() => setActiveTab(type)}
            >
              {getContentTypeName(type)}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
        </div>
      ) : filteredRecommendations.length > 0 ? (
        <div className="space-y-4">
          {filteredRecommendations.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
              {item.imageUrl && (
                <div className="w-full md:w-1/4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              )}
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(item.type)}`}>
                      <span className="mr-1">{renderContentIcon(item.type)}</span>
                      {getContentTypeName(item.type)}
                    </span>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  {item.targetPhase && (
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      Fase {item.targetPhase}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-gray-600">
                  {item.summary}
                </p>
                <div className="mt-4">
                  <Link to={`/content/${item.id}`}>
                    <Button variant="secondary" size="sm">
                      Leer más
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No hay recomendaciones disponibles para este filtro.</p>
        </div>
      )}
    </Card>
  );
};
