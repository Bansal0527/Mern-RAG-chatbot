import React, { useState, useEffect, useRef } from 'react';
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
  const [chatSessions, setChatSessions] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  // Close menu on outside click
  const menuRef = useRef();
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
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
    fetchChatSessions();
  }, []);

  // Fetch all chat sessions
  const fetchChatSessions = async () => {
    try {
      const res = await apiFetch(endpoints.getChatSessions, {}, token);
      setChatSessions(res.sessions || []);
    } catch (err) {
      setError(err.error || 'Failed to fetch chat sessions');
    }
  };

  // Delete a chat session
  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Delete this chat session?')) return;
    try {
      await apiFetch(endpoints.deleteChatSession(sessionId), { method: 'DELETE' }, token);
      // If deleted session is active, clear chat
      if (chatSessionId === sessionId) {
        setChatSessionId(null);
        setChatMessages([]);
      }
      console.log("delted")
      await fetchChatSessions();
    } catch (err) {
      setError(err.error || 'Failed to delete chat session');
    }
  };

  // Edit chat session title
  const handleEditSessionTitle = async (sessionId, oldTitle) => {
    const newTitle = window.prompt('Edit chat title:', oldTitle);
    if (!newTitle || newTitle === oldTitle) return;
    try {
      await apiFetch(`${endpoints.getChatSessions}/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: newTitle }),
        headers: { 'Content-Type': 'application/json' }
      }, token);
      await fetchChatSessions();
    } catch (err) {
      setError(err.error || 'Failed to edit chat title');
    }
  };

  // Load chat history for a session
  const loadChatHistory = async (sessionId) => {
    setChatLoading(true);
    try {
      const res = await apiFetch(endpoints.getChatHistory(sessionId), {}, token);
      setChatSessionId(res._id || res.id);
      setChatMessages(res.messages || []);
    } catch (err) {
      setError(err.error || 'Failed to load chat history');
    }
    setChatLoading(false);
  };

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
      await fetchChatSessions(); // Refresh past chat list after new chat
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
  <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4 h-full min-h-screen">
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
        {/* Chat session list */}
        {activeTab === 'chat' && (
          <>
            <button
              className="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              onClick={createChatSession}
              disabled={chatLoading}
            >
              {chatSessionId ? 'New Chat' : 'Start Chat'}
            </button>
            <div className="mt-6 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Past Chats</h3>
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto pb-4">
                {chatSessions.length === 0 && <div className="text-gray-400">No past chats</div>}
                {chatSessions.map(session => (
                  <div key={session._id} className="relative flex items-center group">
                    <button
                      className={`flex-1 text-left px-3 py-2 rounded-lg font-medium transition-colors w-full truncate ${chatSessionId === session._id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                      onClick={() => loadChatHistory(session._id)}
                    >
                      {session.title}
                    </button>
                    <button
                      className="ml-2 text-gray-400 hover:text-gray-700 px-2 py-1 rounded-full focus:outline-none"
                      onClick={() => setMenuOpenId(menuOpenId === session._id ? null : session._id)}
                      aria-label="Chat options"
                    >
                      <span style={{fontSize: '1.5em', fontWeight: 'bold'}}>⋯</span>
                    </button>
                    {menuOpenId === session._id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-10 z-10 bg-white rounded-2xl shadow-xl w-48 border border-gray-100 flex flex-col py-2"
                        style={{ minWidth: '170px' }}
                      >
                        <button
                          className="flex items-center gap-3 px-5 py-3 text-gray-700 text-base font-medium hover:bg-gray-100 rounded-xl transition-all"
                          onClick={() => { setMenuOpenId(null); handleEditSessionTitle(session._id, session.title); }}
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 5.487l1.65 1.65a2.25 2.25 0 010 3.182l-8.25 8.25a2.25 2.25 0 01-1.591.659H5.25v-3.421a2.25 2.25 0 01.659-1.591l8.25-8.25a2.25 2.25 0 013.182 0z"></path></svg>
                          Rename
                        </button>
                        <div className="border-t mx-4" />
                        <button
                          className="flex items-center gap-3 px-5 py-3 text-red-600 text-base font-medium hover:bg-red-50 rounded-xl transition-all"
                          onClick={() => { setMenuOpenId(null); handleDeleteSession(session._id); }}
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 7h12M9 7V5a3 3 0 016 0v2m-7 0h8m-9 4v7a2 2 0 002 2h6a2 2 0 002-2v-7"></path></svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
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
              <div className="text-gray-600">Start a new chat session to begin or select a past chat.</div>
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
