import React from "react";

interface EyebrowsProps {
  type: string;
  color?: string;
}

const Eyebrows: React.FC<EyebrowsProps> = ({ type, color = "#000000" }) => {
  switch (type) {
    case "default":
      return (
        <g id="eb_default">
          {/* Subidas 8 pixeles (138 → 130) */}
          <path
            fill={color}
            fillOpacity="0.7"
            fillRule="nonzero"
            d="M128 130c-1,1 -3,1 -4,0 -1,-1 -1,-2 0,-3 5,-6 10,-9 16,-11 6,-2 13,-2 20,0 2,0 3,2 2,3 0,2 -1,3 -3,2 -6,-1 -12,-2 -17,0 -5,1 -10,4 -14,9z"
          />
          <path
            fill={color}
            fillOpacity="0.7"
            fillRule="nonzero"
            d="M232 130c1,1 2,1 3,0 2,-1 2,-2 1,-3 -5,-6 -11,-9 -17,-11 -6,-2 -13,-2 -20,0 -1,0 -2,2 -2,3 1,2 2,3 3,2 7,-1 13,-2 18,0 5,1 10,4 14,9z"
          />
        </g>
      );

    case "default2":
      return (
        <g id="eb_default2">
          {/* Subidas 8 pixeles (136 → 128) */}
          <path
            fill={color}
            fillOpacity="0.7"
            d="M124 128c5,-4 11,-5 18,-6 5,-1 12,-1 20,1 -5,-6 -14,-10 -22,-7 -7,1 -13,5 -16,12z"
          />
          <path
            fill={color}
            fillOpacity="0.7"
            d="M237 128c-5,-4 -12,-5 -18,-6 -5,-1 -12,-1 -20,1 5,-6 14,-10 22,-7 7,1 13,5 16,12z"
          />
        </g>
      );

    case "raised":
      return (
        <g id="eb_raised">
          {/* Subidas 8 pixeles (136 → 128) */}
          <path
            fill={color}
            fillOpacity="0.7"
            d="M126 128c5,-4 8,-10 14,-13 7,-3 12,-5 23,-5 -10,-3 -20,-4 -27,0 -6,4 -9,11 -10,18z"
          />
          <path
            fill={color}
            fillOpacity="0.7"
            d="M235 128c-5,-4 -8,-10 -14,-13 -8,-3 -12,-5 -23,-5 10,-3 20,-4 26,0 6,4 10,11 11,18z"
          />
        </g>
      );

    case "sad":
      return (
        <g id="eb_sad">
          {/* Subidas 8 pixeles (139 → 131) */}
          <path
            fill={color}
            fillOpacity="0.7"
            fillRule="nonzero"
            d="M125 131c-2,-1 -2,-2 -2,-4 1,-1 3,-2 4,-1 0,0 1,0 1,1 6,2 12,2 17,0 5,-2 9,-6 12,-13 0,0 0,-1 1,-1 0,-2 2,-2 3,-2 2,1 2,2 2,4 -1,0 -1,1 -1,2 -4,7 -9,12 -15,15 -6,3 -14,3 -21,0 0,-1 -1,-1 -1,-1z"
          />
          <path
            fill={color}
            fillOpacity="0.7"
            fillRule="nonzero"
            d="M234 131c2,-1 2,-2 1,-4 0,-1 -2,-2 -3,-1 -1,0 -1,0 -1,1 -6,2 -12,2 -17,0 -5,-2 -9,-6 -12,-13 0,0 -1,-1 -1,-1 -1,-2 -2,-2 -3,-2 -2,1 -2,2 -2,4 0,0 1,1 1,2 4,7 9,12 15,15 6,3 13,3 21,0 0,-1 1,-1 1,-1z"
          />
        </g>
      );

    case "sad2":
      return (
        <g id="eb_sad2">
          {/* Subidas 8 pixeles (139 → 131) */}
          <path
            fill={color}
            fillOpacity="0.7"
            d="M125 131c7,0 18,-1 22,-4 5,-4 11,-9 15,-15 0,5 -4,15 -10,19 -7,4 -20,4 -27,0z"
          />
          <path
            fill={color}
            fillOpacity="0.7"
            d="M235 131c-8,0 -18,-1 -23,-4 -5,-4 -10,-9 -14,-15 0,5 3,15 10,19 7,4 19,4 27,0z"
          />
        </g>
      );

    case "unibrow":
      return (
        <g id="eb_unibrow">
          <path
            fill={color}
            fillOpacity="0.7"
            d="M120 136c3,-5 10,-11 17,-12 7,-1 14,3 20,4 7,1 13,3 20,4 -7,4 -12,4 -18,4 -7,0 -15,-4 -22,-4 -6,0 -11,2 -17,4z"
          />
          <path
            fill={color}
            fillOpacity="0.7"
            d="M240 136c-3,-5 -10,-11 -17,-12 -7,-1 -14,3 -20,4 -7,1 -13,3 -20,4 7,4 12,4 18,4 7,0 15,-4 22,-4 6,0 11,2 17,4z"
          />
        </g>
      );

    case "updown":
      return (
        <g id="eb_updown">
          {/* Subidas 8 pixeles (134/139 → 126/131) */}
          <path
            fill={color}
            fillOpacity="0.7"
            fillRule="nonzero"
            d="M128 126c-1,1 -2,1 -4,0 -1,-1 -1,-3 0,-4 7,-7 13,-10 20,-12 6,-1 12,0 18,3 2,1 2,2 2,4 -1,1 -3,2 -4,1 -5,-3 -10,-4 -15,-2 -6,1 -11,4 -17,10z"
          />
          <path
            fill={color}
            fillOpacity="0.7"
            fillRule="nonzero"
            d="M237 131c1,1 0,3 -1,4 -1,1 -2,1 -3,0 -5,-5 -10,-8 -16,-9 -6,-2 -12,-2 -16,0 -2,1 -3,0 -4,-1 0,-1 0,-3 2,-4 5,-2 13,-2 20,-1 6,2 12,6 18,11z"
          />
        </g>
      );

    case "updown2":
      return (
        <g id="eb_updown2">
          {/* Subidas 8 pixeles (136/145 → 128/137) */}
          <path
            fill={color}
            fillOpacity="0.7"
            d="M126 128c5,-4 8,-10 14,-13 7,-3 12,-5 23,-5 -10,-3 -20,-4 -27,0 -6,4 -9,11 -10,18z"
          />
          <path
            fill={color}
            fillOpacity="0.7"
            d="M237 137c-6,-3 -11,-7 -18,-8 -8,-1 -13,-2 -23,2 8,-6 17,-10 25,-8 7,2 12,7 16,14z"
          />
        </g>
      );

    case "angry":
      return (
        <g id="eb_angry">
          <path
            fill={color}
            fillOpacity="0.7"
            fillRule="nonzero"
            d="M127 136c-2,1 -3,1 -4,-1 -1,-1 -1,-3 1,-3 1,-1 2,-2 3,-3 3,-3 6,-5 10,-5 3,-1 5,0 8,2 2,1 4,3 6,5 2,1 3,3 5,3 1,1 3,1 5,1 1,0 3,0 3,2 0,1 -1,3 -2,3 -3,1 -6,0 -8,-1 -3,-1 -5,-2 -7,-4 -1,-2 -3,-3 -5,-5 -1,-1 -3,-1 -5,-1 -2,0 -4,2 -6,4 -2,1 -3,2 -4,3z"
          />
          <path
            fill={color}
            fillOpacity="0.7"
            fillRule="nonzero"
            d="M233 136c1,1 3,1 4,-1 1,-1 0,-3 -1,-3 -1,-1 -2,-2 -3,-3 -3,-3 -6,-5 -10,-5 -3,-1 -6,0 -8,2 -2,1 -5,3 -6,5 -2,1 -3,3 -5,3 -2,1 -3,1 -5,1 -1,0 -3,0 -3,2 0,1 0,3 2,3 3,1 5,0 8,-1 2,-1 4,-2 6,-4 2,-2 4,-3 6,-5 1,-1 3,-1 5,-1 2,0 4,2 6,4 1,1 3,2 4,3z"
          />
        </g>
      );

    case "angry2":
      return (
        <g id="eb_angry2">
          <path
            fill={color}
            fillOpacity="0.7"
            d="M125 129c1,-4 5,-8 10,-7 5,1 9,3 13,6 5,3 12,8 17,9 -5,3 -10,2 -13,0 -5,-2 -10,-7 -16,-9 -3,-1 -7,0 -11,1z"
          />
          <path
            fill={color}
            fillOpacity="0.7"
            d="M235 129c-1,-4 -5,-8 -10,-7 -5,1 -9,3 -13,6 -5,3 -12,8 -17,9 5,3 9,2 13,0 5,-2 10,-7 15,-9 4,-1 8,0 12,1z"
          />
        </g>
      );

    default:
      return null;
  }
};

export default Eyebrows;
