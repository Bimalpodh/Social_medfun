import React, { useState } from 'react';
import { Search, Edit, MoreVertical, Image as ImageIcon, Smile, Mic, Send, ArrowLeft, Phone, Video, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_CHATS = [
  { id: 1, name: "PixelDust", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PixelDust", lastMessage: "Let's team up for the raid later!", online: true, unread: 2, time: "2m" },
  { id: 2, name: "NeonRider", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeonRider", lastMessage: "Did you see that new drop?", online: false, unread: 0, time: "1h" },
  { id: 3, name: "CyberPunk99", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cyber", lastMessage: "GG nice play", online: true, unread: 0, time: "3h" },
  { id: 4, name: "GlitchMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Glitch", lastMessage: "Send me the coordinates.", online: false, unread: 0, time: "1d" },
  { id: 5, name: "ZeroCool", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zero", lastMessage: "I need backup!", online: true, unread: 1, time: "1d" },
  { id: 6, name: "GhostProtocol", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ghost", lastMessage: "Mission accomplished.", online: false, unread: 0, time: "2d" },
];

const MOCK_MESSAGES = [
  { id: 1, senderId: 1, text: "Hey! Ready for the new raid?", time: "10:30 AM" },
  { id: 2, senderId: 'me', text: "Almost, just upgrading some gear. Give me 10 mins.", time: "10:32 AM" },
  { id: 3, senderId: 1, text: "Take your time. The squad is assembling.", time: "10:33 AM" },
  { id: 4, senderId: 1, text: "Let's team up for the raid later!", time: "10:45 AM" },
];

export const Message = () => {
  const [activeChatId, setActiveChatId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const activeChat = MOCK_CHATS.find((c) => c.id === activeChatId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      senderId: 'me',
      text: messageInput.trim(),
      time: "Just now"
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  return (
    <div className="flex bg-slate-950 text-slate-200 overflow-hidden -mx-6 lg:-mx-10 -my-6 lg:-my-10 h-[calc(100vh-64px)] relative z-10 border-t border-slate-800">
      
      {/* Sidebar: Chat List */}
      <div className={`w-full sm:w-80 lg:w-96 flex flex-col border-r border-slate-800/60 bg-slate-900/50 backdrop-blur-md transition-all duration-300 ${activeChatId ? 'hidden sm:flex' : 'flex'}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-wide">Messages</h2>
            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]">3</span>
          </div>
          <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors">
            <Edit className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search transmissions..." 
              className="w-full bg-slate-950/50 border border-slate-800 text-sm rounded-full py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_CHATS.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 sm:p-4 flex items-center gap-3 cursor-pointer transition-colors border-l-2 ${
                activeChatId === chat.id 
                  ? 'bg-slate-800/80 border-cyan-500 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]' 
                  : 'border-transparent hover:bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              <div className="relative flex-shrink-0 group">
                <img 
                  src={chat.avatar} 
                  alt={chat.name} 
                  className={`w-12 h-12 rounded-full object-cover border-2 transition-all ${
                    activeChatId === chat.id ? 'border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'border-transparent group-hover:border-slate-600'
                  }`}
                />
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.6)]"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={`text-sm font-bold truncate ${activeChatId === chat.id ? 'text-cyan-50' : 'text-slate-200'}`}>
                    {chat.name}
                  </h3>
                  <span className={`text-xs flex-shrink-0 ml-2 ${chat.unread > 0 ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className={`text-sm truncate ${chat.unread > 0 ? 'text-slate-300 font-semibold' : 'text-slate-500'}`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 flex-shrink-0 bg-cyan-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area: Chat Window */}
      <div className={`flex-1 flex flex-col bg-slate-[920] relative ${!activeChatId ? 'hidden sm:flex items-center justify-center' : 'flex'}`}>
        
        {/* Background Cyber Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

        {!activeChatId ? (
          // Empty State
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
        ) : (
          // Active Chat
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveChatId(null)}
                  className="sm:hidden p-1.5 -ml-1.5 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                  {activeChat.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{activeChat.name}</h3>
                  <p className="text-xs text-slate-400">{activeChat.online ? 'Online now' : 'Offline'}</p>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar z-10">
              {messages.map((msg, index) => {
                const isMe = msg.senderId === 'me';
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
                        src={activeChat.avatar} 
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
                      <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Chat Input */}
            <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800/80 z-10 pb-6 sm:pb-4">
              <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <div className="flex-1 flex items-center bg-slate-950/80 border border-slate-700/80 rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-cyan-500 focus-within:border-cyan-500 transition-all w-full">
                  <button type="button" className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-full transition-colors flex-shrink-0">
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
                    <button type="button" className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-full transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-full transition-colors">
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
                  <div className="p-3"></div> // Placeholder to keep height consistent on mobile
                )}
              </form>
            </div>
          </>
        )}
      </div>

    </div>
  );
};
