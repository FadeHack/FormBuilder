import React from 'react';
import ThemeToggler from './ThemeToggler';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-2xl font-bold">Form Builder</span>
        <ThemeToggler />
      </div>
    </nav>
  );
};

export default Navbar;
