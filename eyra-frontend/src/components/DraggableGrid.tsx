import React, { useState, ReactNode, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GridItem {
  id: string;
  component: ReactNode;
  title: string;
  isExpanded?: boolean;
}

interface DraggableGridProps {
  items: GridItem[];
  onItemsChange?: (items: GridItem[]) => void;
}

const DraggableGrid: React.FC<DraggableGridProps> = ({
  items: initialItems,
  onItemsChange,
}) => {
  const [items, setItems] = useState<GridItem[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sincronizar estado interno cuando cambien los props
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

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

  // Renderizado condicional: grid normal vs layout expandido
  if (hasExpandedItem && expandedItem) {
    return (
      <div className="w-full h-full p-8 overflow-hidden">
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
              minHeight: "400px",
              background: "#e7e0d5",
              borderRadius: "24px",
              border: "1px solid rgba(91, 1, 8, 0.1)",
              boxShadow: `
                20px 20px 40px rgba(91, 1, 8, 0.08),
                -20px -20px 40px rgba(255, 255, 255, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.15)
              `,
            }}
            whileHover={{
              boxShadow: `
                25px 25px 50px rgba(91, 1, 8, 0.12),
                -25px -25px 50px rgba(255, 255, 255, 0.35),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            {/* Icono de drag expandido */}
            <div className="absolute top-6 right-6 z-20">
              <div
                className="w-10 h-10 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center"
                style={{
                  background: "linear-gradient(145deg, #e7d6b8, #d4c4a5)",
                  border: "1px solid rgba(91, 1, 8, 0.15)",
                  boxShadow: `
                    4px 4px 8px rgba(91, 1, 8, 0.06),
                    -4px -4px 8px rgba(255, 255, 255, 0.6)
                  `,
                }}
              >
                <svg
                  className="w-5 h-5 text-[#5b0108]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  <path d="M6 10a2 2 0 110-4 2 2 0 010 4zM6 16a2 2 0 110-4 2 2 0 010 4zM6 4a2 2 0 110-4 2 2 0 010 4z" />
                  <path d="M14 10a2 2 0 110-4 2 2 0 010 4zM14 16a2 2 0 110-4 2 2 0 010 4zM14 4a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </div>
            </div>

            <div className="w-full h-full p-8 flex flex-col relative">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h3 className="font-serif text-2xl text-[#5b0108] font-light tracking-wide">
                  {expandedItem.title}
                </h3>
                
              </div>

              <div className="flex-1 overflow-auto">
                {expandedItem.component}
              </div>
            </div>
          </motion.div>

          {/* Items colapsados - fila horizontal neomorphic EYRA */}
          <motion.div
            className="flex gap-4 h-24 flex-shrink-0"
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
                  className="flex-1 min-w-0 relative group cursor-pointer overflow-hidden"
                  style={{
                    background: "#e7e0d5",
                    borderRadius: "16px",
                    border: "1px solid rgba(91, 1, 8, 0.1)",
                    boxShadow: `
                    8px 8px 16px rgba(91, 1, 8, 0.06),
                    -8px -8px 16px rgba(255, 255, 255, 0.25)
                  `,
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `
                    10px 10px 20px rgba(91, 1, 8, 0.08),
                    -10px -10px 20px rgba(255, 255, 255, 0.35)
                  `,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icono de drag mini */}
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

                  <div className="p-4 h-full flex items-center">
                    <h4 className="font-serif text-sm text-[#5b0108] truncate font-medium">
                      {item.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
    );
  }

  // Grid normal cuando no hay elementos expandidos - estilo neomorphic EYRA
  return (
    <div className="w-full h-full p-8 overflow-hidden">
      <div
        className="grid grid-cols-3 gap-8 h-full"
        style={{ gridTemplateRows: "repeat(2, 1fr)" }}
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
                className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden transform-gpu will-change-transform"
                style={{
                  minHeight: "240px",
                  background: "#e7e0d5",
                  borderRadius: "20px",
                  border: "1px solid rgba(91, 1, 8, 0.1)",
                  boxShadow: `
                    15px 15px 30px rgba(91, 1, 8, 0.08),
                    -15px -15px 30px rgba(255, 255, 255, 0.25),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15)
                  `,
                  pointerEvents: isTransitioning ? "none" : "auto",
                }}
                whileHover={
                  !isDragged && !isTransitioning
                    ? {
                        scale: 1.02,
                        boxShadow: `
                    20px 20px 40px rgba(91, 1, 8, 0.12),
                    -20px -20px 40px rgba(255, 255, 255, 0.35),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                        transition: { duration: 0.2 },
                      }
                    : {}
                }
                whileTap={
                  !isDragged && !isTransitioning
                    ? {
                        scale: 0.98,
                        transition: { duration: 0.1 },
                      }
                    : {}
                }
              >
                {/* Icono de drag neomorphic EYRA */}
                <motion.div
                  className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100"
                  initial={false}
                  animate={{ opacity: isDragged ? 1 : undefined }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="w-8 h-8 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #e7d6b8, #d4c4a5)",
                      border: "1px solid rgba(91, 1, 8, 0.15)",
                      boxShadow: `
                        3px 3px 6px rgba(91, 1, 8, 0.06),
                        -3px -3px 6px rgba(255, 255, 255, 0.25)
                      `,
                    }}
                  >
                    <svg
                      className="w-4 h-4 text-[#5b0108]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      <path d="M6 10a2 2 0 110-4 2 2 0 010 4zM6 16a2 2 0 110-4 2 2 0 010 4zM6 4a2 2 0 110-4 2 2 0 010 4z" />
                      <path d="M14 10a2 2 0 110-4 2 2 0 010 4zM14 16a2 2 0 110-4 2 2 0 010 4zM14 4a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                </motion.div>

                <div className="w-full h-full p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <h3 className="font-serif text-lg text-[#5b0108] truncate pr-8 font-light tracking-wide">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex-1 overflow-hidden">{item.component}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DraggableGrid;
