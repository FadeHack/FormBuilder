// JsonEditor.js
import React, { useState } from 'react';
import FormPreview from './FormPreview';

const defaultSchema = {
  type: 'array',
  items: [],
};

const JsonEditor = () => {
  const [formData, setFormData] = useState({});
  const [uiSchema, setUiSchema] = useState(defaultSchema);
  const [hasError, setHasError] = useState(false);

  const handleJsonChange = (json) => {
    try {
      const parsedJson = JSON.parse(json);

      // Update defaultSchema to handle array type UI-Schema
      const schema = {
        type: 'array',
        items: Array.isArray(parsedJson) ? parsedJson : [parsedJson],
      };

      setUiSchema(schema);
      setHasError(false);
    } catch (error) {
      console.error('Invalid JSON');
      setHasError(true);
      // Handle error, e.g., display an error message to the user
    }
  };

  return (
<div className="w-screen h-90v flex p-4 flex-col sm:flex-row">
  <textarea
    spellCheck="false"
    className={`w-full sm:w-1/2 h-full sm:h-full p-2 border border-gray-300 rounded m-2 ${hasError && 'border-red-500'} bg-slate-600 text-white font-mono`}
    placeholder="Paste UI Schema here"
    onChange={(e) => handleJsonChange(e.target.value)}
  ></textarea>
  {hasError && <p className="text-red-500">Invalid JSON</p>}
  {uiSchema && (
    <FormPreview
      uiSchema={uiSchema}
      formData={formData}
      setFormData={setFormData}
      className="w-full sm:w-1/2 h-full" // Adjusted height and added overflow-y-auto
    />
  )}
</div>


  );
};

export default JsonEditor;
