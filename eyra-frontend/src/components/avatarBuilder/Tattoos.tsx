import React from "react";

const Tattoos: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "star":
      return (
        <polygon
          points="160,220 163,228 171,228 165,232 167,240 160,235 153,240 155,232 149,228 157,228"
          fill="#FFD700"
        />
      );
    case "heart":
      return (
        <path
          d="M160 225 Q165 220 170 225 Q170 230 160 240 Q150 230 150 225 Q155 220 160 225"
          fill="#E57373"
        />
      );
    case "none":
    default:
      return null;
  }
};

export default Tattoos;
