
import React, { useState } from 'react';
import { Message, ChatMessage } from '../types';

interface ChatDetailViewProps {
  chat: Message;
  onBack: () => void;
}

const ChatDetailView: React.FC<ChatDetailViewProps> = ({ chat, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: `Hello, I see you are interested in the ${chat.productTitle}.`, sender: 'other', time: '10:30 AM' },
    { id: '2', text: 'Hi! Yes, is it still available? I can pick it up today.', sender: 'user', time: '10:32 AM', status: 'read' },
    { id: '3', text: 'Yes it is. But the price is slightly negotiable. My last price is 45k.', sender: 'other', time: '10:35 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-surface-dark px-4 py-3 shadow-sm z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={chat.senderAvatar} className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-50 dark:ring-slate-800" alt={chat.sender} />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-surface-dark bg-primary"></span>
            </div>
            <div>
              <h3 className="text-sm font-bold">{chat.sender}</h3>
              <p className="text-[11px] text-primary flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span> Online
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-slate-600 dark:text-slate-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-[22px]">call</span>
          </button>
          <button className="text-slate-600 dark:text-slate-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-[22px]">more_vert</span>
          </button>
        </div>
      </div>

      {/* Product Context */}
      <div className="relative z-10 flex items-center justify-between bg-white dark:bg-surface-dark px-4 py-2.5 shadow-sm border-t border-gray-50 dark:border-white/5">
        <div className="flex items-center gap-3">
          <img src={chat.productImage} className="h-10 w-10 rounded-lg object-cover" alt="Product" />
          <div className="flex flex-col">
            <p className="text-xs font-bold line-clamp-1">{chat.productTitle}</p>
            <p className="text-[11px] font-semibold text-primary">$ 45,000</p>
          </div>
        </div>
        <button className="rounded-lg bg-gray-50 dark:bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-gray-100 transition-colors">
          View
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 pb-8">
        {/* Safety Tip */}
        <div className="flex flex-col gap-2 rounded-xl border border-orange-100 bg-orange-50/80 p-3 text-orange-900 backdrop-blur-sm dark:border-orange-900/30 dark:bg-orange-900/20 dark:text-orange-200 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500 text-sm">security</span>
              <p className="text-xs font-bold uppercase tracking-wider">Safety Tip</p>
            </div>
            <button className="text-orange-400 hover:text-orange-600"><span className="material-symbols-outlined text-sm">close</span></button>
          </div>
          <p className="text-xs leading-relaxed opacity-90">Do not pay in advance even for the delivery. Meet in a safe public place.</p>
        </div>

        <div className="flex justify-center mb-2">
          <span className="rounded-full bg-gray-200/60 dark:bg-white/5 px-3 py-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">Yesterday</span>
        </div>

        {messages.map(msg => (
          <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
            {msg.sender === 'other' && (
              <img src={chat.senderAvatar} className="h-8 w-8 rounded-full object-cover shadow-sm" alt="Sender" />
            )}
            <div className={`flex flex-col gap-1 max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl p-3 shadow-sm ${
                msg.sender === 'user' 
                ? 'bg-primary text-black rounded-tr-sm' 
                : 'bg-white dark:bg-surface-dark text-slate-800 dark:text-white rounded-tl-sm ring-1 ring-black/5 dark:ring-white/5'
              }`}>
                <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
              </div>
              <div className="flex items-center gap-1 opacity-60">
                <span className="text-[10px] font-medium text-slate-400">{msg.time}</span>
                {msg.sender === 'user' && (
                  <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 p-4 pb-8 safe-area-pb">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
          {['Is it negotiable?', 'Can I call you?', 'Send location'].map(chip => (
            <button key={chip} onClick={() => setInputText(chip)} className="whitespace-nowrap rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 transition-all">
              {chip}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-3">
          <button className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 text-slate-500 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-[24px]">add</span>
          </button>
          <label className="flex min-h-[44px] flex-1 items-center gap-2 rounded-[1.25rem] bg-gray-100 dark:bg-white/5 px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-primary/20">
            <textarea 
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="max-h-24 w-full resize-none bg-transparent p-0 text-[15px] leading-6 focus:ring-0 border-none outline-none dark:text-white" 
              placeholder="Type a message..."
            />
            <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-[20px]">photo_camera</span></button>
          </label>
          <button 
            onClick={sendMessage}
            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-black shadow-lg shadow-primary/30 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px] ml-0.5 font-bold">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailView;
