import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Calendar, Clock, UserCheck, MessageCircle, Stethoscope, FileText } from 'lucide-react';
import {Link} from "react-router-dom"

// Helper: Chat message bubble
const ChatMessage = ({ message }) => (
  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`flex items-start space-x-3 max-w-xs sm:max-w-md md:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-gray-800' : 'bg-gray-200'}`}>
        {message.sender === 'user' ? 
          <User className="w-4 h-4 text-white" /> : 
          <Bot className="w-4 h-4 text-gray-600" />
        }
      </div>
      <div className={`rounded-2xl px-4 py-3 ${message.sender === 'user' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <p className="text-sm whitespace-pre-line font-light">{message.text}</p>
        <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  </div>
);

// Helper: Chat input area
const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage, handleKeyPress }) => (
  <div className="p-4 bg-white border-t border-gray-200">
    <div className="flex space-x-3">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1 p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 text-sm"
      />
      <button
        onClick={handleSendMessage}
        disabled={!inputMessage.trim()}
        className="px-4 py-3 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// NEW: Suggestion Queries Component
const SuggestionQueries = ({ onSuggestionClick, user, showSuggestions }) => {
  const patientSuggestions = [
    {
      text: "Book an appointment with Dr. Alice"
    },
    {
      text: "What are Dr. Bob's available slots today?"
    },
    {
      text: "Does Dr. Carol work here"
    },
    {
      text: "Is Dr. Gupta free tomorrow?"
    }
  ];

  const doctorSuggestions = [
    {
      text: "Show my schedule for today"
    },
    {
      text: "Generate appointment summary for this week"
    },
    {
      text: "List all my patients for tomorrow"
    },
    {
      text: "Show patient medical history for John Doe"
    }
  ];

  // Determine which suggestions to show based on user type
  const suggestions = user?.role === 'doctor' ? doctorSuggestions : patientSuggestions;

  if (!showSuggestions) return null;

  return (
    <div className="px-4 pb-3">
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="p-3 text-left bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm font-light text-gray-700 hover:text-gray-900 flex justify-center items-center"
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
};

const Dobbe = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Dobbe, your AI assistant for scheduling doctor appointments. I can help you book appointments, check doctor availability, and manage your medical visits. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    console.log('useEffect fired');
    fetch(`${import.meta.env.VITE_API_URL}me`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUser(data.user);
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide suggestions after first user message
  useEffect(() => {
    if (messages.length > 1 && messages.some(msg => msg.sender === 'user')) {
      setShowSuggestions(false);
    }
  }, [messages]);

  // NEW: Real API call
  const fetchBotResponse = async (userMessage) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.response || "Sorry, I didn't get that.";
    } catch (err) {
      return "Sorry, I'm having trouble reaching the server.";
    }
  };

  function logoutUser() {
    try{
      window.location.href = `${import.meta.env.VITE_API_URL}/logout`;
    }catch(err){
      console.log(err);
    }
  }

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Real API call
    const botReply = await fetchBotResponse(textToSend);

    const botMessage = {
      id: messages.length + 2,
      text: botReply,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestionText) => {
    handleSendMessage(suggestionText);
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 flex flex-col font-inter">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dobbe</h1>
              <p className="text-sm text-gray-500">AI Medical Assistant</p>
            </div>
          </div>
          <div className="flex space-x-3">
            {user ? (
              <Link onClick={logoutUser} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sign Out
            </Link>):(
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Sign In
          </Link>)}
            <div className="px-4 py-2 bg-slate-100 rounded-xl text-sm font-medium text-gray-700">
              {user ? `${user.name}` : "Guest"}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Queries positioned above input */}
        <SuggestionQueries 
          onSuggestionClick={handleSuggestionClick} 
          user={user}
          showSuggestions={showSuggestions}
        />

        {/* Input Area */}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={() => handleSendMessage()}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Dobbe;