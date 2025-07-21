import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Calendar, Clock, UserCheck, MessageCircle, Stethoscope, FileText } from 'lucide-react';

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

// NEW: Suggestion Queries Component
const SuggestionQueries = ({ onSuggestionClick, user, showSuggestions }) => {
  const patientSuggestions = [
    {
      icon: Calendar,
      text: "Book an appointment with a cardiologist",
      category: "Booking",
      color: "bg-blue-500"
    },
    {
      icon: Clock,
      text: "What are Dr. Smith's available slots this week?",
      category: "Availability",
      color: "bg-green-500"
    },
    {
      icon: UserCheck,
      text: "Find orthopedic doctors near me",
      category: "Search",
      color: "bg-purple-500"
    },
    {
      icon: MessageCircle,
      text: "Reschedule my appointment for tomorrow",
      category: "Manage",
      color: "bg-orange-500"
    },
    {
      icon: FileText,
      text: "Show my upcoming appointments",
      category: "View",
      color: "bg-teal-500"
    },
    {
      icon: Stethoscope,
      text: "I need to see a dermatologist urgently",
      category: "Urgent",
      color: "bg-red-500"
    }
  ];

  const doctorSuggestions = [
    {
      icon: Calendar,
      text: "Show my schedule for today",
      category: "Schedule",
      color: "bg-blue-500"
    },
    {
      icon: FileText,
      text: "Generate appointment summary for this week",
      category: "Reports",
      color: "bg-green-500"
    },
    {
      icon: UserCheck,
      text: "List all my patients for tomorrow",
      category: "Patients",
      color: "bg-purple-500"
    },
    {
      icon: Clock,
      text: "Block my calendar from 2-4 PM today",
      category: "Manage",
      color: "bg-orange-500"
    },
    {
      icon: Stethoscope,
      text: "Show patient medical history for John Doe",
      category: "History",
      color: "bg-teal-500"
    },
    {
      icon: MessageCircle,
      text: "Cancel my 3 PM appointment",
      category: "Cancel",
      color: "bg-red-500"
    }
  ];

  // Determine which suggestions to show based on user type
  const suggestions = user?.type === 'doctor' ? doctorSuggestions : patientSuggestions;
  const userTypeLabel = user?.type === 'doctor' ? 'Doctor' : 'Patient';

  if (!showSuggestions) return null;

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {user ? `${userTypeLabel} Suggestions` : 'Try asking me about:'}
        </h3>
        <p className="text-sm text-gray-600">
          Click on any suggestion below to get started
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-left border border-gray-200"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${suggestion.color}`}>
              <suggestion.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {suggestion.text}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {suggestion.category}
              </p>
            </div>
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
    fetch(`${import.meta.env.VITE_API_URL}/me`, { credentials: 'include' })
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

  // NEW: Handle suggestion click
  const handleSuggestionClick = (suggestionText) => {
    handleSendMessage(suggestionText);
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
              <button onClick={logoutUser} className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              Sign Out
            </button>):(
            <button className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            Sign In
          </button>)}
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
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">Quick Actions</h3>
            {!showSuggestions && (
              <button
                onClick={() => setShowSuggestions(true)}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                Show suggestions
              </button>
            )}
          </div>
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

        {/* NEW: Suggestion Queries */}
        <SuggestionQueries 
          onSuggestionClick={handleSuggestionClick} 
          user={user}
          showSuggestions={showSuggestions}
        />

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
          handleSendMessage={() => handleSendMessage()}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Dobbe;