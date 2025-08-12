import React, { useState } from 'react';

const DocumentUploader = ({ onUpload, error: parentError, loading }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setError(null);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading && !loading) setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (uploading || loading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      setError(null);
    }
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
    <div
      className={`bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto flex flex-col items-center ${dragActive ? 'border-2 border-blue-500' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Documents</h2>
      <div
        className={`mb-4 w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-10 cursor-pointer transition-all duration-200 ${dragActive ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'}`}
        onClick={() => !uploading && !loading && document.getElementById('fileInput').click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
        role="button"
        aria-label="Drag and drop files here or click to select"
      >
        <input
          id="fileInput"
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading || loading}
        />
        <span className="text-xl font-semibold text-gray-700 text-center leading-relaxed">
          <span className="block">Drag &amp; drop files here</span>
          <span className="block mt-1 text-base font-normal text-gray-500">or <span className="text-blue-600 underline hover:text-blue-800 font-semibold">click to select</span></span>
        </span>
        {files.length > 0 && (
          <div className="mt-3 text-sm text-gray-700 font-semibold">
            Selected: {files.map(f => f.name).join(', ')}
          </div>
        )}
      </div>
      {(error || parentError) && <div className="text-red-500 mb-3 text-center w-full">{error || parentError}</div>}
      <button
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all disabled:opacity-50 w-full"
        onClick={handleUpload}
        disabled={uploading || loading || files.length === 0}
      >
        {uploading  ? 'Uploading...' : 'Upload'}
      </button>
      {(uploading ) && (
        <div className="mt-6 w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
