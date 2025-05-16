import React from "react";

const NavBar = () => {
  return (
    <header className="p-4">
      <div className="flex justify-center items-center">
        <div className="flex items-center">
          <img className="w-10" src="./security.png" alt="" />
          <h1 className="text-2xl font-bold text-center py-5">Mahfooz</h1>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
