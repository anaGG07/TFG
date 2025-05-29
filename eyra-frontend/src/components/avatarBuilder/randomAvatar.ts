import { AvatarConfig } from '../../types/avatar';

/**
 * Genera una configuración aleatoria de avatar
 *
 */
export function getRandomAvatarConfig(): AvatarConfig {
  const skinColors = ['#FCD7B6', '#E0A96D', '#8D5524'];
  const eyes = ['happy', 'normal', 'sleepy'];
  const eyebrows = ['up', 'down', 'angry'];
  const mouths = ['smile', 'open', 'sad'];
  const hairStyles = ['short', 'long', 'curly'];
  const hairColors = ['#7a2323', '#222', '#FFD700', '#E0A96D'];
  const facialHairs = ['none', 'mustache', 'beard'];
  const clothes = ['tshirt', 'hoodie', 'dress'];
  const fabricColors = ['#E0A96D', '#7a2323', '#FFD700', '#fffbe6'];
  const glasses = ['none', 'round', 'square'];
  const accessories = ['none', 'earring', 'necklace'];
  const tattoos = ['none', 'star', 'heart'];
  const backgrounds = ['#fffbe6', '#e0e0e0', '#c6e2ff', '#ffe4e1'];
  
  const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  
  return {
    skinColor: rand(skinColors),
    eyes: rand(eyes),
    eyebrows: rand(eyebrows),
    mouth: rand(mouths),
    hairStyle: rand(hairStyles),
    hairColor: rand(hairColors),
    facialHair: rand(facialHairs),
    clothes: rand(clothes),
    fabricColor: rand(fabricColors),
    glasses: rand(glasses),
    glassOpacity: (Math.round((Math.random() * 0.7 + 0.3) * 100) / 100).toString(), // ✅ CORREGIDO: Convertido a string
    accessories: rand(accessories),
    tattoos: rand(tattoos),
    backgroundColor: rand(backgrounds),
  };
}
