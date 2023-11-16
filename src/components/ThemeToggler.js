import React, { useState } from 'react';

const ThemeToggler = () => {
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
    // Toggle dark mode classes on the body or root element
    document.body.classList.toggle('dark', isDarkMode);
  };

  return (
    <div className="flex items-center">
      <span className="mr-2">Dark Mode</span>
      <label className="switch">
        <input type="checkbox" onChange={toggleTheme} checked={isDarkMode} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ThemeToggler;
