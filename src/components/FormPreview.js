// FormPreview.js
import React, { useState, useEffect } from 'react';

const FormPreview = ({ uiSchema }) => {
  const [formData, setFormData] = useState({});
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const handleFormChange = ({ formData }) => {
    setFormData(formData);
  };

  const renderFormFields = (fields, parentKey = '') => {
    if (!fields) {
      return null;
    }

    return fields.map((field, index) => {
      const key = `${parentKey}_${field.jsonKey || index}`;

      if (field.uiType === 'Group' && field.subParameters) {
        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label>
            {renderFormFields(field.subParameters, key)}
          </div>
        );
      } else if (field.uiType === 'Radio' && field.validate && field.validate.options) {
        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label>
            <div className="flex space-x-4">
              {field.validate.options.map((option) => (
                <div key={option.value}>
                  <input
                    type="radio"
                    id={`${key}_${option.value}`}
                    name={key}
                    value={option.value}
                    checked={formData[key] === option.value}
                    onChange={(e) => handleFormChange({ formData: { ...formData, [key]: e.target.value } })}
                  />
                  <label htmlFor={`${key}_${option.value}`} className="ml-2 text-gray-700 text-sm font-bold">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      } else if (field.uiType === 'Select' && field.validate && field.validate.options) {
        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={key}
              value={formData[key] || ''}
              onChange={(e) => handleFormChange({ formData: { ...formData, [key]: e.target.value } })}
            >
              <option value="" disabled hidden>
                Select {field.label}
              </option>
              {field.validate.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      } else if (field.uiType === 'Switch') {
        return (
          <div key={key} className="mb-4">
            <input
              type="checkbox"
              id={key}
              checked={formData[key] || false}
              onChange={(e) => handleFormChange({ formData: { ...formData, [key]: e.target.checked } })}
            />
            <label htmlFor={key} className="ml-2 text-gray-700 text-sm font-bold">
              {field.label}
            </label>
          </div>
        );
      } else if (field.uiType === 'Input') {
        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id={key}
              value={formData[key] || ''}
              onChange={(e) => handleFormChange({ formData: { ...formData, [key]: e.target.value } })}
            />
          </div>
        );
      } else if (field.uiType === 'Ignore' && field.conditions) {
        const shouldRender = field.conditions.some(condition => {
          const { jsonKey, op, value } = condition;
          return compareValues(formData[jsonKey], op, value);
        });

        if (!shouldRender) {
          return null;
        }
      }
      return null;
    });
  };

  const compareValues = (value, op, target) => {
    switch (op) {
      case '==':
        return value === target;
      // Add other comparison operators as needed
      default:
        return false;
    }
  };

  useEffect(() => {
    // Reset form data when UI schema changes
    setFormData({});
  }, [uiSchema]);

  return (
    <div className="w-1/2 p-4">
      <form>
        {uiSchema &&
          uiSchema.items &&
          uiSchema.items.map((item, index) => (
            <div key={index}>
              {renderFormFields(item.subParameters)}
              {item.uiType === 'Group' && (
                <button
                  type="button"
                  onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                  className="text-blue-500 underline"
                >
                  {showAdvancedFields ? 'Hide' : 'Show'} Advanced Fields
                </button>
              )}
            </div>
          ))}
      </form>
    </div>
  );
};

export default FormPreview;
