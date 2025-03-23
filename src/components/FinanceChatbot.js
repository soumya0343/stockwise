import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';

const FinanceChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi! I\'m your finance learning assistant. I can help you understand investment concepts, market trends, and financial planning. What would you like to learn about?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Store API key in a ref to avoid re-renders
  const apiKeyRef = useRef(process.env.REACT_APP_GEMINI_API_KEY || '');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock response function for fallback when API fails
  const generateMockResponse = (query) => {
    // Simple keyword-based fallback responses
    if (query.toLowerCase().includes('invest')) {
      return "When investing, consider diversifying your portfolio across different asset classes to manage risk. Start with low-cost index funds if you're a beginner.";
    } else if (query.toLowerCase().includes('budget')) {
      return "Creating a budget starts with tracking your income and expenses. Try the 50/30/20 rule: 50% on needs, 30% on wants, and 20% on savings and debt repayment.";
    } else if (query.toLowerCase().includes('retirement')) {
      return "For retirement planning, take advantage of tax-advantaged accounts like 401(k)s and IRAs. Aim to save at least 15% of your income for retirement.";
    } else {
      return "That's an interesting finance question. A good approach would be to research reliable sources like financial education websites, speak with a certified financial planner, or check resources from consumer financial protection agencies.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userInput = input;
    setMessages(prev => [...prev, { type: 'user', content: userInput }]);
    setInput('');
    setIsLoading(true);

    // Validate API key
    if (!apiKeyRef.current) {
      console.error("Missing API key");
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'API configuration is missing. Please check your environment variables.'
      }]);
      setIsLoading(false);
      return;
    }

    try {
      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKeyRef.current}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a professional financial advisor. Please provide clear, specific, and practical financial advice for the following question. Focus on actionable steps and explain concepts in simple terms.

Question: ${userInput}

Please provide your response in a concise and structured manner.`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 800,
            }
          }),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Extract response from Gemini API structure
      let botResponse;
      
      if (result.candidates && 
          result.candidates[0] && 
          result.candidates[0].content && 
          result.candidates[0].content.parts && 
          result.candidates[0].content.parts[0] && 
          result.candidates[0].content.parts[0].text) {
        botResponse = result.candidates[0].content.parts[0].text;
      } else {
        // Fallback to mock response if API data structure is unexpected
        console.warn("Unexpected API response structure:", result);
        botResponse = generateMockResponse(userInput);
      }

      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: botResponse 
      }]);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Provide a fallback response instead of an error message
      const fallbackResponse = generateMockResponse(userInput);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: fallbackResponse
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Avatar Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 transition-colors duration-200 z-50"
      >
        <Bot className="w-8 h-8 text-white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-[600px] border-4 border-gray-800 rounded-xl bg-white shadow-[4px_4px_0px_rgba(31,41,55,0.8)] overflow-hidden z-50">
          {/* Chat Header */}
          <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-bold">Finance Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start">
                    {message.type === 'bot' && (
                      <Bot className="w-5 h-5 mr-2 mt-1 text-orange-600 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-5 h-5 mr-2 mt-1 text-white flex-shrink-0" />
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about finance..."
                className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-600"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`bg-orange-600 text-white rounded-lg px-4 py-2 flex items-center justify-center ${
                  isLoading || !input.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-orange-700'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default FinanceChatbot;