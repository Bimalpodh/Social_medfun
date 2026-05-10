import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatList from '../components/Chat/ChatList';
import ChatWindow from '../components/Chat/ChatWindow';
import { useChats } from '../hooks/useChats';
import { useAuth } from '../hooks/useAuth';

export const Message = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const { chats, loading, error } = useChats(currentUser?.id || currentUser?.uid);
  const [activeChatId, setActiveChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Set active chat from query param if provided
  useEffect(() => {
    const cid = searchParams.get('chatId');
    if (cid) {
      setActiveChatId(cid);
    }
  }, [searchParams]);
  
  if (!currentUser) return <div className="p-10 text-center text-slate-500">Initializing secure link...</div>;

  const filteredChats = chats.filter(chat => 
    chat.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="flex bg-slate-950 text-slate-200 overflow-hidden -mx-6 lg:-mx-10 -my-6 lg:-my-10 h-[calc(100vh-64px)] relative z-10 border-t border-slate-800">
      <ChatList 
        chats={filteredChats} 
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />
      <ChatWindow 
        activeChat={activeChat} 
        onClose={() => setActiveChatId(null)}
      />
    </div>
  );
};
