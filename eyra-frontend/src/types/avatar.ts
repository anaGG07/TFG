/**
 * INTERFACE CENTRALIZADA DE AVATAR
 * 
 * Esta interface está 100% sincronizada con el backend PHP (User.php líneas 261-282)
 * ⚠️ IMPORTANTE: Todos los campos deben ser strings para coincidir con la estructura JSON del backend
 * 
 * Ubicación backend: eyra-backend/src/Entity/User.php
 * Método: setAvatar(array $avatar)
 */

export interface AvatarConfig {
  // Campos en el mismo orden que el backend
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
  tattoos: string;
  backgroundColor: string;
}

/**
 * Configuración por defecto del avatar
 * Valores seguros que siempre funcionarán
 */
export const defaultAvatarConfig: AvatarConfig = {
  skinColor: '#F5D0A9',
  eyes: 'default',
  eyebrows: 'default',
  mouth: 'default',
  hairStyle: 'short',
  hairColor: '#4A4A4A',
  facialHair: 'none',
  clothes: 'tshirt',
  fabricColor: '#C62328',
  glasses: 'none',
  glassOpacity: '0.8',
  accessories: 'none',
  tattoos: 'none',
  backgroundColor: '#E7E0D5'
};

/**
 * Función para crear un avatar vacío/predeterminado
 * Coincide exactamente con el backend PHP User.php setAvatar() cuando avatar es null
 */
export const createEmptyAvatarConfig = (): AvatarConfig => ({
  skinColor: "",
  eyes: "",
  eyebrows: "",
  mouth: "",
  hairStyle: "",
  hairColor: "",
  facialHair: "",
  clothes: "",
  fabricColor: "",
  glasses: "",
  glassOpacity: "",
  accessories: "",
  tattoos: "",
  backgroundColor: ""
});

/**
 * Validador de configuración de avatar
 * Verifica que todos los campos requeridos estén presentes
 */
export const isValidAvatarConfig = (avatar: any): avatar is AvatarConfig => {
  if (!avatar || typeof avatar !== 'object') return false;
  
  const requiredFields: (keyof AvatarConfig)[] = [
    'skinColor', 'eyes', 'eyebrows', 'mouth', 'hairStyle', 
    'hairColor', 'facialHair', 'clothes', 'fabricColor', 
    'glasses', 'glassOpacity', 'accessories', 'tattoos', 'backgroundColor'
  ];
  
  return requiredFields.every(field => 
    typeof avatar[field] === 'string'
  );
};

/**
 * Función para asegurar que un avatar tenga la estructura correcta
 * Si el avatar está incompleto, rellena con valores por defecto
 */
export const ensureValidAvatarConfig = (avatar: Partial<AvatarConfig> | null | undefined): AvatarConfig => {
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
    tattoos: avatar.tattoos || defaultAvatarConfig.tattoos,
    backgroundColor: avatar.backgroundColor || defaultAvatarConfig.backgroundColor
  };
};
