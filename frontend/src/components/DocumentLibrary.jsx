import React from 'react';

const DocumentLibrary = ({ documents, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4">Document Library</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Filename</th>
              <th className="py-2 px-4 text-left">Size</th>
              <th className="py-2 px-4 text-left">Upload Date</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b">
                <td className="py-2 px-4">{doc.filename}</td>
                <td className="py-2 px-4">{doc.size} MB</td>
                <td className="py-2 px-4">{doc.uploadDate}</td>
                <td className="py-2 px-4">
                  <button
                    className="text-red-600 hover:underline mr-2"
                    onClick={() => onDelete(doc.id)}
                  >Delete</button>
                  {/* <a
                    href={doc.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >Preview</a> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentLibrary;
