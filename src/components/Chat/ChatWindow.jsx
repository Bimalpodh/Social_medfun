import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Phone, Video, Info, Smile, Mic, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../../hooks/useAuth';
import { sendMessage } from '../../services/chatService';
import { getAvatarFallback } from '../../services/userService';

export default function ChatWindow({ activeChat, onClose }) {
  const { currentUser } = useAuth();
  const { messages, loading: messagesLoading } = useMessages(activeChat?.id);
  const [messageInput, setMessageInput] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat || !currentUser) return;

    const text = messageInput.trim();
    setMessageInput(""); // Clear immediately for snappy feel

    try {
      await sendMessage(activeChat.id, currentUser.id || currentUser.uid, text);
    } catch (error) {
      console.error("Failed to send transmission:", error);
      // Optional: show error toast or revert messageInput
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col bg-slate-[920] relative hidden sm:flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        <div className="text-center z-10 px-4">
          <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
            <Send className="w-10 h-10 text-cyan-500 transform translate-x-1 -translate-y-1" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Your Transmissions</h2>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">Select a player to start chatting or initiate a new secure channel.</p>
          <button className="px-6 py-2.5 rounded-full bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all">
            Initialize Comm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-[920] relative flex">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      {/* Chat Header */}
      <div className="h-16 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="sm:hidden p-1.5 -ml-1.5 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <img 
              src={activeChat.user?.profileImage || activeChat.user?.avatar || getAvatarFallback(activeChat.user?.username)} 
              alt={activeChat.user?.name} 
              className="w-9 h-9 rounded-full object-cover border border-slate-700" 
            />
            {activeChat.user?.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{activeChat.user?.name}</h3>
            <p className="text-xs text-slate-400">{activeChat.user?.online ? 'Online now' : 'Offline'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 text-slate-400">
          <button className="p-2 rounded-full hover:bg-slate-800 hover:text-cyan-400 transition-colors hidden sm:block">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-800 hover:text-cyan-400 transition-colors hidden sm:block">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-800 hover:text-cyan-400 transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar z-10"
      >
        {messages.map((msg, index) => {
          const isMe = msg.senderId === (currentUser?.id || currentUser?.uid);
          const msgTime = msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Sending...";
          
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              key={msg.id} 
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img 
                  src={activeChat.user?.profileImage || activeChat.user?.avatar || getAvatarFallback(activeChat.user?.username)} 
                  alt="avatar" 
                  className="w-7 h-7 rounded-full object-cover mr-2 self-end mb-1 border border-slate-700"
                />
              )}
              <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    isMe 
                      ? 'bg-cyan-600 text-white rounded-br-sm shadow-[0_2px_10px_rgba(8,145,178,0.2)]' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msgTime}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chat Input */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800/80 z-10 pb-6 sm:pb-4">
        <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <div className="flex-1 flex items-center bg-slate-950/80 border border-slate-700/80 rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-cyan-500 focus-within:border-cyan-500 transition-all w-full">
            <button type="button" className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-full flex-shrink-0">
              <Smile className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a transmission..." 
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none px-2 py-1.5 w-full min-w-0"
            />
            <div className="flex items-center gap-1 flex-shrink-0">
              <button type="button" className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-full">
                <Mic className="w-5 h-5" />
              </button>
              <button type="button" className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-full">
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {messageInput.trim() ? (
            <button 
              type="submit" 
              className="p-3 rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-[0_0_12px_rgba(34,211,238,0.5)] transition-all flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <div className="p-3 bg-transparent w-11"></div> 
          )}
        </form>
      </div>
    </div>
  );
}
