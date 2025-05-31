/**
 *
 * Ahora incluye todas las opciones disponibles en el código de referencia
 * Todos los campos deben ser strings para coincidir con la estructura JSON del backend
 */

export interface AvatarConfig {
  // Campos principales
  skinColor: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  hairStyle: string;
  hairColor: string;
  facialHair: string;
  clothes: string;
  fabricColor: string;
  glasses: string;
  glassOpacity: string;
  accessories: string;
  accessoryColor: string;
  tattoos: string;
  tattooColor: string;
  backgroundColor: string;
}

/**
 * OPCIONES DISPONIBLES - Basadas en el código de referencia
 */

export const AVATAR_OPTIONS = {
  // Colores de piel - del código de referencia
  skinColors: [
    { value: "#ffdbb4", name: "Muy claro" },
    { value: "#edb98a", name: "Claro" },
    { value: "#fd9841", name: "Medio claro" },
    { value: "#fcee93", name: "Amarillento" },
    { value: "#d08b5b", name: "Medio" },
    { value: "#ae5d29", name: "Oscuro" },
    { value: "#614335", name: "Muy oscuro" },
  ],

  // Ojos - del código de referencia
  eyes: [
    { value: "default", name: "Normal" },
    { value: "dizzy", name: "Mareado" },
    { value: "eyeroll", name: "Ojos en blanco" },
    { value: "happy", name: "Feliz" },
    { value: "close", name: "Cerrados" },
    { value: "hearts", name: "Corazones" },
    { value: "side", name: "De lado" },
    { value: "wink", name: "Guiño" },
    { value: "squint", name: "Entrecerrados" },
    { value: "surprised", name: "Sorprendido" },
    { value: "winkwacky", name: "Guiño loco" },
    { value: "cry", name: "Llorando" },
  ],

  // Cejas - del código de referencia
  eyebrows: [
    { value: "default", name: "Normal" },
    { value: "default2", name: "Normal 2" },
    { value: "raised", name: "Levantadas" },
    { value: "sad", name: "Tristes" },
    { value: "sad2", name: "Tristes 2" },
    { value: "unibrow", name: "Unidas" },
    { value: "updown", name: "Asimétricas" },
    { value: "updown2", name: "Asimétricas 2" },
    { value: "angry", name: "Enfadadas" },
    { value: "angry2", name: "Enfadadas 2" },
  ],

  // Bocas - del código de referencia
  mouths: [
    { value: "default", name: "Normal" },
    { value: "twinkle", name: "Brillante" },
    { value: "tongue", name: "Lengua fuera" },
    { value: "smile", name: "Sonrisa" },
    { value: "serious", name: "Seria" },
    { value: "scream", name: "Grito" },
    { value: "sad", name: "Triste" },
    { value: "grimace", name: "Mueca" },
    { value: "eating", name: "Comiendo" },
    { value: "disbelief", name: "Incredulidad" },
    { value: "concerned", name: "Preocupada" },
    { value: "vomit", name: "Vomitando" },
  ],

  // Estilos de cabello - del código de referencia
  hairStyles: [
    { value: "longhair", name: "Largo" },
    { value: "longhairbob", name: "Bob largo" },
    { value: "hairbun", name: "Moño" },
    { value: "longhaircurly", name: "Largo rizado" },
    { value: "longhaircurvy", name: "Largo ondulado" },
    { value: "longhairdread", name: "Largo con rastas" },
    { value: "nottoolong", name: "Medio" },
    { value: "miawallace", name: "Estilo Mia Wallace" },
    { value: "longhairstraight", name: "Largo liso" },
    { value: "longhairstraight2", name: "Largo liso 2" },
    { value: "shorthairdreads", name: "Corto con rastas" },
    { value: "shorthairdreads2", name: "Corto rastas 2" },
    { value: "shorthairfrizzle", name: "Corto rizado" },
    { value: "shorthairshaggy", name: "Corto despeinado" },
    { value: "shorthaircurly", name: "Corto ondulado" },
    { value: "shorthairflat", name: "Corto plano" },
    { value: "shorthairround", name: "Corto redondo" },
    { value: "shorthairwaved", name: "Corto con ondas" },
    { value: "shorthairsides", name: "Corto a los lados" },
  ],

  // Colores de cabello - del código de referencia (formato: claro_medio_oscuro)
  hairColors: [
    { value: "#bb7748_#9a4f2b_#6f2912", name: "Castaño" },
    { value: "#404040_#262626_#101010", name: "Negro" },
    { value: "#c79d63_#ab733e_#844713", name: "Rubio oscuro" },
    { value: "#e1c68e_#d0a964_#b88339", name: "Rubio claro" },
    { value: "#906253_#663d32_#3b1d16", name: "Auburn" },
    { value: "#f8afaf_#f48a8a_#ed5e5e", name: "Rosa" },
    { value: "#f1e6cf_#e9d8b6_#dec393", name: "Platino" },
    { value: "#d75324_#c13215_#a31608", name: "Pelirrojo" },
    { value: "#59a0ff_#3777ff_#194bff", name: "Azul" },
  ],

  // Vello facial - del código de referencia
  facialHair: [
    { value: "none", name: "Ninguno" },
    { value: "magnum", name: "Bigote Magnum" },
    { value: "fancy", name: "Elegante" },
    { value: "magestic", name: "Majestuoso" },
    { value: "light", name: "Ligero" },
  ],

  // Ropa - del código de referencia
  clothes: [
    { value: "vneck", name: "Cuello en V" },
    { value: "sweater", name: "Suéter" },
    { value: "hoodie", name: "Sudadera con capucha" },
    { value: "overall", name: "Overol" },
    { value: "blazer", name: "Blazer" },
  ],

  // Colores de tela - del código de referencia
  fabricColors: [
    { value: "#545454", name: "Gris oscuro" },
    { value: "#65c9ff", name: "Azul claro" },
    { value: "#5199e4", name: "Azul" },
    { value: "#25557c", name: "Azul oscuro" },
    { value: "#e6e6e6", name: "Gris claro" },
    { value: "#929598", name: "Gris" },
    { value: "#a7ffc4", name: "Verde claro" },
    { value: "#ffdeb5", name: "Melocotón" },
    { value: "#ffafb9", name: "Rosa claro" },
    { value: "#ffffb1", name: "Amarillo claro" },
    { value: "#ff5c5c", name: "Rojo" },
    { value: "#e3adff", name: "Morado claro" },
  ],

  // Gafas - del código de referencia
  glasses: [
    { value: "none", name: "Ninguna" },
    { value: "rambo", name: "Estilo Rambo" },
    { value: "fancy", name: "Elegantes" },
    { value: "old", name: "Vintage" },
    { value: "nerd", name: "De empollón" },
    { value: "fancy2", name: "Elegantes 2" },
    { value: "harry", name: "Estilo Harry Potter" },
  ],

  // Opacidades de cristales - del código de referencia
  glassOpacities: [
    { value: "0.1", name: "10%" },
    { value: "0.25", name: "25%" },
    { value: "0.5", name: "50%" },
    { value: "0.75", name: "75%" },
    { value: "1.0", name: "100%" },
  ],

  // Tatuajes - del código de referencia
  tattoos: [
    { value: "none", name: "Ninguno" },
    { value: "harry", name: "Cicatriz Harry Potter" },
    { value: "airbender", name: "Avatar" },
    { value: "krilin", name: "Puntos Krilin" },
    { value: "front", name: "Frontal" },
    { value: "tribal", name: "Tribal" },
    { value: "tribal2", name: "Tribal 2" },
    { value: "throat", name: "Garganta" },
  ],

  // Accesorios - del código de referencia
  accessories: [
    { value: "none", name: "Ninguno" },
    { value: "earphones", name: "Auriculares" },
    { value: "earring1", name: "Pendiente 1" },
    { value: "earring2", name: "Pendiente 2" },
    { value: "earring3", name: "Pendiente 3" },
  ],

  // Colores de fondo - del código de referencia
  backgroundColors: [
    { value: "#ffffff", name: "Blanco" },
    { value: "#f5f6eb", name: "Crema" },
    { value: "#e5fde2", name: "Verde muy claro" },
    { value: "#d5effd", name: "Azul muy claro" },
    { value: "#d1d0fc", name: "Morado muy claro" },
    { value: "#f7d0fc", name: "Rosa muy claro" },
    { value: "#d0d0d0", name: "Gris claro" },
  ],
};

/**
 * Configuración por defecto del avatar - ACTUALIZADA
 */
export const defaultAvatarConfig: AvatarConfig = {
  skinColor: "#edb98a",
  eyes: "default",
  eyebrows: "default",
  mouth: "default",
  hairStyle: "longhair",
  hairColor: "#bb7748_#9a4f2b_#6f2912",
  facialHair: "none",
  clothes: "hoodie",
  fabricColor: "#545454",
  glasses: "none",
  glassOpacity: "0.5",
  accessories: "none",
  accessoryColor: "#FFD700",
  tattoos: "none",
  tattooColor: "#000000",
  backgroundColor: "#ffffff",
};

/**
 * Función para crear un avatar vacío/predeterminado
 */
export const createEmptyAvatarConfig = (): AvatarConfig => ({
  skinColor: "#F5D0A9",
  eyes: "default",
  eyebrows: "default",
  mouth: "default",
  hairStyle: "short",
  hairColor: "#4A4A4A",
  facialHair: "none",
  clothes: "tshirt",
  fabricColor: "#C62328",
  glasses: "none",
  glassOpacity: "0.8",
  accessories: "none",
  accessoryColor: "#FFD700",
  tattoos: "none",
  tattooColor: "#000000",
  backgroundColor: "#E7E0D5",
});

/**
 * Validador de configuración de avatar
 */
export const isValidAvatarConfig = (avatar: any): avatar is AvatarConfig => {
  if (!avatar || typeof avatar !== "object") return false;

  const requiredFields: (keyof AvatarConfig)[] = [
    "skinColor",
    "eyes",
    "eyebrows",
    "mouth",
    "hairStyle",
    "hairColor",
    "facialHair",
    "clothes",
    "fabricColor",
    "glasses",
    "glassOpacity",
    "accessories",
    "tattoos",
    "backgroundColor",
  ];

  return requiredFields.every((field) => typeof avatar[field] === "string");
};

/**
 * Función para asegurar que un avatar tenga la estructura correcta
 */
export const ensureValidAvatarConfig = (
  avatar: Partial<AvatarConfig> | null | undefined
): AvatarConfig => {
  if (!avatar) {
    return { ...defaultAvatarConfig };
  }

  return {
    skinColor: avatar.skinColor || defaultAvatarConfig.skinColor,
    eyes: avatar.eyes || defaultAvatarConfig.eyes,
    eyebrows: avatar.eyebrows || defaultAvatarConfig.eyebrows,
    mouth: avatar.mouth || defaultAvatarConfig.mouth,
    hairStyle: avatar.hairStyle || defaultAvatarConfig.hairStyle,
    hairColor: avatar.hairColor || defaultAvatarConfig.hairColor,
    facialHair: avatar.facialHair || defaultAvatarConfig.facialHair,
    clothes: avatar.clothes || defaultAvatarConfig.clothes,
    fabricColor: avatar.fabricColor || defaultAvatarConfig.fabricColor,
    glasses: avatar.glasses || defaultAvatarConfig.glasses,
    glassOpacity: avatar.glassOpacity || defaultAvatarConfig.glassOpacity,
    accessories: avatar.accessories || defaultAvatarConfig.accessories,
    accessoryColor: avatar.accessoryColor || defaultAvatarConfig.accessoryColor,
    tattoos: avatar.tattoos || defaultAvatarConfig.tattoos,
    tattooColor: avatar.tattooColor || defaultAvatarConfig.tattooColor,
    backgroundColor:
      avatar.backgroundColor || defaultAvatarConfig.backgroundColor,
  };
};

/**
 * Función para verificar si un avatar tiene contenido real
 */
export const hasAvatarContent = (
  avatar: AvatarConfig | null | undefined
): boolean => {
  if (!avatar) return false;

  return !!(
    (avatar.skinColor && avatar.skinColor.trim() !== "") ||
    (avatar.eyes && avatar.eyes.trim() !== "") ||
    (avatar.hairStyle && avatar.hairStyle.trim() !== "") ||
    (avatar.clothes && avatar.clothes.trim() !== "")
  );
};

/**
 * Función para obtener un avatar aleatorio con todas las opciones disponibles
 */
export const getRandomAvatarConfig = (): AvatarConfig => {
  const getRandomOption = <T>(options: T[]): T =>
    options[Math.floor(Math.random() * options.length)];

  return {
    skinColor: getRandomOption(AVATAR_OPTIONS.skinColors).value,
    eyes: getRandomOption(AVATAR_OPTIONS.eyes).value,
    eyebrows: getRandomOption(AVATAR_OPTIONS.eyebrows).value,
    mouth: getRandomOption(AVATAR_OPTIONS.mouths).value,
    hairStyle: getRandomOption(AVATAR_OPTIONS.hairStyles).value,
    hairColor: getRandomOption(AVATAR_OPTIONS.hairColors).value,
    facialHair: getRandomOption(AVATAR_OPTIONS.facialHair).value,
    clothes: getRandomOption(AVATAR_OPTIONS.clothes).value,
    fabricColor: getRandomOption(AVATAR_OPTIONS.fabricColors).value,
    glasses: getRandomOption(AVATAR_OPTIONS.glasses).value,
    glassOpacity: getRandomOption(AVATAR_OPTIONS.glassOpacities).value,
    accessories: getRandomOption(AVATAR_OPTIONS.accessories).value,
    accessoryColor: "#FFD700",
    tattoos: getRandomOption(AVATAR_OPTIONS.tattoos).value,
    tattooColor: "#000000",
    backgroundColor: getRandomOption(AVATAR_OPTIONS.backgroundColors).value,
  };
};
