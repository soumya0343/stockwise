import React, { useState, useEffect } from 'react';
import { ChevronRight, Coffee, Car, CreditCard, ArrowRight } from 'lucide-react';

const StockwiseOnboarding = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState(6000000);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [showCoffeeAnalysis, setShowCoffeeAnalysis] = useState(false);
  const [coffeeAnimation, setCoffeeAnimation] = useState(false);

  // Handle screen transitions with timeouts for demo purposes
  useEffect(() => {
    if (currentScreen === 3) {
      const timer = setTimeout(() => {
        setShowCoffeeAnalysis(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    if (currentScreen === 4 && !coffeeAnimation) {
      const timer = setTimeout(() => {
        setCoffeeAnimation(true);
        setTimeout(() => setAnimateProgress(true), 1000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, coffeeAnimation]);

  const nextScreen = () => {
    setCurrentScreen(prev => prev + 1);
  };

  const screens = [
    // Screen 1: Welcome
    <div className="flex flex-col h-full justify-between">
      <div>
        <h1 className="text-6xl font-bold mb-4">stock<span className="text-orange-500">wise</span></h1>
        <p className="text-2xl mt-8">Your first ₹100 today.<br/>Your first crore tomorrow.</p>
      </div>
      <button 
        onClick={nextScreen} 
        className="mt-12 w-full py-6 bg-black text-white text-xl font-bold rounded-xl flex items-center justify-center transform transition hover:translate-y-1 hover:shadow-neo"
      >
        Let's get started <ChevronRight className="ml-2" />
      </button>
    </div>,

    // Screen 2: Goal Selection
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">What's your big goal?</h2>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div 
          onClick={() => {
            setGoal('car');
            nextScreen();
          }} 
          className={`flex flex-col items-center justify-center p-8 rounded-xl border-4 border-black bg-white cursor-pointer transform transition hover:translate-y-1 hover:shadow-neo ${goal === 'car' ? 'border-orange-500 shadow-neo-orange' : ''}`}
        >
          <Car size={64} />
          <span className="mt-4 text-xl font-bold">Sports Car</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-8 rounded-xl border-4 border-black bg-white cursor-pointer opacity-50">
          <CreditCard size={64} />
          <span className="mt-4 text-xl font-bold">Other Goals</span>
        </div>
      </div>
      
      <p className="mt-8 text-gray-600">Select your dream purchase to see how small savings can help you get there.</p>
    </div>,

    // Screen 3: Goal Amount
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">Your Porsche 911</h2>
      
      <div className="relative mt-4 mb-8">
        <div className="w-full h-56 bg-gray-200 rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">₹{(amount/100000).toFixed(1)} Lakhs</span>
          </div>
        </div>
      </div>
      
      <input
        type="range"
        min={3000000}
        max={9000000}
        step={500000}
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
        className="w-full h-4 bg-gray-300 rounded-full appearance-none cursor-pointer"
      />
      
      <div className="flex justify-between mt-2 text-sm">
        <span>₹30L</span>
        <span>₹90L</span>
      </div>
      
      <button 
        onClick={nextScreen} 
        className="mt-12 w-full py-6 bg-black text-white text-xl font-bold rounded-xl flex items-center justify-center transform transition hover:translate-y-1 hover:shadow-neo"
      >
        Analyze my spending <ChevronRight className="ml-2" />
      </button>
    </div>,

    // Screen 4: Transaction Analysis
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">Analyzing your spending...</h2>
      
      {!showCoffeeAnalysis ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-black rounded-full animate-spin"></div>
          <p className="mt-8 text-xl">Connecting to your accounts</p>
        </div>
      ) : (
        <div className="flex-1">
          <div className="p-6 rounded-xl border-4 border-black bg-white mb-6">
            <h3 className="text-2xl font-bold mb-4">Found something interesting</h3>
            <div className="flex items-center">
              <Coffee size={40} className="mr-4 text-orange-500" />
              <div>
                <p className="text-xl font-bold">₹20 daily on coffee</p>
                <p className="text-gray-600">That's ₹7,300 per year</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={nextScreen} 
            className="mt-6 w-full py-6 bg-black text-white text-xl font-bold rounded-xl flex items-center justify-center transform transition hover:translate-y-1 hover:shadow-neo"
          >
            Show me the impact <ChevronRight className="ml-2" />
          </button>
        </div>
      )}
    </div>,

    // Screen 5: Coffee to Goal Connection
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">Your coffee habit & your Porsche</h2>
      
      <div className="relative h-64 mb-8 rounded-xl border-4 border-black bg-white overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Car size={100} className={`text-gray-400 transition-all duration-1000 ${coffeeAnimation ? 'text-orange-500 transform scale-110' : ''}`} />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
          <div 
            className={`h-full bg-orange-500 transition-all duration-1500 ease-out ${animateProgress ? 'w-7' : 'w-0'}`}
          ></div>
        </div>
      </div>
      
      <div className="p-4 rounded-xl border-4 border-black bg-white mb-6">
        <p className="text-xl">
          <span className="font-bold">Switching to 1 coffee/day</span> saves you ₹3,650 yearly
        </p>
        <p className={`text-2xl font-bold mt-2 transition-opacity duration-1000 ${animateProgress ? 'opacity-100' : 'opacity-0'}`}>
          That's 3% of your Porsche in 5 years!
        </p>
      </div>
      
      <button 
        onClick={nextScreen} 
        className="mt-6 w-full py-6 bg-orange-500 text-white text-xl font-bold rounded-xl flex items-center justify-center transform transition hover:translate-y-1 hover:shadow-neo-orange"
      >
        Start my journey <ArrowRight className="ml-2" />
      </button>
    </div>,
    
    // Screen 6: Action Screen
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">Start with just ₹100</h2>
      
      <div className="flex items-center justify-between p-6 rounded-xl border-4 border-black bg-white mb-6">
        <div>
          <p className="text-2xl font-bold">Your first investment</p>
          <p className="text-gray-600">Begin your journey today</p>
        </div>
        <span className="text-3xl font-bold">₹100</span>
      </div>
      
      <div className="p-6 rounded-xl border-4 border-orange-500 bg-white mb-6">
        <p className="text-lg">
          <span className="text-orange-500 font-bold">Pro tip:</span> Start with the coffee money from this week!
        </p>
      </div>
      
      <button 
        className="mt-6 w-full py-6 bg-black text-white text-xl font-bold rounded-xl flex items-center justify-center transform transition hover:translate-y-1 hover:shadow-neo"
      >
        Invest now <ArrowRight className="ml-2" />
      </button>
    </div>
  ];

  // Custom styles
  const containerStyle = {
    fontFamily: "'Space Grotesk', sans-serif",
    backgroundColor: "#f7f7f7",
    boxShadow: "8px 8px 0px rgba(0,0,0,0.9)",
    border: "4px solid black",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Welcome to Stockwise</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Your journey to financial literacy starts here. Let's get you set up with your personalized learning path.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {screens.map((_, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentScreen ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < screens.length - 1 && (
                <div className={`w-24 h-1 mx-4 ${
                  index < currentScreen ? 'bg-orange-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
          {screens[currentScreen]}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentScreen > 0 && (
            <button
              onClick={() => setCurrentScreen(prev => prev - 1)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back</span>
            </button>
          )}
          <button
            onClick={nextScreen}
            className={`px-6 py-3 rounded-lg text-white ${
              currentScreen < screens.length - 1
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={currentScreen === screens.length - 1}
          >
            {currentScreen === screens.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add shadow styles
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');
  
  .shadow-neo {
    box-shadow: 4px 4px 0px rgba(0,0,0,0.9);
  }
  
  .shadow-neo-orange {
    box-shadow: 4px 4px 0px rgba(249, 115, 22, 0.9);
  }
`;
document.head.appendChild(style);

export default StockwiseOnboarding;