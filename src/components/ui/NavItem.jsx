import React from "react";

const NavItem = () => {
  return (
    <div>
      <ul className="hidden md:flex justify-around pt-2">
        <li className="m-[0_15px] font-semibold text-[15px] cursor-pointer transition hover:text-orange-500 ">
          Home
        </li>
        <li className="m-[0_15px] font-semibold text-[15px] cursor-pointer transition hover:text-orange-500 ">
          Restaurants
        </li>
        <li className="m-[0_15px] font-semibold text-[15px] cursor-pointer transition hover:text-orange-500 ">
          Food Waste
        </li>
        <li className="m-[0_15px] font-semibold text-[15px] cursor-pointer transition hover:text-orange-500 ">
          My Orders
        </li>
      </ul>
    </div>
  );
};

export default NavItem;
