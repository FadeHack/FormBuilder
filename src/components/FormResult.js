// FormResult.js
import React from 'react';

const FormResult = ({ formData, onClose }) => {
  return (
    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative z-10 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Form Result</h2>
        <div className="max-h-60 overflow-auto mb-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border py-2 px-4">Field</th>
                <th className="border py-2 px-4">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formData).map(([field, value]) => (
                <tr key={field}>
                  <td className="border py-2 px-4 whitespace-nowrap">{field}</td>
                  <td className="border py-2 px-4 break-all">{JSON.stringify(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-sm mb-2">Form Data as JSON:</div>
        <div className="max-h-40 overflow-auto">
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
        <button
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FormResult;
