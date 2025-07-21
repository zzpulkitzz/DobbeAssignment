import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Calendar, Clock, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper: Chat message bubble
const ChatMessage = ({ message }) => (
  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`flex items-start space-x-2 max-w-xs sm:max-w-md md:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-500' : 'bg-slate-700'}`}>
        {message.sender === 'user' ? 
          <User className="w-4 h-4 text-white" /> : 
          <Bot className="w-4 h-4 text-white" />
        }
      </div>
      <div className={`rounded-lg p-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <p className="text-sm whitespace-pre-line">{message.text}</p>
        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  </div>
);

// Helper: Chat input area
const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage, handleKeyPress }) => (
  <div className="p-4 bg-white border-t">
    <div className="flex space-x-2">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask me to schedule an appointment or check doctor availability..."
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
      />
      <button
        onClick={handleSendMessage}
        disabled={!inputMessage.trim()}
        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  </div>
);

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
  const messagesEndRef = useRef(null);

  console.log(user)
  
  useEffect(() => {
    console.log('useEffect fired');
    fetch('http://localhost:8060/me', { credentials: 'include' })
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

  // NEW: Real API call
  const fetchBotResponse = async (userMessage) => {
    try {
      const res = await fetch('http://localhost:8060/ask', {
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
    window.location.href = "http://localhost:8060/logout";
    }catch(err){
      console.log(err);
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Real API call
    const botReply = await fetchBotResponse(inputMessage);

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

  const quickActions = [
    { icon: Calendar, text: "Schedule Appointment", color: "bg-blue-500" },
    { icon: Clock, text: "Check Availability", color: "bg-green-500" },
    { icon: UserCheck, text: "Find Doctor", color: "bg-purple-500" }
  ];

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Dobbe</h1>
              <p className="text-sm text-gray-300">AI Doctor Appointment Assistant</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {user ? (
              <Link onClick={logoutUser} className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              Sign Out
            </Link>):(
            <Link to="/login"  className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            Sign In
          </Link>)}
            <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              {user ? `Hello ${user.name}` : "Guest"}
            </button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
        {/* Quick Actions */}
        <div className="p-4 bg-white border-b">
          <div className="flex space-x-3 overflow-x-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action.text)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                <action.icon className={`w-4 h-4 text-white p-1 rounded ${action.color}`} />
                <span className="text-sm">{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
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

        {/* Input Area */}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Dobbe;