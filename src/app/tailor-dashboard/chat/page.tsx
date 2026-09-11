'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'tailor' | 'customer';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  orderId: string;
  customerName: string;
  garmentType: string;
  lastMessage: string;
  unread: boolean;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    orderId: 'ORD-8091',
    customerName: 'Priya Verma',
    garmentType: 'Embroidered Lehenga Choli',
    lastMessage: 'Can you please share a photo of the blouse embroidery progress?',
    unread: true,
    messages: [
      { id: 'm1', sender: 'customer', text: 'Hi! Just checking in on ORD-8091.', timestamp: '10:15 AM' },
      { id: 'm2', sender: 'tailor', text: 'Hello Priya! We have completed cutting and started stitching.', timestamp: '10:18 AM' },
      { id: 'm3', sender: 'customer', text: 'Can you please share a photo of the blouse embroidery progress?', timestamp: '10:20 AM' },
    ],
  },
  {
    id: 'conv-2',
    orderId: 'ORD-8095',
    customerName: 'Vikram Mehta',
    garmentType: '3-Piece Tuxedo Suit',
    lastMessage: 'Thank you! Fitting on Thursday works for me.',
    unread: false,
    messages: [
      { id: 'm4', sender: 'tailor', text: 'Hi Vikram, your suit will be ready for first trial by Thursday.', timestamp: 'Yesterday' },
      { id: 'm5', sender: 'customer', text: 'Thank you! Fitting on Thursday works for me.', timestamp: 'Yesterday' },
    ],
  },
];

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [newMessageText, setNewMessageText] = useState<string>('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'tailor',
      text: newMessageText.trim(),
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: newMsg.text,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setNewMessageText('');
  };

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Messages</h1>
          <p className="text-xs text-gray-600">Direct communications with active order customers.</p>
        </div>
        <Link href="/tailor-dashboard" className="text-sm font-semibold text-[#00c9b7] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: Conversations List */}
        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
          <div className="p-3 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
            Active Chats
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full p-4 text-left transition-colors flex flex-col gap-1 ${
                  activeConvId === conv.id ? 'bg-teal-50/60 border-l-4 border-[#00c9b7]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-900">{conv.customerName}</span>
                  <span className="text-[10px] font-bold text-gray-400">{conv.orderId}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#00c9b7]">{conv.garmentType}</span>
                <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Main Panel: Active Message Thread */}
        {activeConv && (
          <div className="flex-1 flex flex-col bg-gray-50/40">
            {/* Thread Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900">{activeConv.customerName}</h2>
                <p className="text-xs text-gray-500">
                  Order <span className="font-semibold text-gray-700">{activeConv.orderId}</span> — {activeConv.garmentType}
                </p>
              </div>
              <Link
                href="/tailor-dashboard/active-orders"
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
              >
                View Order
              </Link>
            </div>

            {/* Message Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'tailor' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-3 rounded-2xl text-xs ${
                      msg.sender === 'tailor'
                        ? 'bg-[#00c9b7] text-white rounded-tr-none'
                        : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Type your message to customer..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00c9b7]"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#00c9b7] text-white rounded-xl text-xs font-bold hover:bg-[#00b5a4] transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}