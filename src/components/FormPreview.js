// FormPreview.js
import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import FormResult from './FormResult';

const FormPreview = ({ uiSchema }) => {
  const [formData, setFormData] = useState({});
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showFormResult, setShowFormResult] = useState(false);


  const isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;

  
  
  const handleFormChange = ({ formData }) => {
    // Iterate over formData to identify changes
    const updatedFormData = { ...formData };
  
    Object.keys(formData).forEach((key) => {
      const radioGroup = uiSchema.items.find(
        (field) =>
          field.uiType === 'Group' &&
          field.subParameters.some(
            (subParam) => subParam.uiType === 'Radio' && subParam.jsonKey === key
          )
      );
  
      if (radioGroup) {
        const selectedOption = formData[key];
  
        radioGroup.subParameters.forEach((subParam) => {
          if (subParam.uiType === 'Ignore' && subParam.subParameters) {
            console.log(subParam.conditions);
            const val = subParam.conditions[0].value;
            // console.log(selectedOption + " is so and val is "+ val);

            if (selectedOption !== val){
            subParam.subParameters.forEach((nestedSubParam) => {
              if (nestedSubParam.uiType !== 'Input') {
                const nestedSubKey = nestedSubParam.jsonKey;
                // Check if the selectedOption is an array (e.g., from radio group)
                  console.log(nestedSubParam);
                  // If not an array, delete the subKey
                  
                  console.log("deleted "+ updatedFormData[nestedSubKey]);
                  delete updatedFormData[nestedSubKey];
                
              }
            });
          }



          }
        });
      }
    });
  
    // Update the formData state
    setFormData(updatedFormData);
  };
  
  
  
  
  
  
  
  
  
  

  const renderFormFields = (fields, parentKey = '') => {
    if (!fields) {
      return null;
    }
    
    return fields.map((field, index) => {
      const key = `${field.jsonKey || index}`;
      const isRequired = field.validate && field.validate.required;

      if (field.uiType === 'Group' && field.subParameters) {
        const requiredSubparams = field.subParameters.filter((subParam) => subParam.validate && subParam.validate.required);
        const nonRequiredSubparams = field.subParameters.filter((subParam) => !subParam.validate || !subParam.validate.required);
      
        // Check if there are both required and non-required subparameters
        const shouldShowSwitch = requiredSubparams.length > 0 && nonRequiredSubparams.length > 0;
      
        return (
          <div key={key} className="mb-4">
            <label className={`block text-gray-700 text-sm font-bold mb-2 ${isRequired ? 'required' : ''}`}>
              {field.label} {isRequired && <span className="text-red-500">*</span>}
              <hr className="my-4 border-t border-gray-300" />
            </label>
      
            {/* Render only required subparameters if the switch is off */}
            {!showAdvancedFields && renderFormFields(requiredSubparams, key)}
      
            {/* Render all subparameters if the switch is on */}
            {showAdvancedFields && renderFormFields([...requiredSubparams, ...nonRequiredSubparams], key)}

                        {/* Conditionally render the "Advanced Fields" switch */}
                        {shouldShowSwitch && (
              <div className="flex items-center mt-2">
                <span className={`text-${showAdvancedFields ? 'blue-500' : 'gray-500'} mr-2`}>
                  {showAdvancedFields ? 'Hide' : 'Show'} Advanced Fields
                </span>
                <Switch
                  onChange={() => setShowAdvancedFields(!showAdvancedFields)}
                  checked={showAdvancedFields}
                  height={20} // Adjust the size as needed
                  onColor="#4B0082" // Blue color when on
                  offColor="#718096" // Gray color when off
                  uncheckedIcon={false} // Remove the unchecked icon
                  checkedIcon={false} // Remove the checked icon
                  handleDiameter={15} // Adjust the size of the circle
                  onHandleColor="#ffffff" // Gray color for the circle when on
                  offHandleColor="#ffffff" // Gray color for the circle when off
                />
              </div>
            )}
          </div>
        );
      }
      
       else if (field.uiType === 'Radio' && field.validate && field.validate.options) {
        const selectedOption = formData.hasOwnProperty(field.jsonKey) ? formData[field.jsonKey] :field.validate.defaultValue;
        if(!formData.hasOwnProperty(field.jsonKey)){
          handleFormChange({
            formData: { ...formData, [field.jsonKey]: field.validate.defaultValue },
          })
        };
        return (
          <div key={key} className="mb-4">
            {/* <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label> */}
            <div className="flex flex-wrap sm:flex-no-wrap sm:space-x-4">
              {/* {console.log(field.validate.defaultValue)} */}
              {field.validate.options.map((option) => (
                <div key={option.value} className="mb-2 sm:mb-0">
                  <input
                    type="radio"
                    id={`${key}_${option.value}`}
                    name={key}
                    value={option.value}
                    checked={(selectedOption === option.value) }
                    required= {field.validate.required}
                    onChange={(e) =>
                      handleFormChange({
                        formData: { ...formData, [field.jsonKey]: e.target.value },
                      })
                    }
                    className="hidden" // Hide the actual radio button
                  />
                    {/* {console.log(field.required)} */}
                  <label
                    htmlFor={`${key}_${option.value}`}
                    className={`cursor-pointer px-4 py-2 text-gray-700 ${
                      selectedOption === option.value ? 'bg-gray-300' : ''
                    }`}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {/* {field.subParameters &&
              field.subParameters.map((subParam) => {
                if (subParam.uiType === 'Ignore' && subParam.conditions) {
                  const shouldRender = subParam.conditions.some((condition) => {
                    const { jsonKey, op, value } = condition;
                    return compareValues(formData[jsonKey], op, value);
                  });
        
                  if (!shouldRender) {
                    return null;
                  }
                }
        
                return renderFormFields([subParam], key);
              })} */}
          </div>
        );
      }else if (field.uiType === 'Select' && field.validate && field.validate.options) {
        const selectedValue = formData.hasOwnProperty(field.jsonKey)
          ? formData[field.jsonKey]
          : field.validate.defaultValue;
      
        if (!formData.hasOwnProperty(field.jsonKey)) {
          handleFormChange({
            formData: { ...formData, [field.jsonKey]: field.validate.defaultValue },
          });
        }
      
        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {field.label}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={key}
              value={selectedValue}
              onChange={(e) =>
                handleFormChange({
                  formData: { ...formData, [field.jsonKey]: e.target.value },
                })
              }
            >
              <option value="" disabled hidden>
                Select {field.label}
                {isRequired && <span className="text-red-500">*</span>}
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
        if (!formData.hasOwnProperty(field.jsonKey)) {
          handleFormChange({
            formData: { ...formData, [field.jsonKey]: field.validate.defaultValue },
          });
        }
        return (
          <div key={field.jsonKey} className="mb-4 flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={formData[key] || false}
              onChange={(e) => handleFormChange({ formData: { ...formData, [key]: e.target.checked } })}
              className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
            />
            <label htmlFor={field.jsonKey} className="ml-2 text-gray-700 text-sm font-bold">
              {field.label}{isRequired && <span className="text-red-500">*</span>}
            </label>
            {/* {console.log("json key is : " + key)} */}
          </div>
        );
      }
       else if (field.uiType === 'Input') {
        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
              {field.label}{isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={field.jsonKey}
              type="text"
              required = {isRequired}
              value={formData[key] || ''}
              onChange={(e) => handleFormChange({ formData: { ...formData, [field.jsonKey]: e.target.value } })}
            />
          </div>
        );
      }else if (field.uiType === 'Ignore' && field.conditions) {
        // console.log(field.subParameters);
        // console.log(field.conditions);

        const shouldRenderIgnore = field.conditions.some((condition) => {
        const { jsonKey, op, value } = condition;
        const subKey = jsonKey.split('.')[1];
          // console.log(subKey);
          return compareValues(formData[subKey], op, value);
        });
        
        // console.log(shouldRenderIgnore+" ignored");
        if (!shouldRenderIgnore) {
          return null;
        }
      
        // Render subparameters for the "Ignore" field
        return (
          <div key={key} className="mb-4">

            {field.subParameters &&
              field.subParameters.map((subParam) => {
                if (!subParam.disable){
                return renderFormFields([subParam], key);
                }
                return null
              })}
          </div>
        );
      }
      return null;
    });
  };


  

  const compareValues = (value, op, target) => {
    switch (op) {
      case '==':
        // console.log(value + target);
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

  const handleSubmit = (event) => {
    // Handle form submission
    event.preventDefault();
    setShowFormResult(true);
    
  };

  const handleCancel = () => {
    // Handle form cancellation
    setFormData({});
  };

  

  return (
    <div className={`w-full sm:w-full p-4 border border-black rounded m-2 ${showFormResult ? 'overflow-hidden' : 'overflow-scroll'} relative`}>
      <form onSubmit={(event) => handleSubmit(event)}>
        {uiSchema &&
          uiSchema.items &&
          uiSchema.items.map((item, index) => (
            <div key={index}>
              {renderFormFields([item])}
            </div>
          ))}
      {/* Buttons - Conditionally render based on formData */}
      {!isEmpty(formData) && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      )}
      </form>



      {/* Display form result */}
      {showFormResult && (
        <FormResult formData={formData} onClose={() => setShowFormResult(false)} />
      )}
    </div>
  );
};

export default FormPreview;