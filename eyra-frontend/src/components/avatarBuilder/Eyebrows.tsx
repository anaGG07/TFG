import React from "react";

const Eyebrows: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "up":
      return (
        <>
          <path
            d="M125 160 Q135 150 145 160"
            stroke="#222"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M175 160 Q185 150 195 160"
            stroke="#222"
            strokeWidth="4"
            fill="none"
          />
        </>
      );
    case "down":
      return (
        <>
          <path
            d="M125 155 Q135 165 145 155"
            stroke="#222"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M175 155 Q185 165 195 155"
            stroke="#222"
            strokeWidth="4"
            fill="none"
          />
        </>
      );
    case "angry":
      return (
        <>
          <path
            d="M125 160 Q135 155 145 165"
            stroke="#222"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M175 165 Q185 155 195 160"
            stroke="#222"
            strokeWidth="4"
            fill="none"
          />
        </>
      );
    case "default":
    default:
      return (
        <>
          <path
            d="M125 158 Q135 152 145 158"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M175 158 Q185 152 195 158"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
  }
};

export default Eyebrows;
