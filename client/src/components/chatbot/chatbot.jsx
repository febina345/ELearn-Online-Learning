import React, { useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Chatbot = ({ userId }) => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your course assistant chatbot. Ask me anything.", isBot: true },
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot', {
        message: input,
        userId: userId,  
      });
      const botMessage = { text: res.data.reply, isBot: true };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "Error contacting bot", isBot: true }]);
    }

    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-gray-300 shadow-lg rounded-lg z-50">
      <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center rounded-t-lg cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <span>LMS Chatbot</span>
        {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {!isMinimized && (
        <>
          <div className="h-64 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`text-sm p-2 rounded ${msg.isBot ? 'bg-gray-100 text-left' : 'bg-blue-100 text-right'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t">
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
            />
            <button onClick={handleSend} className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm">
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
