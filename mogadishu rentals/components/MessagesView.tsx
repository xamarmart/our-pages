
import React, { useState } from 'react';
import { MOCK_MESSAGES } from '../constants';
import { Message } from '../types';

interface MessagesViewProps {
  onChatClick: (message: Message) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ onChatClick }) => {
  const [filter, setFilter] = useState<'All' | 'Buying' | 'Selling'>('All');

  const filteredMessages = MOCK_MESSAGES.filter(m => filter === 'All' || m.type === filter);

  return (
    <div className="pb-24 flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md p-5 pb-2 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
          <button className="text-primary hover:text-primary-dark font-semibold text-sm">Edit</button>
        </div>
        
        {/* Search */}
        <div className="mb-4">
          <div className="flex items-center rounded-2xl bg-gray-100 dark:bg-white/5 px-4 h-11 transition-all focus-within:ring-2 focus-within:ring-primary/20">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            <input 
              className="h-full w-full flex-1 bg-transparent px-3 text-sm font-medium focus:ring-0 border-none outline-none" 
              placeholder="Search conversations..."
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex h-9 w-full items-center justify-center gap-1 rounded-xl bg-gray-100 dark:bg-white/5 p-1">
          {(['All', 'Buying', 'Selling'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex h-full flex-1 cursor-pointer items-center justify-center rounded-lg text-xs font-bold transition-all ${
                filter === tab 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-2 mt-2">
        {filteredMessages.map((msg, idx) => (
          <React.Fragment key={msg.id}>
            <div 
              onClick={() => onChatClick(msg)}
              className="group relative flex cursor-pointer items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <div className="relative shrink-0">
                <img src={msg.senderAvatar} className="h-14 w-14 rounded-full object-cover ring-2 ring-white dark:ring-surface-dark" alt={msg.sender} />
                {msg.unreadCount > 0 && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[3px] border-white dark:border-surface-dark bg-primary"></span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                <div className="flex items-center justify-between">
                  <p className="truncate text-[15px] font-bold">{msg.sender}</p>
                  <p className={`text-xs ${msg.unreadCount > 0 ? 'text-primary font-bold' : 'text-slate-400'}`}>{msg.time}</p>
                </div>
                <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                  {msg.productTitle} • <span className="opacity-70">{msg.type}</span>
                </p>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className={`truncate text-sm ${msg.unreadCount > 0 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {msg.lastMessage}
                  </p>
                  {msg.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-black shadow-sm">
                      {msg.unreadCount}
                    </span>
                  )}
                </div>
              </div>
              <img src={msg.productImage} className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm" alt="Product" />
            </div>
            {idx < filteredMessages.length - 1 && (
              <div className="h-px w-full bg-gray-50 dark:bg-white/5 my-1 mx-4"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MessagesView;
