// Configuraciones de animaciones reutilizables para el calendario neomorphic

export const calendarAnimations = {
  // Animaciones de entrada para los elementos del calendario
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  fadeInScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  slideInFromRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },

  slideInFromLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },

  // Animaciones específicas para días del calendario
  dayCell: {
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
    today: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },

  // Animaciones para indicadores de flujo
  flowDots: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },

  // Animaciones para el modal
  modal: {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    content: {
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 20 },
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3,
      },
    },
  },

  // Animaciones para navegación
  navigation: {
    button: {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
      transition: { duration: 0.1 },
    },
    title: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, ease: "easeOut" },
    },
  },

  // Animaciones para cambio de vista
  viewTransition: {
    month: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
      transition: { duration: 0.3 },
    },
    week: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
      transition: { duration: 0.3 },
    },
    day: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.1 },
      transition: { duration: 0.4 },
    },
  },

  // Stagger para grids
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.02,
        },
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  },

  // Animaciones de loading
  loading: {
    spinner: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },

  // Efectos especiales
  special: {
    glow: {
      boxShadow: [
        "0 0 0px rgba(122, 35, 35, 0)",
        "0 0 20px rgba(122, 35, 35, 0.3)",
        "0 0 0px rgba(122, 35, 35, 0)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    float: {
      y: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};

// Configuraciones de spring para diferentes tipos de elementos
export const springConfigs = {
  gentle: {
    type: "spring",
    stiffness: 100,
    damping: 15,
    mass: 1,
  },

  bouncy: {
    type: "spring",
    stiffness: 300,
    damping: 20,
    mass: 1,
  },

  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  },
};

// Variantes para elementos complejos
export const variants = {
  // Para grids de días
  calendarGrid: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.1,
      },
    },
  },

  calendarDay: {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  },

  // Para listas de síntomas/estados de ánimo
  symptomList: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  symptomItem: {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
      },
    },
  },

  // Para navegación entre vistas
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  },
};

// Hooks de utilidad para animaciones comunes
export const useCalendarAnimations = () => {
  return {
    // Función para crear animación stagger personalizada
    createStagger: (delay: number = 0.02) => ({
      container: {
        animate: {
          transition: {
            staggerChildren: delay,
          },
        },
      },
      item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      },
    }),

    // Función para animaciones de entrada basadas en índice
    getEntranceAnimation: (index: number, total: number) => ({
      initial: { opacity: 0, y: 20, scale: 0.9 },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: (index / total) * 0.1,
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      },
    }),

    // Función para animaciones de hover neomorphic
    getNeomorphicHover: (baseColor: string = "#e7e0d5") => ({
      hover: {
        scale: 1.02,
        boxShadow: `4px 4px 12px rgba(122, 35, 35, 0.15), -2px -2px 8px rgba(255, 255, 255, 0.7)`,
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.98,
        boxShadow: `inset 2px 2px 6px rgba(199, 191, 180, 0.3), inset -2px -2px 6px rgba(255, 255, 255, 0.7)`,
        transition: { duration: 0.1 },
      },
    }),
  };
};
