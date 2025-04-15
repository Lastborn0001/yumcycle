import React from "react";

const Button = ({ className, name }) => {
  return (
    <div>
      <button className={className}>{name}</button>
    </div>
  );
};

export default Button;
