import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const DraggableGrid: React.FC<DraggableGridProps> = ({ items: initialItems, onItemsChange }) => {
  const [items, setItems] = useState<GridItem[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem);
    const targetIndex = newItems.findIndex(item => item.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      [newItems[draggedIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[draggedIndex]];
      setItems(newItems);
      onItemsChange?.(newItems);
    }

    setDraggedItem(null);
  };

  const handleItemClick = (itemId: string) => {
    const newItems = items.map(item => ({
      ...item,
      isExpanded: item.id === itemId ? !item.isExpanded : false
    }));
    setItems(newItems);
    onItemsChange?.(newItems);
  };

  const hasExpandedItem = items.some(item => item.isExpanded);

  return (
    <div className="w-full h-full p-6 overflow-hidden">
      <div className="grid grid-cols-3 gap-6 h-full" style={{ gridTemplateRows: 'repeat(2, 1fr)' }}>
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: draggedItem === item.id ? 0.4 : 1, 
                scale: draggedItem === item.id ? 0.95 : 1 
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.23, 1, 0.320, 1], // easeOutQuart para suavidad
                layout: { duration: 0.5, ease: "easeInOut" }
              }}
              draggable
              onDragStart={(e) => handleDragStart(e as any, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e as any, item.id)}
              onClick={() => handleItemClick(item.id)}
              className={`
                ${item.isExpanded ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}
                bg-white rounded-xl shadow-lg overflow-hidden relative group cursor-pointer
              `}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                minHeight: item.isExpanded ? '100%' : '200px'
              }}
            >
              {/* Icono de drag con animación */}
              <motion.div 
                className="absolute top-3 right-3 z-20"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <svg 
                    className="w-4 h-4 text-gray-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    <path d="M6 10a2 2 0 110-4 2 2 0 010 4zM6 16a2 2 0 110-4 2 2 0 010 4zM6 4a2 2 0 110-4 2 2 0 010 4z" />
                    <path d="M14 10a2 2 0 110-4 2 2 0 010 4zM14 16a2 2 0 110-4 2 2 0 010 4zM14 4a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </motion.div>
              </motion.div>

              <div className="w-full h-full p-6 flex flex-col">
                <motion.div 
                  className="flex items-center justify-between mb-4 flex-shrink-0"
                  layout
                >
                  <motion.h3 
                    className="font-serif text-lg text-[#5b0108] truncate pr-8"
                    layout
                  >
                    {item.title}
                  </motion.h3>
                  {item.isExpanded && (
                    <motion.span 
                      className="text-xs text-gray-500 flex-shrink-0"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: 0.2 }}
                    >
                      Expandido
                    </motion.span>
                  )}
                </motion.div>
                
                {/* Contenido con animación condicional */}
                <AnimatePresence mode="wait">
                  {(!hasExpandedItem || item.isExpanded) && (
                    <motion.div 
                      key={`content-${item.id}`}
                      className={`flex-1 ${item.isExpanded ? 'overflow-auto' : 'overflow-hidden'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        duration: 0.3,
                        delay: item.isExpanded ? 0.2 : 0 
                      }}
                      layout
                    >
                      {item.component}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DraggableGrid;