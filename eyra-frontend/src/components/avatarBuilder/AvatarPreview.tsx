import React from 'react';
import { AvatarConfig } from '../../types/avatar';
import Background from './Background';
import Skin from './Skin';
import Hair from './Hair';
import Eyes from './Eyes';
import Eyebrows from './Eyebrows';
import Mouth from './Mouth';
import FacialHair from './FacialHair';
import Clothes from './Clothes';
import Glasses from './Glasses';
import Accessories from './Accessories';
import Tattoos from './Tattoos';

interface AvatarPreviewProps {
  config: AvatarConfig;
  className?: string;
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({ config, className }) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 320" className={className} preserveAspectRatio="xMidYMid slice">
      <Background color={config.backgroundColor} />
      <Skin color={config.skinColor} />
      <Hair style={config.hairStyle} color={config.hairColor} />
      <FacialHair type={config.facialHair} />
      <Clothes type={config.clothes} color={config.fabricColor} />
      <Eyes type={config.eyes} />
      <Eyebrows type={config.eyebrows} />
      <Mouth type={config.mouth} />
      <Glasses type={config.glasses} opacity={config.glassOpacity} />
      <Accessories type={config.accessories} />
      <Tattoos type={config.tattoos} />
    </svg>
  );
};

export default AvatarPreview; 