import React from "react";

interface GlassesProps {
  type: string;
  opacity: string;
}

const Glasses: React.FC<GlassesProps> = ({ type, opacity }) => {
  if (type === "none") return null;

  switch (type) {
    case "rambo":
      return (
        <g id="g_rambo">
          <path
            fill="#2B2A29"
            fillRule="nonzero"
            d="M106 151c-1,0 -1,-1 -1,-2 0,-1 0,-1 1,-1l4 0c1,-6 3,-11 7,-15 4,-4 11,-6 21,-6 8,0 16,1 22,3l40 0c6,-2 14,-3 22,-3 10,0 17,2 21,6 4,4 6,9 7,15l4 0c1,0 1,0 1,1 0,1 0,2 -1,2l-4 0c0,7 -3,14 -8,19 -4,5 -10,8 -19,8 -8,0 -17,-5 -23,-12 -5,-4 -9,-10 -11,-15 0,0 0,0 0,0 -1,0 -1,0 -1,-1 -1,-3 -2,-5 -3,-7 -2,-1 -3,-2 -5,-2 -2,0 -3,1 -5,2 -1,2 -2,4 -3,7 0,1 0,1 -1,1 0,0 0,0 0,0 -2,5 -6,11 -11,15 -6,7 -15,12 -23,12 -9,0 -15,-3 -19,-8 -5,-5 -8,-12 -8,-19l-4 0zm61 -19c4,3 6,6 6,10 0,0 0,0 0,0 0,0 0,0 0,-1 2,-2 4,-3 7,-3 3,0 5,1 7,3 0,1 0,1 0,1 0,0 0,0 0,0 0,-4 2,-7 6,-10l-26 0zm55 -2c-9,0 -18,1 -24,3 -5,2 -8,5 -8,9 0,7 5,15 11,22 7,6 15,11 22,11 8,0 13,-3 17,-7 5,-4 7,-11 7,-18 0,-6 -2,-11 -6,-15 -4,-3 -10,-5 -19,-5zm-60 3c-6,-2 -15,-3 -24,-3 -9,0 -15,2 -19,5 -4,4 -6,9 -6,15 0,7 2,14 7,18 4,4 9,7 17,7 7,0 15,-5 22,-11 6,-7 11,-15 11,-22 0,-4 -3,-7 -8,-9z"
          />
          <path
            className="glass"
            fillOpacity={opacity}
            fill="#5B5B5B"
            d="M222 130c-9,0 -18,1 -24,3 -5,2 -8,5 -8,9 0,7 5,15 11,22 7,6 15,11 22,11 8,0 13,-3 17,-7 5,-4 7,-11 7,-18 0,-6 -2,-11 -6,-15 -4,-3 -10,-5 -19,-5zm-60 3c-6,-2 -15,-3 -24,-3 -9,0 -15,2 -19,5 -4,4 -6,9 -6,15 0,7 2,14 7,18 4,4 9,7 17,7 7,0 15,-5 22,-11 6,-7 11,-15 11,-22 0,-4 -3,-7 -8,-9z"
          />
        </g>
      );

    case "fancy":
      return (
        <g id="g_fancy">
          <path
            fill="#E31E24"
            d="M180 145c5,0 13,-1 18,-3l0 0c8,-5 26,-11 34,-13 6,-1 21,-6 25,-1 0,1 1,2 1,3 3,8 -9,25 -12,31 -5,8 -13,13 -21,16 -8,2 -17,1 -24,-2 -6,-2 -12,-7 -14,-13l0 0c-1,-5 -5,-8 -7,-8l0 -10zm31 -5c-14,6 -20,8 -20,19 0,11 17,19 32,15 16,-5 25,-21 21,-32 -2,-8 -17,-7 -33,-2z"
          />
          <path
            fill="#E31E24"
            d="M180 145c-5,0 -13,-1 -18,-3l0 0c-8,-5 -26,-11 -34,-13 -6,-1 -21,-6 -25,-1 0,1 -1,2 -1,3 -3,8 9,25 12,31 5,8 13,13 21,16 8,2 17,1 24,-2 6,-2 12,-7 14,-13l0 0c1,-5 5,-8 7,-8l0 -6 0 -4zm-31 -5c14,6 20,8 20,19 0,11 -17,19 -32,15 -16,-5 -25,-21 -21,-32 2,-8 17,-7 33,-2z"
          />
          <path
            className="glass"
            fillOpacity={opacity}
            fill="#5B5B5B"
            d="M149 140c14,6 20,8 20,19 0,11 -17,19 -32,15 -16,-5 -25,-21 -21,-32 2,-8 17,-7 33,-2zm62 0c-14,6 -20,8 -20,19 0,11 17,19 32,15 16,-5 25,-21 21,-32 -2,-8 -17,-7 -33,-2z"
          />
        </g>
      );

    case "old":
      return (
        <g id="g_old">
          <path
            fill="#4D897C"
            d="M180 139l-6 0c-1,0 -2,-1 -2,-2 0,0 0,0 0,0l0 0c0,0 0,0 0,0 -3,-10 -12,-16 -31,-16l-27 0c-16,0 -17,7 -17,17l0 24c0,7 7,15 13,18 4,2 8,4 12,4l20 0c8,0 15,-4 20,-9 3,-4 6,-9 7,-14l1 0c0,0 0,-1 0,-1 0,-1 0,-1 0,-1 2,-8 6,-13 10,-13l0 -7zm-61 -12l21 0c18,0 27,8 27,18l0 6c0,12 -10,29 -26,29l-14 0c-10,0 -21,-11 -21,-18l0 -23c0,-7 6,-12 13,-12z"
          />
          <path
            fill="#4D897C"
            d="M180 139l6 0c1,0 2,-1 2,-2 0,0 0,0 0,0l0 0c0,0 0,0 0,0 3,-10 12,-16 31,-16l27 0c16,0 17,7 17,17l0 24c0,7 -7,15 -13,18 -4,2 -8,4 -12,4l-20 0c-8,0 -15,-4 -20,-9 -3,-4 -6,-9 -7,-14l-1 0c0,0 0,-1 0,-1 0,-1 0,-1 0,-1 -2,-8 -6,-13 -10,-13l0 -7zm61 -12l-21 0c-18,0 -27,8 -27,18l0 6c0,12 10,29 26,29l14 0c10,0 21,-11 21,-18l0 -23c0,-7 -6,-12 -13,-12z"
          />
          <path
            className="glass"
            fillOpacity={opacity}
            fill="#5B5B5B"
            d="M241 127l-21 0c-18,0 -27,8 -27,18l0 6c0,12 10,29 26,29l14 0c10,0 21,-11 21,-18l0 -23c0,-7 -6,-12 -13,-12zm-122 0l21 0c18,0 27,8 27,18l0 6c0,12 -10,29 -26,29l-14 0c-10,0 -21,-11 -21,-18l0 -23c0,-7 6,-12 13,-12z"
          />
        </g>
      );

    case "nerd":
      return (
        <g id="g_nerd">
          <path
            fill="#CC6F3C"
            d="M141 121c10,0 19,4 26,12 2,2 5,3 8,3l5 0 0 13c-3,0 -4,0 -5,2 -1,1 -2,5 -4,9 0,1 -1,1 -2,1 -1,6 -4,11 -8,15 -5,5 -12,8 -20,8 -8,0 -15,-3 -20,-8 -6,-6 -9,-13 -9,-21l0 0c-2,0 -5,-2 -5,-5 0,0 0,-1 0,-1l0 0 1 0 0 0c0,-5 -3,-7 -4,-7 -2,0 -3,-1 -3,-3 0,-2 0,-4 0,-6 0,-1 1,-3 3,-3 2,0 4,0 6,0 5,0 14,-5 15,-5 5,-2 10,-4 16,-4zm19 16c-5,-5 -12,-8 -19,-8 -7,0 -14,3 -18,8 -5,4 -8,11 -8,18 0,7 3,14 8,19 4,4 11,7 18,7 7,0 14,-3 19,-7 4,-5 7,-12 7,-19 0,-7 -3,-14 -7,-18z"
          />
          <path
            fill="#CC6F3C"
            d="M219 121c-10,0 -19,4 -26,12 -2,2 -5,3 -8,3l-5 0 0 13c3,0 4,0 5,2 1,1 2,5 4,9 0,1 1,1 2,1 1,6 4,11 8,15 5,5 12,8 20,8 8,0 15,-3 20,-8 6,-6 9,-13 9,-21l0 0c2,0 5,-2 5,-5 0,0 0,-1 0,-1l0 0 -1 0 0 0c0,-5 3,-7 4,-7 2,0 3,-1 3,-3 0,-2 0,-4 0,-6 0,-1 -1,-3 -3,-3 -2,0 -4,0 -6,0 -5,0 -14,-5 -15,-5 -5,-2 -10,-4 -16,-4zm-19 16c5,-5 12,-8 19,-8 7,0 14,3 18,8 5,4 8,11 8,18 0,7 -3,14 -8,19 -4,4 -11,7 -18,7 -7,0 -14,-3 -19,-7 -4,-5 -7,-12 -7,-19 0,-7 3,-14 7,-18z"
          />
          <path
            className="glass"
            fillOpacity={opacity}
            fill="#5B5B5B"
            d="M200 137c5,-5 12,-8 19,-8 7,0 14,3 18,8 5,4 8,11 8,18 0,7 -3,14 -8,19 -4,4 -11,7 -18,7 -7,0 -14,-3 -19,-7 -4,-5 -7,-12 -7,-19 0,-7 3,-14 7,-18zm-40 0c-5,-5 -12,-8 -19,-8 -7,0 -14,3 -18,8 -5,4 -8,11 -8,18 0,7 3,14 8,19 4,4 11,7 18,7 7,0 14,-3 19,-7 4,-5 7,-12 7,-19 0,-7 -3,-14 -7,-18z"
          />
        </g>
      );

    case "fancy2":
      return (
        <g id="g_fancy2">
          <path
            fill="#00A0E3"
            d="M180 145c3,0 10,-5 17,-9 1,-1 2,-1 3,-2 1,-1 1,-1 2,-1 10,-4 27,-4 41,-3 9,0 11,-2 10,16 0,8 -1,16 -7,22 -9,8 -24,8 -35,7 -7,0 -13,-3 -18,-7 -3,-3 -5,-7 -6,-12l0 0c-1,-3 -4,-6 -7,-6l0 -5zm57 -10c-60,-10 -55,34 -26,37 34,2 40,-13 38,-24 -2,-8 -8,-12 -12,-13z"
          />
          <path
            fill="#00A0E3"
            d="M180 145c-3,0 -10,-5 -17,-9 -1,-1 -2,-1 -3,-2 -1,-1 -1,-1 -2,-1 -10,-4 -27,-4 -41,-3 -9,0 -11,-2 -10,16 0,8 1,16 7,22 9,8 24,8 35,7 7,0 13,-3 18,-7 3,-3 5,-7 6,-12l0 0c1,-3 4,-6 7,-6l0 -5zm-57 -10c60,-10 55,34 26,37 -34,2 -40,-13 -38,-24 2,-8 8,-12 12,-13z"
          />
          <path
            className="glass"
            fillOpacity={opacity}
            fill="#5B5B5B"
            d="M123 135c60,-10 55,34 26,37 -34,2 -40,-13 -38,-24 2,-8 8,-12 12,-13zm114 0c-60,-10 -55,34 -26,37 34,2 40,-13 38,-24 -2,-8 -8,-12 -12,-13z"
          />
        </g>
      );

    case "harry":
      return (
        <g id="g_harry">
          <path
            fill="#2B2A29"
            fillRule="nonzero"
            d="M143 125c7,0 14,3 19,8 4,4 6,8 7,13 1,-1 2,-1 3,-2 2,-2 5,-4 8,-4 3,0 6,2 8,4 1,1 2,1 3,2 1,-5 3,-9 7,-13 5,-5 12,-8 19,-8 8,0 15,3 20,8 4,5 7,11 8,18l4 0c1,0 2,1 2,1 0,1 -1,2 -2,2l-4 0c-1,7 -4,13 -8,18 -5,5 -12,8 -20,8 -7,0 -14,-3 -19,-8 -5,-5 -8,-12 -8,-19 -1,-3 -2,-5 -4,-7 -2,-1 -4,-2 -6,-2 -2,0 -4,1 -6,2 -2,2 -3,4 -4,7 0,7 -3,14 -8,19 -5,5 -12,8 -19,8 -8,0 -15,-3 -20,-8 -4,-5 -7,-11 -8,-18l-4 0c-1,0 -2,-1 -2,-2 0,0 1,-1 2,-1l4 0c1,-7 4,-13 8,-18 5,-5 12,-8 20,-8zm91 11c-4,-5 -10,-8 -17,-8 -6,0 -12,3 -17,8 -4,4 -7,10 -7,16 0,7 3,13 7,17 5,5 11,7 17,7 7,0 13,-2 17,-7 5,-4 7,-10 7,-17 0,-6 -2,-12 -7,-16zm-74 0c-5,-5 -11,-8 -17,-8 -7,0 -13,3 -17,8 -5,4 -7,10 -7,16 0,7 2,13 7,17 4,5 10,7 17,7 6,0 12,-2 17,-7 4,-4 7,-10 7,-17 0,-6 -3,-12 -7,-16z"
          />
          <path
            className="glass"
            fillOpacity={opacity}
            fill="#5B5B5B"
            d="M234 136c-4,-5 -10,-8 -17,-8 -6,0 -12,3 -17,8 -4,4 -7,10 -7,16 0,7 3,13 7,17 5,5 11,7 17,7 7,0 13,-2 17,-7 5,-4 7,-10 7,-17 0,-6 -2,-12 -7,-16zm-74 0c-5,-5 -11,-8 -17,-8 -7,0 -13,3 -17,8 -5,4 -7,10 -7,16 0,7 2,13 7,17 4,5 10,7 17,7 6,0 12,-2 17,-7 4,-4 7,-10 7,-17 0,-6 -3,-12 -7,-16z"
          />
        </g>
      );

    default:
      return null;
  }
};

export default Glasses;
