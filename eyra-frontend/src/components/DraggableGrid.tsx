import React, { useState, ReactNode, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useViewport } from "../hooks/useViewport";

interface GridItem {
  id: string;
  component: ReactNode;
  title: string;
  isExpanded?: boolean;
  expandedComponent?: ReactNode;
}

interface DraggableGridProps {
  items: GridItem[];
  onItemsChange?: (items: GridItem[]) => void;
  isLibrary?: boolean;
}

const DraggableGrid: React.FC<DraggableGridProps> = ({
  items: initialItems,
  onItemsChange,
  isLibrary = false,
}) => {
  const [items, setItems] = useState<GridItem[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mode: viewportMode, isMobile, isTablet, isDesktop } = useViewport();

  // Sincronizar estado interno cuando cambien los props
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Get items per view based on viewport
  const getItemsPerView = useCallback(() => {
    if (isMobile) return 1;
    if (isTablet) return 2; // 2 items en columna vertical para tablet
    return items.length; // Show all in grid para desktop
  }, [isMobile, isTablet, items.length]);

  const itemsPerView = getItemsPerView();

  // Carousel navigation
  const nextItems = useCallback(() => {
    if (itemsPerView >= items.length) return;
    setCurrentIndex((prev) => (prev + itemsPerView) % items.length);
  }, [items.length, itemsPerView]);

  const prevItems = useCallback(() => {
    if (itemsPerView >= items.length) return;
    setCurrentIndex((prev) => (prev - itemsPerView + items.length) % items.length);
  }, [items.length, itemsPerView]);

  // Get current visible items
  const getCurrentItems = useCallback(() => {
    if (itemsPerView >= items.length) return items;
    const visibleItems = [];
    for (let i = 0; i < itemsPerView; i++) {
      visibleItems.push(items[(currentIndex + i) % items.length]);
    }
    return visibleItems;
  }, [currentIndex, itemsPerView, items]);

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();

      if (!draggedItem || draggedItem === targetId) {
        setDraggedItem(null);
        return;
      }

      setIsTransitioning(true);

      const newItems = [...items];
      const draggedIndex = newItems.findIndex(
        (item) => item.id === draggedItem
      );
      const targetIndex = newItems.findIndex((item) => item.id === targetId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        [newItems[draggedIndex], newItems[targetIndex]] = [
          newItems[targetIndex],
          newItems[draggedIndex],
        ];
        setItems(newItems);
        onItemsChange?.(newItems);
      }

      setTimeout(() => {
        setDraggedItem(null);
        setIsTransitioning(false);
      }, 100);
    },
    [draggedItem, items, onItemsChange]
  );

  const handleItemClick = useCallback(
    (itemId: string) => {
      if (draggedItem || isTransitioning) return;

      setIsTransitioning(true);
      const newItems = items.map((item) => ({
        ...item,
        isExpanded: item.id === itemId ? !item.isExpanded : false,
      }));
      setItems(newItems);
      onItemsChange?.(newItems);

      setTimeout(() => setIsTransitioning(false), 300);
    },
    [items, onItemsChange, draggedItem, isTransitioning]
  );

  const hasExpandedItem = items.some((item) => item.isExpanded);
  const expandedItem = items.find((item) => item.isExpanded);

  // Carousel view for mobile and tablet
  if ((isMobile || isTablet) && isLibrary && !hasExpandedItem) {
    const visibleItems = getCurrentItems();
    const totalSlides = Math.ceil(items.length / itemsPerView);
    const currentSlide = Math.floor(currentIndex / itemsPerView);
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
        {/* Navigation arrows */}
        <button
          onClick={prevItems}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: "linear-gradient(145deg, #f4f1ed, #e7e0d5)",
            border: "1px solid rgba(91, 1, 8, 0.08)",
            boxShadow: `
              4px 4px 8px rgba(91, 1, 8, 0.06),
              -4px -4px 8px rgba(255, 255, 255, 0.7)
            `,
          }}
        >
          <svg className="w-6 h-6 text-[#C62328]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button
          onClick={nextItems}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: "linear-gradient(145deg, #f4f1ed, #e7e0d5)",
            border: "1px solid rgba(91, 1, 8, 0.08)",
            boxShadow: `
              4px 4px 8px rgba(91, 1, 8, 0.06),
              -4px -4px 8px rgba(255, 255, 255, 0.7)
            `,
          }}
        >
          <svg className="w-6 h-6 text-[#C62328]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        {/* Current items */}
        <motion.div
          key={currentIndex}
          className={`w-full mx-auto flex flex-col gap-6 ${
            isMobile ? 'max-w-sm' : 'max-w-md'
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer"
              onClick={() => handleItemClick(item.id)}
            >
              {item.component}
            </div>
          ))}
        </motion.div>

        {/* Dots indicator */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerView)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-[#C62328] scale-125'
                  : 'bg-[#C62328]/30 hover:bg-[#C62328]/50'
              }`}
              style={{
                boxShadow: index === currentSlide 
                  ? '0 2px 4px rgba(198, 35, 40, 0.3)' 
                  : '0 1px 2px rgba(91, 1, 8, 0.1)'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Renderizado condicional: grid normal vs layout expandido
  if (hasExpandedItem && expandedItem) {
    return (
      <div className={`w-full h-full overflow-hidden ${
        isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'
      }`}>
        <div className="w-full h-full flex flex-col gap-6">
          {/* Item expandido - estilo neomorphic EYRA */}
          <motion.div
            key={expandedItem.id}
            layoutId={expandedItem.id}
            initial={false}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="flex-1 relative cursor-pointer overflow-hidden"
            onClick={() => handleItemClick(expandedItem.id)}
            style={{
              minHeight: isMobile ? "320px" : isTablet ? "360px" : "400px",
              background: "#e7e0d5",
              borderRadius: isMobile ? "20px" : "24px",
              border: "1px solid rgba(91, 1, 8, 0.1)",
              boxShadow: isMobile ? `
                15px 15px 30px rgba(91, 1, 8, 0.06),
                -15px -15px 30px rgba(255, 255, 255, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.15)
              ` : `
                20px 20px 40px rgba(91, 1, 8, 0.08),
                -20px -20px 40px rgba(255, 255, 255, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.15)
              `,
            }}
            whileHover={isDesktop ? {
              boxShadow: `
                25px 25px 50px rgba(91, 1, 8, 0.12),
                -25px -25px 50px rgba(255, 255, 255, 0.35),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
            } : {}}
          >
            {/* Icono de drag expandido - mejorado */}
            <div className={`absolute z-20 ${
              isMobile ? 'top-3 right-3' : 'top-4 right-4'
            }`}>
              <div
                className={`rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                  isMobile ? 'w-7 h-7' : 'w-8 h-8'
                }`}
                style={{
                  background: "linear-gradient(145deg, #e7d6b8, #d4c4a5)",
                  border: "1px solid rgba(91, 1, 8, 0.2)",
                  boxShadow: `
                    3px 3px 6px rgba(91, 1, 8, 0.08),
                    -3px -3px 6px rgba(255, 255, 255, 0.7)
                  `,
                }}
              >
                <svg
                  className={`text-[#5b0108] opacity-80 ${
                    isMobile ? 'w-3 h-3' : 'w-4 h-4'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  <path d="M6 10a2 2 0 110-4 2 2 0 010 4zM6 16a2 2 0 110-4 2 2 0 010 4zM6 4a2 2 0 110-4 2 2 0 010 4z" />
                  <path d="M14 10a2 2 0 110-4 2 2 0 010 4zM14 16a2 2 0 110-4 2 2 0 010 4zM14 4a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </div>
            </div>

            <div className="w-full h-full relative">
              {expandedItem.expandedComponent ? 
                React.cloneElement(expandedItem.expandedComponent as React.ReactElement, {
                  onClose: () => handleItemClick(expandedItem.id)
                }) : 
                expandedItem.component
              }
            </div>
          </motion.div>

          {/* Items colapsados - adaptables */}
          <motion.div
            className={`flex gap-4 flex-shrink-0 ${
              isMobile 
                ? 'flex-col h-auto max-h-48 overflow-y-auto' 
                : isTablet 
                  ? 'flex-row h-20' 
                  : 'flex-row h-24'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {items
              .filter((item) => !item.isExpanded)
              .map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  initial={false}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  draggable={!isTransitioning}
                  onDragStart={(e) => handleDragStart(e as any, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e as any, item.id)}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative group cursor-pointer overflow-hidden ${
                    isMobile ? 'w-full min-h-16' : 'flex-1 min-w-0'
                  } ${isLibrary ? 'library-tent-container' : ''}`}
                  style={!isLibrary ? {
                    background: "#e7e0d5",
                    borderRadius: isMobile ? "12px" : "16px",
                    border: "1px solid rgba(91, 1, 8, 0.1)",
                    boxShadow: isMobile ? `
                      6px 6px 12px rgba(91, 1, 8, 0.06),
                      -6px -6px 12px rgba(255, 255, 255, 0.25)
                    ` : `
                      8px 8px 16px rgba(91, 1, 8, 0.06),
                      -8px -8px 16px rgba(255, 255, 255, 0.25)
                    `,
                  } : {}}
                  whileHover={!isLibrary && isDesktop ? {
                    scale: 1.02,
                    boxShadow: `
                      10px 10px 20px rgba(91, 1, 8, 0.08),
                      -10px -10px 20px rgba(255, 255, 255, 0.35)
                    `,
                  } : !isLibrary ? { scale: 1.01 } : {}}
                  whileTap={!isLibrary && !isMobile ? { scale: 0.98 } : {}}
                >
                  {/* Icono de drag mini - solo si no es librería */}
                  {!isLibrary && !isMobile && (
                    <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div
                        className="w-6 h-6 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center"
                        style={{
                          background: "linear-gradient(145deg, #e7d6b8, #d4c4a5)",
                          border: "1px solid rgba(91, 1, 8, 0.1)",
                          boxShadow: `
                          2px 2px 4px rgba(91, 1, 8, 0.05),
                          -2px -2px 4px rgba(255, 255, 255, 0.25)
                        `,
                        }}
                      >
                        <svg
                          className="w-3 h-3 text-[#5b0108]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className={isLibrary ? "w-full h-full" : `h-full flex items-center ${
                    isMobile ? 'p-3' : 'p-4'
                  }`}>
                    {!isLibrary && (
                      <h4 className={`font-serif text-[#5b0108] truncate font-medium ${
                        isMobile ? 'text-xs' : 'text-sm'
                      }`}>
                        {item.title}
                      </h4>
                    )}
                    {/* Para la librería: cuando está en la fila horizontal, solo mostrar texto */}
                    {isLibrary && (
                      <div className={`w-full h-full flex flex-col items-center justify-center ${
                        isMobile ? 'px-1' : 'px-2'
                      }`}>
                        {/* Línea decorativa */}
                        <div className={`h-0.5 bg-gradient-to-r from-transparent via-[#C62328] to-transparent opacity-60 rounded-full mb-2 flex-shrink-0 ${
                          isMobile ? 'w-2/3' : 'w-3/5'
                        }`} />
                        
                        {/* Nombre mitológico */}
                        <p className={`font-serif font-bold text-[#7a2323] mb-1 truncate text-center ${
                          isMobile ? 'text-xs' : 'text-sm'
                        }`}>
                          {(() => {
                            switch (item.id) {
                              case "history": return "Mnemósine";
                              case "science": return "Atenea";
                              case "phases": return "Selene";
                              case "inclusivity": return "Artemisa";
                              case "maternity": return "Deméter";
                              case "wisdom": return "Hestia";
                              default: return "Refugio";
                            }
                          })()
                        }
                        </p>
                        
                        {/* Descripción breve */}
                        <p className={`font-sans text-[#5b0108] leading-tight line-clamp-2 text-center ${
                          isMobile ? 'text-xs' : 'text-xs'
                        }`}>
                          {(() => {
                            switch (item.id) {
                              case "history": return "Historias ancestrales";
                              case "science": return "Papers científicos";
                              case "phases": return "Mitología y creencias";
                              case "inclusivity": return "Productos naturales";
                              case "maternity": return "Rituales y ceremonias";
                              case "wisdom": return "Sabiduría ancestral";
                              default: return "Conocimiento sagrado";
                            }
                          })()
                        }
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
    );
  }

  // Grid normal cuando no hay elementos expandidos - responsive optimizado
  return (
    <div className={`w-full h-full overflow-hidden ${
      isMobile ? 'p-3' : isTablet ? 'p-6' : 'p-4 md:p-8'
    }`}>
      <div 
        className={`gap-4 md:gap-8 h-full ${
          isMobile 
            ? 'grid grid-cols-1 auto-rows-fr' 
            : isTablet 
              ? 'grid grid-cols-2 auto-rows-fr' 
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr'
        }`}
        style={isDesktop ? { gridTemplateRows: "repeat(2, 1fr)" } : {}}
      >
        <AnimatePresence mode="sync">
          {items.map((item) => {
            const isDragged = draggedItem === item.id;

            return (
              <motion.div
                key={item.id}
                layoutId={item.id}
                initial={false}
                animate={{
                  opacity: isDragged ? 0.7 : 1,
                  scale: isDragged ? 0.95 : 1,
                  zIndex: isDragged ? 50 : 1,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                  layout: {
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }}
                draggable={!isTransitioning}
                onDragStart={(e) => handleDragStart(e as any, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e as any, item.id)}
                onClick={() => handleItemClick(item.id)}
                className={`col-span-1 row-span-1 relative group cursor-grab active:cursor-grabbing overflow-hidden transform-gpu will-change-transform transition-all duration-200 ${
                  !isTransitioning && isDesktop ? 'hover:scale-[1.02]' : ''
                } ${isLibrary ? 'library-tent-container' : ''}`}
                style={!isLibrary ? {
                  minHeight: isMobile ? "200px" : isTablet ? "220px" : "240px",
                  background: "#e7e0d5",
                  borderRadius: isMobile ? "16px" : "20px",
                  border: "1px solid rgba(91, 1, 8, 0.1)",
                  boxShadow: isMobile ? `
                    10px 10px 20px rgba(91, 1, 8, 0.06),
                    -10px -10px 20px rgba(255, 255, 255, 0.25),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15)
                  ` : `
                    15px 15px 30px rgba(91, 1, 8, 0.08),
                    -15px -15px 30px rgba(255, 255, 255, 0.25),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15)
                  `,
                  pointerEvents: isTransitioning ? "none" : "auto",
                } : {
                  minHeight: isMobile ? "200px" : isTablet ? "220px" : "240px",
                  pointerEvents: isTransitioning ? "none" : "auto",
                }}
                whileHover={
                  !isDragged && !isTransitioning && !isLibrary && isDesktop
                    ? {
                        scale: 1.02,
                        y: -2,
                        boxShadow: `
                          20px 20px 40px rgba(91, 1, 8, 0.12),
                          -20px -20px 40px rgba(255, 255, 255, 0.35),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2),
                          0 6px 20px rgba(91, 1, 8, 0.08)
                        `,
                        transition: { duration: 0.2 },
                      }
                    : isLibrary && !isDragged && !isTransitioning && isDesktop
                    ? {
                        scale: 1.01,
                        transition: { duration: 0.2 },
                      }
                    : {}
                }
                whileTap={
                  !isDragged && !isTransitioning && !isLibrary && !isMobile
                    ? {
                        scale: 0.98,
                        transition: { duration: 0.1 },
                      }
                    : {}
                }
              >
                {/* Icono de drag - solo si no es librería y no es móvil - mejorado */}
                {!isLibrary && !isMobile && (
                  <motion.div
                    className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100"
                    initial={false}
                    animate={{ opacity: isDragged ? 1 : undefined }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div
                      className="w-7 h-7 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{
                        background: "linear-gradient(145deg, #e7d6b8, #d4c4a5)",
                        border: "1px solid rgba(91, 1, 8, 0.2)",
                        boxShadow: `
                          2px 2px 4px rgba(91, 1, 8, 0.08),
                          -2px -2px 4px rgba(255, 255, 255, 0.7)
                        `,
                      }}
                    >
                      <svg
                        className="w-3.5 h-3.5 text-[#5b0108] opacity-80"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        <path d="M6 10a2 2 0 110-4 2 2 0 010 4zM6 16a2 2 0 110-4 2 2 0 010 4zM6 4a2 2 0 110-4 2 2 0 010 4z" />
                        <path d="M14 10a2 2 0 110-4 2 2 0 010 4zM14 16a2 2 0 110-4 2 2 0 010 4zM14 4a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </div>
                  </motion.div>
                )}

                {/* Contenido diferente según si es librería o no */}
                {isLibrary ? (
                  // Para la librería: renderizar directamente el componente (tienda)
                  <div className="w-full h-full">
                    {item.component}
                  </div>
                ) : (
                  // Para otras páginas: layout normal con título
                  <div className={`w-full h-full flex flex-col ${
                    isMobile ? 'p-4' : 'p-6'
                  }`}>
                    <div className="flex items-center justify-between mb-6 flex-shrink-0">
                      <h3 className={`font-serif text-[#5b0108] truncate font-light tracking-wide ${
                        isMobile ? 'text-base pr-6' : 'text-lg pr-8'
                      }`}>
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex-1 overflow-hidden">{item.component}</div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DraggableGrid;