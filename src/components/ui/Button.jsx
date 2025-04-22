import React from "react";

const Button = ({ className, name, variant, size, onClick }) => {
  return (
    <div>
      <button
        variant={variant}
        size={size}
        className={className}
        onClick={onClick}
      >
        {name}
      </button>
    </div>
  );
};

export default Button;
