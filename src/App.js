import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FormPreview from './components/FormPreview';
import JsonEditor from './components/JsonEditor';
import ThemeToggler from './components/ThemeToggler';

const App = () => {
  const [uiSchema, setUiSchema] = useState({});

  const handleJsonChange = (json) => {
    setUiSchema(json);
  };

  return (
    <div className="container">
      <Navbar />
      <div className="container mx-auto flex">
        <JsonEditor onJsonChange={handleJsonChange} />
        {/* <FormPreview uiSchema={uiSchema} /> */}
      </div>
    </div>
  );
};

export default App;
