import React, { useState } from 'react';

const DocumentUploader = ({ onUpload, error: parentError, loading }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setError(null);
  };

  const handleUpload = async () => {
    setUploading(true);
    setProgress(0);
    setError(null);
    // Simulate upload progress
    for (let i = 1; i <= 100; i += 10) {
      setTimeout(() => setProgress(i), i * 10);
    }
    if (onUpload) {
      try {
        await onUpload(files);
      } catch (err) {
        setError(err?.error || 'Upload failed');
      }
    }
    setTimeout(() => {
      setUploading(false);
      setProgress(100);
    }, 1200);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
      <input
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md"
        className="mb-2 block w-full text-sm text-gray-500"
        onChange={handleFileChange}
        disabled={uploading || loading}
      />
      {(error || parentError) && <div className="text-red-500 mb-2">{error || parentError}</div>}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleUpload}
        disabled={uploading || loading || files.length === 0}
      >
        {uploading  ? 'Uploading...' : 'Upload'}
      </button>
      {(uploading ) && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
