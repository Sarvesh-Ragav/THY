'use client';

import React, { useState } from 'react';

interface Message {
  id: string;
  sender: 'tailor' | 'customer';
  text: string;
  timestamp: string;
}

interface ChatConversation {
  id: string;
  customerName: string;
  orderId: string;
  garmentName: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    customerName: 'Ananya Ramesh',
    orderId: 'THY-8842',
    garmentName: 'Bridal Designer Blouse (Silk)',
    avatar: 'AR',
    lastMessage: 'Could you please make sure the back piping is gold?',
    lastTime: '10:42 AM',
    unreadCount: 1,
    messages: [
      { id: 'm1', sender: 'customer', text: 'Hi! I submitted my order estimate for the silk blouse.', timestamp: '10:30 AM' },
      { id: 'm2', sender: 'tailor', text: 'Hello Ananya! Received it. I reviewed your measurements.', timestamp: '10:35 AM' },
      { id: 'm3', sender: 'customer', text: 'Could you please make sure the back piping is gold?', timestamp: '10:42 AM' },
    ],
  },
  {
    id: 'conv-2',
    customerName: 'Meera K.',
    orderId: 'THY-8845',
    garmentName: 'Heavy Anarkali Suit Set',
    avatar: 'MK',
    lastMessage: 'Got it, thank you! Let me know when material arrives.',
    lastTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm4', sender: 'tailor', text: 'Hi Meera, order accepted! Please hand over the fabric by tomorrow.', timestamp: 'Yesterday 4:15 PM' },
      { id: 'm5', sender: 'customer', text: 'Got it, thank you! Let me know when material arrives.', timestamp: 'Yesterday 4:30 PM' },
    ],
  },
];

export default function TailorChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'tailor',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConvId) {
          return {
            ...conv,
            lastMessage: newMessage.text,
            lastTime: newMessage.timestamp,
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );

    setInputText('');
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50 text-slate-800 space-y-4">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Customer Messaging</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Direct thread for customer inquiries, fittings, and order modifications.
          </p>
        </div>
        <span className="text-xs font-bold text-[#00c9b7] bg-teal-50 border border-teal-200/60 px-3 py-1.5 rounded-full">
          ● Live Chat Active
        </span>
      </div>

      {/* Main Chat Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[650px] bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Sidebar: Conversation List */}
        <div className="border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Conversations</h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-4 transition-all cursor-pointer flex items-center gap-3 ${
                    isActive ? 'bg-white border-l-4 border-[#00c9b7] shadow-xs' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#00c9b7]/10 text-[#00c9b7] font-extrabold text-xs flex items-center justify-center shrink-0 border border-[#00c9b7]/20">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-xs font-bold text-slate-900 truncate">{conv.customerName}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">{conv.lastTime}</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 font-semibold">{conv.orderId}</p>
                    <p className="text-xs text-slate-500 truncate mt-1">{conv.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Chat Thread */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#00c9b7] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                {activeConv.avatar}
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900">{activeConv.customerName}</h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Order: <span className="font-semibold text-slate-700">{activeConv.garmentName}</span> ({activeConv.orderId})
                </p>
              </div>
            </div>
          </div>

          {/* Messages Display Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20">
            {activeConv.messages.map((msg) => {
              const isTailor = msg.sender === 'tailor';
              return (
                <div key={msg.id} className={`flex ${isTailor ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] p-3.5 rounded-2xl text-xs space-y-1 shadow-xs ${
                      isTailor
                        ? 'bg-[#00c9b7] text-white rounded-tr-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span
                      className={`block text-[9px] font-medium text-right ${
                        isTailor ? 'text-teal-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2 bg-white">
            <input
              type="text"
              placeholder="Type your message or fitting update..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00c9b7] focus:ring-1 focus:ring-[#00c9b7]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#00c9b7] text-white font-bold text-xs rounded-xl hover:bg-[#00b5a4] transition-all shadow-xs"
            >
              Send
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}