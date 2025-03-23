import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';

const FinanceChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi! I\'m Jasper, your finance learning assistant. I can help you understand investment concepts, market trends, and financial planning. What would you like to learn about?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Store API key in a ref to avoid re-renders
  const apiKeyRef = useRef(process.env.REACT_APP_GEMINI_API_KEY || '');

  useEffect(() => {
    // Check if API key is configured
    setIsApiConfigured(!!apiKeyRef.current);
    
    // If API is not configured, add a warning message
    if (!apiKeyRef.current) {
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          content: '⚠️ I\'m currently running in demo mode with limited responses. For full functionality, please configure the API key.'
        }
      ]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced mock response function
  const generateMockResponse = (query) => {
    const queryLower = query.toLowerCase();
    
    // More comprehensive keyword matching
    if (queryLower.includes('invest') || queryLower.includes('stock') || queryLower.includes('market')) {
      return "When investing, it's important to:\n\n1. Diversify your portfolio\n2. Start with index funds for beginners\n3. Understand your risk tolerance\n4. Have a long-term perspective\n5. Regular monitoring and rebalancing";
    } else if (queryLower.includes('budget') || queryLower.includes('save') || queryLower.includes('spending')) {
      return "Here's a practical budgeting approach:\n\n1. Follow the 50/30/20 rule:\n   • 50% for needs\n   • 30% for wants\n   • 20% for savings\n2. Track expenses regularly\n3. Set specific financial goals\n4. Use budgeting apps\n5. Review and adjust monthly";
    } else if (queryLower.includes('retirement') || queryLower.includes('pension')) {
      return "Key retirement planning steps:\n\n1. Start early to benefit from compound interest\n2. Maximize employer match in retirement accounts\n3. Diversify retirement investments\n4. Consider tax implications\n5. Regular portfolio review and rebalancing";
    } else if (queryLower.includes('mutual fund') || queryLower.includes('sip')) {
      return "Understanding Mutual Funds:\n\n1. Types: Equity, Debt, Hybrid\n2. Benefits of SIP:\n   • Rupee cost averaging\n   • Disciplined investing\n   • Power of compounding\n3. Choose funds based on:\n   • Investment goals\n   • Risk tolerance\n   • Time horizon";
    } else {
      return "Here are some general financial tips:\n\n1. Create an emergency fund\n2. Pay off high-interest debt first\n3. Invest in your financial education\n4. Maintain a good credit score\n5. Review your finances regularly\n\nFeel free to ask specific questions about investing, budgeting, or retirement planning!";
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

    // If API is not configured, use mock response
    if (!isApiConfigured) {
      setTimeout(() => {
        const mockResponse = generateMockResponse(userInput);
        setMessages(prev => [...prev, { type: 'bot', content: mockResponse }]);
        setIsLoading(false);
      }, 1000); // Add a small delay to make it feel more natural
      return;
    }

    try {
      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Reduced to 10 seconds
      
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
                    text: `You are Jasper, a friendly and knowledgeable financial advisor. Provide clear, specific, and practical financial advice for the following question. Focus on actionable steps and explain concepts in simple terms. Keep your response concise and well-structured, using bullet points or numbered lists where appropriate.

Question: ${userInput}

Remember to:
- Be clear and specific
- Use simple language
- Provide actionable steps
- Structure your response well
- Keep it concise but informative`
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
      
      // Extract response with better error handling
      let botResponse = '';
      
      try {
        botResponse = result.candidates[0].content.parts[0].text;
      } catch (error) {
        console.warn("Error parsing API response:", error);
        throw new Error("Invalid API response structure");
      }

      if (!botResponse) {
        throw new Error("Empty response from API");
      }

      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: botResponse 
      }]);

    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Different error messages based on error type
      let errorMessage;
      if (error.name === 'AbortError') {
        errorMessage = "I'm taking too long to respond. Let me try a simpler answer.";
      } else if (error.message.includes('HTTP error')) {
        errorMessage = "I'm having trouble connecting to my knowledge base. Let me provide a basic response instead.";
      } else {
        errorMessage = "I encountered an issue processing your question. Let me give you a general response.";
      }
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: errorMessage
      }]);
      
      // Add fallback response after error message
      setTimeout(() => {
        const fallbackResponse = generateMockResponse(userInput);
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: fallbackResponse
        }]);
      }, 1000);
      
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