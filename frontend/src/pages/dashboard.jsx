import React, { useState, useEffect } from 'react';
import DocumentUploader from '../components/DocumentUploader';
import DocumentLibrary from '../components/DocumentLibrary';
import ChatInterface from '../components/ChatInterface';
import { endpoints, apiFetch, uploadFile, BASE_URL } from '../config/api';

const endpointsChat = {
  createSession: endpoints.createChatSession || `${BASE_URL}/chat/sessions`,
  sendMessage: (sessionId) => `${BASE_URL}/chat/sessions/${sessionId}/messages`,
};

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [chatSessionId, setChatSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Fetch documents from backend
  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(endpoints.getDocuments, {}, token);
      setDocuments(
        (res.documents || []).map(doc => ({
          id: doc._id,
          filename: doc.filename,
          size: (doc.metadata?.fileSize / 1024 / 1024).toFixed(2),
          uploadDate: doc.createdAt?.slice(0, 10),
          previewUrl: '#',
        }))
      );
    } catch (err) {
      setError(err.error || 'Failed to fetch documents');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle document upload
  const handleUpload = async (files) => {
    setLoading(true);
    setError(null);
    try {
      for (const file of files) {
        await uploadFile(endpoints.uploadDocument, file, token);
      }
      await fetchDocuments();
    } catch (err) {
      setError(err.error || 'Upload failed');
    }
    setLoading(false);
  };

  // Handle document delete
  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(endpoints.deleteDocument(id), { method: 'DELETE' }, token);
      await fetchDocuments();
    } catch (err) {
      setError(err.error || 'Delete failed');
    }
    setLoading(false);
  };

  // Chat session creation
  const createChatSession = async () => {
    setChatLoading(true);
    try {
      const res = await apiFetch(endpointsChat.createSession, { method: 'POST' }, token);
      setChatSessionId(res._id || res.id);
      setChatMessages([]);
    } catch (err) {
      setError(err.error || 'Failed to start chat session');
    }
    setChatLoading(false);
  };

  // Chat message send
  const handleSendMessage = async (message) => {
    console.log("session id :" , chatSessionId)
    if (!chatSessionId) return;
    
    setChatLoading(true);
    try {
      const res = await apiFetch(
        endpointsChat.sendMessage(chatSessionId),
        {
          method: 'POST',
          body: JSON.stringify({ message })
        },
        token
      );
      setChatMessages((prev) => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: res.message, citation: res.sources?.map(s => s.filename).join(', ') }
      ]);
    } catch (err) {
      setError(err.error || 'Failed to send message');
    }
    setChatLoading(false);
  };

  // Sidebar navigation
  const sidebarItems = [
    { key: 'documents', label: 'Documents' },
    { key: 'chat', label: 'Chat' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-lg flex flex-col py-8 px-4">
        <h1 className="text-2xl font-bold mb-8 text-blue-700">Business Knowledge</h1>
        <nav className="flex flex-col gap-4">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === item.key ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        {activeTab === 'chat' && (
          <button
            className="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={createChatSession}
            disabled={chatLoading}
          >
            {chatSessionId ? 'New Chat' : 'Start Chat'}
          </button>
        )}
        {/* Logout button at the bottom */}
        <div className="flex-1" />
        <button
          className="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {activeTab === 'documents' && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 w-full">
              <DocumentUploader onUpload={handleUpload} error={error} loading={loading} />
            </div>
            <div className="md:w-2/3 w-full">
              {loading && <div className="text-blue-600 mb-2">Loading...</div>}
              {error && <div className="text-red-600 mb-2">{error}</div>}
              <DocumentLibrary documents={documents} onDelete={handleDelete} />
            </div>
          </div>
        )}
        {activeTab === 'chat' && (
          <div className="max-w-2xl mx-auto">
            {!chatSessionId ? (
              <div className="text-gray-600">Start a new chat session to begin.</div>
            ) : (
              <ChatInterface
                onSend={handleSendMessage}
                messages={chatMessages}
                loading={chatLoading}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
