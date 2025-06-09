import React, {
  useState,
  ReactNode,
  ReactElement,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useViewport } from "../hooks/useViewport";

interface GridItem {
  id: string;
  component: ReactNode;
  title: string;
  isExpanded?: boolean;
  expandedComponent?: ReactElement<{ onClose?: () => void }> | ReactNode;
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
  const transitionTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  // Estado para navegación de items colapsados en móvil
  const [collapsedIndex, setCollapsedIndex] = useState(0);

  // Optimización de animaciones
  const getAnimationConfig = useCallback(
    () => ({
      duration: isMobile ? 0.2 : 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 300,
      damping: 30,
    }),
    [isMobile]
  );

  // Limpieza de timeouts
  useEffect(() => {
    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
    };
  }, []);

  // Optimización del manejo de transiciones
  const handleTransition = useCallback((callback: () => void) => {
    setIsTransitioning(true);
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }
    callback();
    transitionTimeout.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, []);

  // Optimización del drag and drop
  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemId);
    setDraggedItem(itemId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();

      if (!draggedItem || draggedItem === targetId) {
        handleDragEnd();
        return;
      }

      handleTransition(() => {
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

        handleDragEnd();
      });
    },
    [draggedItem, items, onItemsChange, handleTransition, handleDragEnd]
  );

  // Optimización del manejo de expansión
  const handleItemClick = useCallback(
    (itemId: string) => {
      if (draggedItem || isTransitioning) return;

      handleTransition(() => {
        const newItems = items.map((item) => ({
          ...item,
          isExpanded: item.id === itemId ? !item.isExpanded : false,
        }));
        setItems(newItems);
        onItemsChange?.(newItems);
      });
    },
    [items, onItemsChange, draggedItem, isTransitioning, handleTransition]
  );

  // Helper function to safely clone React elements
  const safeCloneElement = useCallback((element: ReactNode, props: any) => {
    if (React.isValidElement(element)) {
      return React.cloneElement(element, props);
    }
    return element;
  }, []);

  // Sincronizar estado interno cuando cambien los props
  useEffect(() => {
    setItems(initialItems);
    setCollapsedIndex(0); // Reset collapsed index when items change
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
    setCurrentIndex(
      (prev) => (prev - itemsPerView + items.length) % items.length
    );
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  // Funciones de navegación para vista expandida (hooks en nivel superior)
  const navigateToNext = useCallback(() => {
    const currentExpandedIndex = items.findIndex((item) => item.isExpanded);
    const nextIndex = (currentExpandedIndex + 1) % items.length;
    handleItemClick(items[nextIndex].id);
  }, [items, handleItemClick]);

  const navigateToPrev = useCallback(() => {
    const currentExpandedIndex = items.findIndex((item) => item.isExpanded);
    const prevIndex =
      currentExpandedIndex === 0 ? items.length - 1 : currentExpandedIndex - 1;
    handleItemClick(items[prevIndex].id);
  }, [items, handleItemClick]);

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
          <svg
            className="w-6 h-6 text-[#C62328]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
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
          <svg
            className="w-6 h-6 text-[#C62328]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Current items */}
        <motion.div
          key={currentIndex}
          className="w-full mx-auto flex flex-col gap-6"
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
                  ? "bg-[#C62328] scale-125"
                  : "bg-[#C62328]/30 hover:bg-[#C62328]/50"
              }`}
              style={{
                boxShadow:
                  index === currentSlide
                    ? "0 2px 4px rgba(198, 35, 40, 0.3)"
                    : "0 1px 2px rgba(91, 1, 8, 0.1)",
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
      <div
        className={`w-full h-full overflow-hidden ${
          isMobile ? "p-4" : isTablet ? "p-6" : "p-8"
        }`}
      >
        <div
          className={`w-full h-full flex flex-col ${
            isMobile ? "gap-4" : "gap-6"
          }`}
        >
          {/* Item expandido - estilo neomorphic EYRA */}
          <motion.div
            key={expandedItem.id}
            layoutId={expandedItem.id}
            initial={false}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="flex-1 relative overflow-hidden"
            style={{
              minHeight: isMobile ? "250px" : isTablet ? "360px" : "400px", // Reducida altura en móvil
              maxHeight: isMobile ? "calc(100vh - 200px)" : undefined, // Altura máxima en móvil
              background: "#e7e0d5",
              borderRadius: isMobile ? "20px" : "24px",
              border: "1px solid rgba(91, 1, 8, 0.1)",
              boxShadow: isMobile
                ? `
                15px 15px 30px rgba(91, 1, 8, 0.06),
                -15px -15px 30px rgba(255, 255, 255, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.15)
              `
                : `
                20px 20px 40px rgba(91, 1, 8, 0.08),
                -20px -20px 40px rgba(255, 255, 255, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.15)
              `,
            }}
            whileHover={
              isDesktop
                ? {
                    boxShadow: `
                25px 25px 50px rgba(91, 1, 8, 0.12),
                -25px -25px 50px rgba(255, 255, 255, 0.35),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
                  }
                : {}
            }
          >
            {/* ! 09/06/2025 - Área de cierre solo en el header */}
            <div 
              className="absolute top-0 left-0 right-0 h-12 z-10 cursor-pointer"
              onClick={() => handleItemClick(expandedItem.id)}
              title="Clic para cerrar"
            />

            {/* Icono de drag expandido - mejorado */}
            <div
              className={`absolute z-20 ${
                isMobile ? "top-3 right-3" : "top-4 right-4"
              }`}
            >
              <div
                className={`rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                  isMobile ? "w-7 h-7" : "w-8 h-8"
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
                    isMobile ? "w-3 h-3" : "w-4 h-4"
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
              {expandedItem.expandedComponent
                ? safeCloneElement(expandedItem.expandedComponent, {
                    onClose: () => handleItemClick(expandedItem.id),
                  })
                : expandedItem.component}
            </div>
          </motion.div>

          {/* Items colapsados - adaptables */}
          <motion.div
            className={`flex gap-4 flex-shrink-0 ${
              isMobile
                ? "flex-col h-20 relative" // Reducida altura en móvil
                : isTablet
                ? "flex-row h-20"
                : "flex-row h-24"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {isMobile ? (
              // Móvil: Layout horizontal con botones de navegación y caja central
              <>
                <div className="flex items-center justify-between gap-3">
                  {/* Botón anterior - solo si hay más de 1 item */}
                  {items.length > 1 ? (
                    <button
                      onClick={() =>
                        setCollapsedIndex((prev) => {
                          const collapsedItems = items.filter(
                            (item) => !item.isExpanded
                          );
                          return prev === 0
                            ? collapsedItems.length - 1
                            : prev - 1;
                        })
                      }
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0"
                      style={{
                        background: "linear-gradient(145deg, #f4f1ed, #e7e0d5)",
                        border: "1px solid rgba(91, 1, 8, 0.08)",
                        boxShadow: `
                          4px 4px 8px rgba(91, 1, 8, 0.06),
                          -4px -4px 8px rgba(255, 255, 255, 0.7)
                        `,
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-[#C62328]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  ) : (
                    <div className="w-10 h-10 flex-shrink-0"></div> /* Spacer cuando solo hay 1 item */
                  )}

                  {/* Contenedor del item actual - más estrecho */}
                  <div className="flex-1 flex items-center justify-center max-w-xs">
                    {(() => {
                      const collapsedItems = items.filter(
                        (item) => !item.isExpanded
                      );
                      if (collapsedItems.length === 0) return null;

                      const currentCollapsedItem =
                        collapsedItems[collapsedIndex % collapsedItems.length];
                      if (!currentCollapsedItem) return null;

                      return (
                        <motion.div
                          key={currentCollapsedItem.id}
                          layoutId={currentCollapsedItem.id}
                          initial={false}
                          transition={{
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          draggable={!isTransitioning}
                          onDragStart={(e) =>
                            handleDragStart(e as any, currentCollapsedItem.id)
                          }
                          onDragOver={handleDragOver}
                          onDrop={(e) =>
                            handleDrop(e as any, currentCollapsedItem.id)
                          }
                          onClick={() =>
                            handleItemClick(currentCollapsedItem.id)
                          }
                          className="w-full h-16 relative group cursor-pointer overflow-hidden"
                          style={{
                            background: "#e7e0d5",
                            borderRadius: "12px",
                            border: "1px solid rgba(91, 1, 8, 0.1)",
                            boxShadow: `
                              6px 6px 12px rgba(91, 1, 8, 0.06),
                              -6px -6px 12px rgba(255, 255, 255, 0.25)
                            `,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="h-full flex items-center justify-center p-2">
                            <h4 className="font-serif text-[#5b0108] text-center font-medium leading-tight text-xs px-1">
                              {currentCollapsedItem.title}
                            </h4>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </div>

                  {/* Botón siguiente - solo si hay más de 1 item */}
                  {items.length > 1 ? (
                    <button
                      onClick={() =>
                        setCollapsedIndex((prev) => {
                          const collapsedItems = items.filter(
                            (item) => !item.isExpanded
                          );
                          return (prev + 1) % collapsedItems.length;
                        })
                      }
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0"
                      style={{
                        background: "linear-gradient(145deg, #f4f1ed, #e7e0d5)",
                        border: "1px solid rgba(91, 1, 8, 0.08)",
                        boxShadow: `
                          4px 4px 8px rgba(91, 1, 8, 0.06),
                          -4px -4px 8px rgba(255, 255, 255, 0.7)
                        `,
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-[#C62328]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  ) : (
                    <div className="w-10 h-10 flex-shrink-0"></div> /* Spacer cuando solo hay 1 item */
                  )}
                </div>

                {/* Indicadores de página centrados debajo */}
                {(() => {
                  const collapsedItems = items.filter(
                    (item) => !item.isExpanded
                  );
                  if (collapsedItems.length <= 1) return null;

                  return (
                    <div className="flex items-center justify-center mt-2">
                      <div className="flex gap-2">
                        {collapsedItems.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCollapsedIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                              index === collapsedIndex % collapsedItems.length
                                ? "bg-[#C62328] scale-125"
                                : "bg-[#C62328]/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              // Tablet y Desktop: Layout horizontal normal
              items
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
                      isMobile
                        ? "w-24 h-full flex-shrink-0 snap-center"
                        : "flex-1 min-w-0"
                    } ${isLibrary ? "library-tent-container" : ""}`}
                    style={
                      !isLibrary
                        ? {
                            background: "#e7e0d5",
                            borderRadius: isMobile ? "12px" : "16px",
                            border: "1px solid rgba(91, 1, 8, 0.1)",
                            boxShadow: isMobile
                              ? `
                      6px 6px 12px rgba(91, 1, 8, 0.06),
                      -6px -6px 12px rgba(255, 255, 255, 0.25)
                    `
                              : `
                      8px 8px 16px rgba(91, 1, 8, 0.06),
                      -8px -8px 16px rgba(255, 255, 255, 0.25)
                    `,
                          }
                        : {}
                    }
                    whileHover={
                      !isLibrary && isDesktop
                        ? {
                            scale: 1.02,
                            boxShadow: `
                      10px 10px 20px rgba(91, 1, 8, 0.08),
                      -10px -10px 20px rgba(255, 255, 255, 0.35)
                    `,
                          }
                        : !isLibrary
                        ? { scale: 1.01 }
                        : {}
                    }
                    whileTap={!isLibrary && !isMobile ? { scale: 0.98 } : {}}
                  >
                    {/* Icono de drag mini - solo si no es librería */}
                    {!isLibrary && !isMobile && (
                      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div
                          className="w-6 h-6 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center"
                          style={{
                            background:
                              "linear-gradient(145deg, #e7d6b8, #d4c4a5)",
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

                    <div
                      className={
                        isLibrary
                          ? "w-full h-full"
                          : `h-full flex items-center justify-center ${
                              isMobile ? "p-2" : "p-4"
                            }`
                      }
                    >
                      {!isLibrary && (
                        <h4
                          className={`font-serif text-[#5b0108] text-center font-medium leading-tight ${
                            isMobile ? "text-xs px-1" : "text-sm"
                          }`}
                        >
                          {item.title}
                        </h4>
                      )}
                      {/* Para la librería: cuando está en la fila horizontal, solo mostrar texto */}
                      {isLibrary && (
                        <div
                          className={`w-full h-full flex flex-col items-center justify-center ${
                            isMobile ? "px-1" : "px-2"
                          }`}
                        >
                          {/* Línea decorativa */}
                          <div
                            className={`h-0.5 bg-gradient-to-r from-transparent via-[#C62328] to-transparent opacity-60 rounded-full mb-2 flex-shrink-0 ${
                              isMobile ? "w-2/3" : "w-3/5"
                            }`}
                          />

                          {/* Nombre mitológico */}
                          <p
                            className={`font-serif font-bold text-[#7a2323] mb-1 truncate text-center ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            {(() => {
                              switch (item.id) {
                                case "history":
                                  return "Mnemósine";
                                case "science":
                                  return "Atenea";
                                case "phases":
                                  return "Selene";
                                case "inclusivity":
                                  return "Artemisa";
                                case "maternity":
                                  return "Deméter";
                                case "wisdom":
                                  return "Hestia";
                                default:
                                  return "Refugio";
                              }
                            })()}
                          </p>

                          {/* Descripción breve */}
                          <p
                            className={`font-sans text-[#5b0108] leading-tight line-clamp-2 text-center ${
                              isMobile ? "text-xs" : "text-xs"
                            }`}
                          >
                            {(() => {
                              switch (item.id) {
                                case "history":
                                  return "Historias ancestrales";
                                case "science":
                                  return "Papers científicos";
                                case "phases":
                                  return "Mitología y creencias";
                                case "inclusivity":
                                  return "Productos naturales";
                                case "maternity":
                                  return "Rituales y ceremonias";
                                case "wisdom":
                                  return "Sabiduría ancestral";
                                default:
                                  return "Conocimiento sagrado";
                              }
                            })()}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Grid normal cuando no hay elementos expandidos - responsive optimizado
  return (
    <div
      className={`w-full ${
        isMobile && !isLibrary
          ? "h-auto overflow-y-auto"
          : "h-full overflow-hidden"
      } ${isMobile ? "p-3" : isTablet ? "p-6" : "p-4 md:p-8"}`}
    >
      <div
        className={`gap-4 md:gap-8 ${isMobile && !isLibrary ? "" : "h-full"} ${
          isMobile && !isLibrary
            ? "relative" // Posicionamiento relativo para mobile dashboard (efecto apilado)
            : isMobile
            ? "grid grid-cols-1 auto-rows-fr"
            : isTablet
            ? "grid grid-cols-2 auto-rows-fr"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
        } ${isLibrary ? "p-8" : ""}`}
        style={{
          ...(isDesktop ? { gridTemplateRows: "repeat(2, 1fr)" } : {}),
          // Altura calculada para el efecto apilado en móvil
          ...(isMobile && !isLibrary
            ? {
                height: `${200 + (items.length - 1) * 90}px`, // Primera carta (200px) + cartas apiladas (90px cada una)
                minHeight: "400px", // Altura mínima para asegurar que se vea bien
              }
            : {}),
        }}
      >
        <AnimatePresence mode="sync">
          {items.map((item, index) => {
            const isDragged = draggedItem === item.id;

            // Cálculo de posicionamiento para efecto apilado en móvil (solo dashboard)
            const cardHeight = 200; // Altura base de las cartas en móvil
            const stackingOffset = index * 90; // Aumentado de 60px a 90px para mostrar más de cada carta

            // Estilo de posicionamiento para móvil dashboard
            const mobileStackingStyle =
              isMobile && !isLibrary
                ? {
                    position: "absolute" as const,
                    top: `${stackingOffset}px`, // Primera carta arriba (0px), siguientes más abajo
                    left: "0px",
                    right: "0px",
                    height: `${cardHeight}px`,
                    zIndex: index + 1, // Z-index creciente: primera carta z-index=1 (fondo), siguientes más altos
                  }
                : {};

            return (
              <motion.div
                key={item.id}
                layoutId={item.id}
                initial={false}
                animate={{
                  scale: isDragged ? 0.95 : 1,
                  opacity: isDragged ? 0.7 : 1,
                  zIndex: isDragged
                    ? 50
                    : isMobile && !isLibrary
                    ? index + 1
                    : 1,
                }}
                transition={getAnimationConfig()}
                draggable={!isTransitioning}
                onDragStart={(e) => handleDragStart(e as any, item.id)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e as any, item.id)}
                onClick={() => handleItemClick(item.id)}
                className={`${
                  isMobile && !isLibrary
                    ? "w-full" // Móvil dashboard: ancho completo para apilado
                    : "col-span-1 row-span-1" // Otros casos: grid normal
                } relative group cursor-grab active:cursor-grabbing overflow-hidden transform-gpu will-change-transform ${
                  !isTransitioning && isDesktop ? "hover:scale-[1.02]" : ""
                } ${isLibrary ? "library-tent-container" : ""}`}
                style={{
                  ...mobileStackingStyle, // Aplicar estilo de apilado en móvil
                  minHeight: isMobile
                    ? `${cardHeight}px`
                    : isTablet
                    ? "220px"
                    : "240px",
                  background: "#e7e0d5",
                  borderRadius: isMobile ? "16px" : "20px",
                  border: "1px solid rgba(91, 1, 8, 0.1)",
                  boxShadow: isMobile
                    ? `
                    10px 10px 20px rgba(91, 1, 8, 0.06),
                    -10px -10px 20px rgba(255, 255, 255, 0.25),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15)
                  `
                    : `
                    15px 15px 30px rgba(91, 1, 8, 0.08),
                    -15px -15px 30px rgba(255, 255, 255, 0.25),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15)
                  `,
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
                      }
                    : {}
                }
                whileTap={
                  !isDragged && !isTransitioning && !isLibrary && !isMobile
                    ? {
                        scale: 0.98,
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
                  <div className="w-full h-full">{item.component}</div>
                ) : (
                  // Para otras páginas: layout normal con título
                  <div
                    className={`w-full h-full flex flex-col ${
                      isMobile ? "p-4" : "p-6"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6 flex-shrink-0">
                      <h3
                        className={`font-serif text-[#5b0108] truncate font-light tracking-wide ${
                          isMobile ? "text-base pr-6" : "text-lg pr-8"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      {item.component}
                    </div>
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
