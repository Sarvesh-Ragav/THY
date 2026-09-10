'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const initialConversations = [
  {
    id: 'C-1',
    customerName: 'Ananya Sharma',
    orderId: 'REQ-101',
    lastMessage: 'Will the silk lining be included in the price quote?',
    time: '10:42 AM',
    unread: true,
    messages: [
      { sender: 'customer', text: 'Hi, I submitted a request for an Anarkali suit.', time: '10:30 AM' },
      { sender: 'tailor', text: 'Hello Ananya! Yes, I received your request and measurements.', time: '10:35 AM' },
      { sender: 'customer', text: 'Will the silk lining be included in the price quote?', time: '10:42 AM' },
    ],
  },
  {
    id: 'C-2',
    customerName: 'Priya Verma',
    orderId: 'ORD-8091',
    lastMessage: 'Thank you! Looking forward to the fitting.',
    time: 'Yesterday',
    unread: false,
    messages: [
      { sender: 'tailor', text: 'Your Lehenga stitching is completed. Fitting is scheduled for tomorrow.', time: 'Yesterday' },
      { sender: 'customer', text: 'Thank you! Looking forward to the fitting.', time: 'Yesterday' },
    ],
  },
];

export default function ChatPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeChatId, setActiveChatId] = useState('C-1');
  const [inputMessage, setInputMessage] = useState('');

  const activeChat = conversations.find((c) => c.id === activeChatId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChat) return;

    const newMessage = {
      sender: 'tailor',
      text: inputMessage,
      time: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              lastMessage: inputMessage,
              time: 'Just now',
              messages: [...c.messages, newMessage],
            }
          : c
      )
    );

    setInputMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-thy-ink">Customer Communication</h1>
          <p className="text-sm text-thy-muted">Discuss custom fitting requirements and order progress in real time.</p>
        </div>
        <Link 
          href="/tailor-dashboard" 
          className="text-sm font-semibold text-thy-brand hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Chat Window Container */}
      <div className="bg-thy-surface rounded-2xl border border-thy-ink/10 shadow-sm grid grid-cols-1 md:grid-cols-3 min-h-[500px] overflow-hidden">
        
        {/* Left Sidebar: Conversations List */}
        <div className="border-r border-thy-ink/10 flex flex-col">
          <div className="p-4 border-b border-thy-ink/10 bg-thy-mist/50">
            <h2 className="font-bold text-thy-ink text-sm">Recent Conversations</h2>
          </div>
          <div className="divide-y divide-thy-ink/10 flex-1 overflow-y-auto">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left p-4 flex flex-col gap-1 transition-colors ${
                  activeChatId === chat.id ? 'bg-thy-mist' : 'hover:bg-thy-mist'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-thy-ink text-sm">{chat.customerName}</span>
                  <span className="text-[10px] text-thy-subtle">{chat.time}</span>
                </div>
                <div className="text-xs font-semibold text-thy-brand">{chat.orderId}</div>
                <p className="text-xs text-thy-muted truncate">{chat.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Active Chat Section */}
        {activeChat ? (
          <div className="md:col-span-2 flex flex-col justify-between bg-thy-mist/40">
            {/* Active Contact Bar */}
            <div className="p-4 bg-thy-surface border-b border-thy-ink/10 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-thy-ink text-sm">{activeChat.customerName}</h3>
                <span className="text-xs text-thy-muted">Ref: {activeChat.orderId}</span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              {activeChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'tailor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-xs space-y-1 ${
                      msg.sender === 'tailor'
                        ? 'bg-thy-brand text-white rounded-br-none'
                        : 'bg-thy-surface border border-thy-ink/10 text-thy-ink rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`text-[9px] text-right ${
                        msg.sender === 'tailor' ? 'text-thy-canvas/80' : 'text-thy-subtle'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-thy-surface border-t border-thy-ink/10 flex gap-2">
              <input
                type="text"
                placeholder="Type your response..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-thy-brand"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-thy-brand text-white font-semibold rounded-xl text-xs hover:bg-thy-brand-hover transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="md:col-span-2 flex items-center justify-center text-thy-subtle text-xs">
            Select a conversation to start chatting.
          </div>
        )}

      </div>
    </div>
  );
}