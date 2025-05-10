// Este archivo contiene las extensiones de tipos globales para TypeScript

// Extensión de Window para eventos personalizados
interface Window {
  appReadyEvent?: Event;
}

// Extensión para trabajar con eventos personalizados
declare global {
  interface Window {
    appReadyEvent?: Event;
  }
}

export {};
