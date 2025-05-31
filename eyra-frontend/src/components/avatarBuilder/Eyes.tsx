import React from "react";

const Eyes: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "happy":
      return (
        <>
          <ellipse cx="135" cy="170" rx="8" ry="6" fill="#222" />
          <ellipse cx="185" cy="170" rx="8" ry="6" fill="#222" />
        </>
      );
    case "sleepy":
      return (
        <>
          <ellipse cx="135" cy="175" rx="8" ry="3" fill="#222" />
          <ellipse cx="185" cy="175" rx="8" ry="3" fill="#222" />
        </>
      );
    case "normal":
    case "default":
    default:
      return (
        <>
          <ellipse cx="135" cy="170" rx="7" ry="7" fill="#222" />
          <ellipse cx="185" cy="170" rx="7" ry="7" fill="#222" />
        </>
      );
  }
};

export default Eyes;
