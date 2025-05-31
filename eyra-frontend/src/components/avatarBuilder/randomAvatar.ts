// components/avatarBuilder/randomAvatar.ts - ACTUALIZADO con todas las opciones

import { AvatarConfig, AVATAR_OPTIONS } from "../../types/avatar";

/**
 * Función para obtener un elemento aleatorio de un array
 */
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Función para generar un valor RGB aleatorio en formato hex
 */
const getRandomHex = (): string => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

/**
 * Genera una configuración de avatar completamente aleatoria
 * Utiliza todas las opciones disponibles del código de referencia
 */
export const getRandomAvatarConfig = (): AvatarConfig => {
  return {
    // Color de piel aleatorio de las opciones predefinidas
    skinColor: getRandomElement(AVATAR_OPTIONS.skinColors).value,

    // Ojos aleatorios
    eyes: getRandomElement(AVATAR_OPTIONS.eyes).value,

    // Cejas aleatorias
    eyebrows: getRandomElement(AVATAR_OPTIONS.eyebrows).value,

    // Boca aleatoria
    mouth: getRandomElement(AVATAR_OPTIONS.mouths).value,

    // Estilo de cabello aleatorio
    hairStyle: getRandomElement(AVATAR_OPTIONS.hairStyles).value,

    // Color de cabello aleatorio
    hairColor: getRandomElement(AVATAR_OPTIONS.hairColors).value,

    // Vello facial aleatorio
    facialHair: getRandomElement(AVATAR_OPTIONS.facialHair).value,

    // Ropa aleatoria
    clothes: getRandomElement(AVATAR_OPTIONS.clothes).value,

    // Color de tela aleatorio
    fabricColor: getRandomElement(AVATAR_OPTIONS.fabricColors).value,

    // Gafas aleatorias
    glasses: getRandomElement(AVATAR_OPTIONS.glasses).value,

    // Opacidad de cristales aleatoria
    glassOpacity: getRandomElement(AVATAR_OPTIONS.glassOpacities).value,

    // Accesorios aleatorios
    accessories: getRandomElement(AVATAR_OPTIONS.accessories).value,

    // Color de accesorios aleatorio
    accessoryColor: getRandomHex(),

    // Tatuajes aleatorios
    tattoos: getRandomElement(AVATAR_OPTIONS.tattoos).value,

    // Color de tatuajes aleatorio
    tattooColor: getRandomHex(),

    // Color de fondo aleatorio
    backgroundColor: getRandomElement(AVATAR_OPTIONS.backgroundColors).value,
  };
};

/**
 * Genera una configuración de avatar aleatoria con preferencias
 * Permite especificar qué elementos deben ser aleatorios y cuáles mantener
 */
export const getRandomAvatarConfigWithPreferences = (
  preferences: Partial<AvatarConfig> = {}
): AvatarConfig => {
  const randomConfig = getRandomAvatarConfig();

  // Combinar configuración aleatoria con preferencias especificadas
  return {
    ...randomConfig,
    ...preferences,
  };
};

/**
 * Genera una configuración de avatar aleatoria con estilo específico
 */
export const getRandomAvatarByStyle = (
  style: "casual" | "formal" | "punk" | "classic"
): AvatarConfig => {
  const baseConfig = getRandomAvatarConfig();

  switch (style) {
    case "casual":
      return {
        ...baseConfig,
        clothes: getRandomElement(
          ["hoodie", "vneck"].map((value) => ({ value }))
        ).value,
        glasses:
          Math.random() > 0.7
            ? getRandomElement(
                AVATAR_OPTIONS.glasses.filter((g) => g.value !== "none")
              ).value
            : "none",
        tattoos:
          Math.random() > 0.8
            ? getRandomElement(
                AVATAR_OPTIONS.tattoos.filter((t) => t.value !== "none")
              ).value
            : "none",
        accessories:
          Math.random() > 0.6
            ? getRandomElement(
                AVATAR_OPTIONS.accessories.filter((a) => a.value !== "none")
              ).value
            : "none",
      };

    case "formal":
      return {
        ...baseConfig,
        clothes: getRandomElement(
          ["blazer", "sweater"].map((value) => ({ value }))
        ).value,
        fabricColor: getRandomElement(
          ["#545454", "#25557c", "#929598"].map((value) => ({ value }))
        ).value,
        glasses:
          Math.random() > 0.5
            ? getRandomElement(
                ["old", "nerd", "harry"].map((value) => ({ value }))
              ).value
            : "none",
        tattoos: "none",
        facialHair:
          Math.random() > 0.7
            ? getRandomElement(
                AVATAR_OPTIONS.facialHair.filter((f) => f.value !== "none")
              ).value
            : "none",
      };

    case "punk":
      return {
        ...baseConfig,
        hairColor: getRandomElement(
          [
            "#f8afaf_#f48a8a_#ed5e5e",
            "#59a0ff_#3777ff_#194bff",
            "#d75324_#c13215_#a31608",
          ].map((value) => ({ value }))
        ).value,
        clothes: getRandomElement(
          ["hoodie", "vneck"].map((value) => ({ value }))
        ).value,
        fabricColor: getRandomElement(
          ["#ff5c5c", "#545454", "#5199e4"].map((value) => ({ value }))
        ).value,
        tattoos: getRandomElement(
          AVATAR_OPTIONS.tattoos.filter((t) => t.value !== "none")
        ).value,
        accessories: getRandomElement(
          AVATAR_OPTIONS.accessories.filter((a) => a.value !== "none")
        ).value,
        glasses: Math.random() > 0.6 ? "rambo" : "none",
      };

    case "classic":
      return {
        ...baseConfig,
        hairColor: getRandomElement(
          [
            "#bb7748_#9a4f2b_#6f2912",
            "#404040_#262626_#101010",
            "#c79d63_#ab733e_#844713",
          ].map((value) => ({ value }))
        ).value,
        clothes: getRandomElement(
          ["sweater", "blazer"].map((value) => ({ value }))
        ).value,
        fabricColor: getRandomElement(
          ["#545454", "#e6e6e6", "#929598"].map((value) => ({ value }))
        ).value,
        glasses:
          Math.random() > 0.3
            ? getRandomElement(["old", "nerd"].map((value) => ({ value })))
                .value
            : "none",
        tattoos: "none",
        accessories:
          Math.random() > 0.8
            ? getRandomElement(
                AVATAR_OPTIONS.accessories.filter((a) => a.value !== "none")
              ).value
            : "none",
      };

    default:
      return baseConfig;
  }
};

/**
 * Genera múltiples configuraciones aleatorias para previsualización
 */
export const getMultipleRandomAvatars = (count: number = 5): AvatarConfig[] => {
  const avatars: AvatarConfig[] = [];

  for (let i = 0; i < count; i++) {
    avatars.push(getRandomAvatarConfig());
  }

  return avatars;
};

/**
 * Mutación ligera de un avatar existente
 * Cambia solo algunos elementos manteniendo la mayoría
 */
export const getMutatedAvatar = (
  baseConfig: AvatarConfig,
  mutationRate: number = 0.3
): AvatarConfig => {
  const newConfig = { ...baseConfig };
  const configKeys = Object.keys(newConfig) as Array<keyof AvatarConfig>;

  configKeys.forEach((key) => {
    if (Math.random() < mutationRate) {
      switch (key) {
        case "skinColor":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.skinColors).value;
          break;
        case "eyes":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.eyes).value;
          break;
        case "eyebrows":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.eyebrows).value;
          break;
        case "mouth":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.mouths).value;
          break;
        case "hairStyle":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.hairStyles).value;
          break;
        case "hairColor":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.hairColors).value;
          break;
        case "facialHair":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.facialHair).value;
          break;
        case "clothes":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.clothes).value;
          break;
        case "fabricColor":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.fabricColors).value;
          break;
        case "glasses":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.glasses).value;
          break;
        case "glassOpacity":
          newConfig[key] = getRandomElement(
            AVATAR_OPTIONS.glassOpacities
          ).value;
          break;
        case "accessories":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.accessories).value;
          break;
        case "tattoos":
          newConfig[key] = getRandomElement(AVATAR_OPTIONS.tattoos).value;
          break;
        case "backgroundColor":
          newConfig[key] = getRandomElement(
            AVATAR_OPTIONS.backgroundColors
          ).value;
          break;
      }
    }
  });

  return newConfig;
};

/**
 * Genera un avatar aleatorio basado en género (para mayor diversidad)
 */
export const getRandomAvatarByGender = (
  gender?: "masculine" | "feminine" | "neutral"
): AvatarConfig => {
  const baseConfig = getRandomAvatarConfig();

  if (!gender) return baseConfig;

  switch (gender) {
    case "masculine":
      return {
        ...baseConfig,
        hairStyle: getRandomElement(
          [
            "shorthaircurly",
            "shorthairflat",
            "shorthairround",
            "shorthairwaved",
            "shorthairsides",
            "nottoolong",
          ].map((value) => ({ value }))
        ).value,
        facialHair:
          Math.random() > 0.4
            ? getRandomElement(
                AVATAR_OPTIONS.facialHair.filter((f) => f.value !== "none")
              ).value
            : "none",
        clothes: getRandomElement(
          ["vneck", "hoodie", "blazer"].map((value) => ({ value }))
        ).value,
      };

    case "feminine":
      return {
        ...baseConfig,
        hairStyle: getRandomElement(
          [
            "longhair",
            "longhairbob",
            "hairbun",
            "longhaircurly",
            "longhaircurvy",
            "longhairstraight",
            "miawallace",
          ].map((value) => ({ value }))
        ).value,
        facialHair: "none",
        accessories:
          Math.random() > 0.3
            ? getRandomElement(
                AVATAR_OPTIONS.accessories.filter((a) => a.value !== "none")
              ).value
            : "none",
      };

    case "neutral":
      return {
        ...baseConfig,
        facialHair:
          Math.random() > 0.8
            ? getRandomElement(
                AVATAR_OPTIONS.facialHair.filter((f) => f.value !== "none")
              ).value
            : "none",
      };

    default:
      return baseConfig;
  }
};
