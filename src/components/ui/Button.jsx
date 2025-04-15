import React from "react";

const Button = ({ className, name, variant, size }) => {
  return (
    <div>
      <button variant={variant} size={size} className={className}>
        {name}
      </button>
    </div>
  );
};

export default Button;
