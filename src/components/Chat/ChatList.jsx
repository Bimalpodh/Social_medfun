import React from 'react';
import { Search, Edit } from 'lucide-react';

export default function ChatList({ chats, loading, error, searchQuery, setSearchQuery, activeChatId, setActiveChatId }) {
  return (
    <div className={`w-full sm:w-80 lg:w-96 flex flex-col border-r border-slate-800/60 bg-slate-900/50 backdrop-blur-md transition-all duration-300 ${activeChatId ? 'hidden sm:flex' : 'flex'}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-wide">Messages</h2>
          {/* We'll implement real unread counts in Step 8, showing placeholder for now */}
          {chats.some(c => c.unreadCount?.[activeChatId] > 0) && (
            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]">!</span>
          )}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players..." 
            className="w-full bg-slate-950/50 border border-slate-800 text-sm rounded-full py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3 opacity-50">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono tracking-widest text-cyan-500/50 uppercase">Syncing...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-500 text-xs font-medium">{error}</div>
        ) : chats.length === 0 ? (
          <div className="p-8 text-center text-slate-600 text-sm font-medium">
            {searchQuery ? "No matches found." : "No active transmissions."}
          </div>
        ) : (
          chats.map((chat) => {
            const lastTime = chat.updatedAt?.toDate ? chat.updatedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
            
            return (
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
                    src={chat.user?.profileImage || chat.user?.avatar} 
                    alt={chat.user?.name} 
                    className={`w-12 h-12 rounded-full object-cover border-2 transition-all ${
                      activeChatId === chat.id ? 'border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'border-transparent group-hover:border-slate-600'
                    }`}
                  />
                  {chat.user?.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.6)]"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`text-sm font-bold truncate ${activeChatId === chat.id ? 'text-cyan-50' : 'text-slate-200'}`}>
                      {chat.user?.name}
                    </h3>
                    <span className={`text-[10px] font-mono flex-shrink-0 ml-2 ${chat.unreadCount?.[activeChatId] > 0 ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                      {lastTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-sm truncate ${chat.unreadCount?.[activeChatId] > 0 ? 'text-slate-300 font-semibold' : 'text-slate-500'}`}>
                      {chat.lastMessage || "Start a transmission..."}
                    </p>
                    {chat.unreadCount?.[activeChatId] > 0 && (
                      <span className="w-5 h-5 flex-shrink-0 bg-cyan-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                        {chat.unreadCount[activeChatId]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
