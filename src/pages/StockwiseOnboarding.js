import React, { useState, useEffect } from 'react';
import { ChevronRight, Car, ArrowRight, Calendar, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Main App Component
const StockwiseOnboarding = () => {
  const navigate = useNavigate();

  // State management
  const [currentScreen, setCurrentScreen] = useState(0);
  const [amount, setAmount] = useState(3500000);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [hoverState, setHoverState] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState(200);
  const [years, setYears] = useState(10);
  const [interestRate, setInterestRate] = useState(12);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('next');
  
  // Sample transaction data
  const transactions = [
    { id: 1, date: '22 Mar', desc: 'Swiggy - Dinner', amount: -210, category: 'Food', highlight: true },
    { id: 2, date: '21 Mar', desc: 'Phone Recharge', amount: -499, category: 'Utility' },
    { id: 3, date: '21 Mar', desc: 'Swiggy - Lunch', amount: -180, category: 'Food', highlight: true },
    { id: 4, date: '20 Mar', desc: 'Bus Fare', amount: -50, category: 'Transport' },
    { id: 5, date: '20 Mar', desc: 'Swiggy - Dinner', amount: -230, category: 'Food', highlight: true },
    { id: 6, date: '19 Mar', desc: 'Movie Tickets', amount: -350, category: 'Entertainment' },
    { id: 7, date: '19 Mar', desc: 'Swiggy - Lunch', amount: -190, category: 'Food', highlight: true },
    { id: 8, date: '18 Mar', desc: 'Phone Bill', amount: -499, category: 'Utilities' },
    { id: 9, date: '18 Mar', desc: 'Swiggy - Breakfast', amount: -150, category: 'Food', highlight: true },
    { id: 10, date: '17 Mar', desc: 'Netflix', amount: -649, category: 'Entertainment' },
  ];
  
  // Constants
  const totalScreens = 5;
  const progressPercentage = ((currentScreen) / (totalScreens - 1)) * 100;

  // Investment calculation function
  const calculateGrowth = (monthly, years, rate) => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    let data = [];
    let total = 0;
    
    for (let i = 0; i <= months; i += 12) {
      let investedAmount = monthly * i;
      let interestEarned = total - investedAmount;
      
      data.push({
        year: i / 12,
        total: Math.round(total),
        invested: investedAmount,
        interest: Math.round(interestEarned)
      });
      
      for (let j = 0; j < 12 && i + j < months; j++) {
        total = (total + monthly) * (1 + monthlyRate);
      }
    }
    
    return data;
  };

  // Calculate growth data based on current parameters
  const growthData = calculateGrowth(investmentAmount * 30, years, interestRate);

  // Helper function to format currency values
  const formatCurrency = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value}`;
  };

  // Navigation functions with transition
  const nextScreen = () => {
    if (currentScreen < totalScreens - 1) {
      setTransitionDirection('next');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen(prev => Math.min(prev + 1, totalScreens - 1));
        setIsTransitioning(false);
      }, 300);
    }
  };

  const prevScreen = () => {
    if (currentScreen > 0) {
      setTransitionDirection('prev');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen(prev => Math.max(prev - 1, 0));
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Animation effect for transaction analysis
  useEffect(() => {
    if (currentScreen === 3) {
      // Quick initial transition to skeletons
      const timer1 = setTimeout(() => setAnalyzeStep(1), 660);
      // Show transactions being processed
      const timer2 = setTimeout(() => setAnalyzeStep(2), 2520);
      // Final insight generation
      const timer3 = setTimeout(() => setAnalyzeStep(3), 4560);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [currentScreen]);

  // Button Component
  const NeopopButton = ({ onClick, children, className, primary = false, size = "default" }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    
    const sizeClasses = {
      small: "py-3 px-6 text-lg",
      default: "py-5 px-8 text-xl",
      large: "py-6 px-10 text-2xl"
    };
    
    const baseClasses = `relative overflow-hidden transition-all duration-200 font-bold rounded-lg flex items-center justify-center ${sizeClasses[size]}`;
    const primaryClasses = primary ? "bg-purple-600 text-white" : "bg-black text-white";
    
    const buttonStyle = {
      transform: isPressed 
        ? 'translate(2px, 2px)'
        : isHovered
          ? 'translate(-2px, -2px)'
          : 'translate(0, 0)',
      boxShadow: isPressed
        ? '2px 2px 0 rgba(0,0,0,0.8)'
        : isHovered
          ? '6px 6px 0 rgba(0,0,0,0.8)'
          : '4px 4px 0 rgba(0,0,0,0.8)',
      transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    };
    
    return (
      <button 
        className={`${baseClasses} ${primaryClasses} ${className}`}
        style={buttonStyle}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {setIsHovered(false); setIsPressed(false);}}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        {children}
        {isHovered && (
          <span className="absolute inset-0 bg-white opacity-10 transition-opacity duration-300"></span>
        )}
      </button>
    );
  };

  // Custom car icons
  const ToyotaFortunerIcon = ({ className = "" }) => (
    <svg 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"/>
    </svg>
  );

  const FerrariIcon = ({ className = "" }) => (
    <svg 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M496 400.08c0-5.52-4.48-10-10-10h-18.33c-1.79-5.12-4.08-10.03-6.82-14.69l12.95-12.95c3.91-3.91 3.91-10.24 0-14.14-3.91-3.91-10.24-3.91-14.14 0l-12.95 12.95c-4.66-2.74-9.57-5.03-14.69-6.82V336.1c0-5.52-4.48-10-10-10s-10 4.48-10 10v18.33c-5.12 1.79-10.03 4.08-14.69 6.82l-12.95-12.95c-3.91-3.91-10.24-3.91-14.14 0-3.91 3.91-3.91 10.24 0 14.14l12.95 12.95c-2.74 4.66-5.03 9.57-6.82 14.69H368.1c-5.52 0-10 4.48-10 10s4.48 10 10 10h18.33c1.79 5.12 4.08 10.03 6.82 14.69l-12.95 12.95c-3.91 3.91-3.91 10.24 0 14.14 1.95 1.95 4.51 2.93 7.07 2.93s5.12-.98 7.07-2.93l12.95-12.95c4.66 2.74 9.57 5.03 14.69 6.82v18.33c0 5.52 4.48 10 10 10s10-4.48 10-10v-18.33c5.12-1.79 10.03-4.08 14.69-6.82l12.95 12.95c1.95 1.95 4.51 2.93 7.07 2.93s5.12-.98 7.07-2.93c3.91-3.91 3.91-10.24 0-14.14l-12.95-12.95c2.74-4.66 5.03-9.57 6.82-14.69H486c5.52 0 10-4.48 10-10zm-90-60c-33.09 0-60 26.91-60 60s26.91 60 60 60 60-26.91 60-60-26.91-60-60-60zm0 100c-22.06 0-40-17.94-40-40s17.94-40 40-40 40 17.94 40 40-17.94 40-40 40z"/>
      <path d="M390.42 104.43L371.57 85.6c-3.91-3.91-10.24-3.91-14.14 0s-3.91 10.24 0 14.14l18.85 18.83c1.95 1.95 4.51 2.93 7.07 2.93s5.12-.98 7.07-2.93c3.91-3.91 3.91-10.24 0-14.14z"/>
      <path d="M390.42 247.57c-3.91-3.91-10.24-3.91-14.14 0l-18.85 18.83c-3.91 3.91-3.91 10.24 0 14.14 1.95 1.95 4.51 2.93 7.07 2.93s5.12-.98 7.07-2.93l18.85-18.83c3.91-3.91 3.91-10.24 0-14.14z"/>
      <path d="M462.42 175.57L443.57 156.7c-3.91-3.91-10.24-3.91-14.14 0s-3.91 10.24 0 14.14l18.85 18.83c1.95 1.95 4.51 2.93 7.07 2.93s5.12-.98 7.07-2.93c3.91-3.91 3.91-10.24 0-14.14z"/>
    </svg>
  );

  // Define all screens in the app
  const screens = [
    // Screen 1: Welcome
    <div className="min-h-[calc(100vh-2rem)] flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center py-8">
          <h1 className="text-7xl font-bold mb-10">stock<span className="text-purple-600">wise</span></h1>
          <p className="text-2xl mb-16 leading-relaxed">Ready to turn ₹100 into your dream car?<br/>Let's make it happen together!</p>
          
          <div className="mb-10 w-64 mx-auto">
            <NeopopButton onClick={nextScreen} size="large">
              Let's do this! <ChevronRight className="ml-2" />
            </NeopopButton>
          </div>
          
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 border-2 border-black bg-yellow-100 py-2 px-4 rounded-lg">
              <span className="text-sm font-medium">Made for BITS Goa Hackathon 💪</span>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Screen 2: Goal Selection
    <div className="min-h-[calc(100vh-2rem)] flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto py-8">
          <h2 className="text-4xl font-bold mb-12 text-center">What are you dreaming of, friend?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div 
              onClick={() => { nextScreen(); }} 
              onMouseEnter={() => setHoverState('car')}
              onMouseLeave={() => setHoverState(null)}
              className={`relative flex flex-col items-center justify-center p-8 rounded-xl border-4 border-black bg-white cursor-pointer transition-all duration-300 ${
                hoverState === 'car' ? 'transform -translate-y-2 translate-x-2 shadow-[8px_8px_0px_rgba(0,0,0,0.8)]' : 'shadow-[4px_4px_0px_rgba(0,0,0,0.8)]'
              }`}
            >
              <ToyotaFortunerIcon className={`w-48 h-48 ${hoverState === 'car' ? 'text-purple-600 transform scale-110 transition-all duration-300' : 'text-black transition-all duration-300'}`} />
              <span className="mt-6 text-2xl font-bold">Toyota Fortuner</span>
              <span className="mt-2 text-gray-600">₹35,00,000</span>
              {hoverState === 'car' && (
                <span className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold py-1 px-2 rounded">
                  TOP PICK
                </span>
              )}
            </div>
            
            <div 
              className="relative flex flex-col items-center justify-center p-8 rounded-xl border-4 border-gray-300 bg-white cursor-not-allowed opacity-60 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
            >
              <FerrariIcon className="w-48 h-48 text-gray-400" />
              <span className="mt-6 text-2xl font-bold text-gray-400">Ferrari</span>
              <span className="mt-2 text-gray-500">₹4,00,00,000</span>
              <span className="absolute top-4 right-4 bg-gray-500 text-white text-xs font-bold py-1 px-2 rounded">
                COMING SOON
              </span>
            </div>
          </div>
          
          <p className="text-center text-lg text-gray-600 max-w-xl mx-auto">
            Your daily habits can actually make your dreams come true faster than you think!
          </p>
        </div>
      </div>
    </div>,

    // Screen 3: Goal Amount
    <div className="min-h-[calc(100vh-2rem)] flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto py-8">
          <h2 className="text-4xl font-bold mb-10 text-center">Toyota Fortuner Details 🚙</h2>
          
          <div className="grid gap-8 mb-12">
            {/* Car Details Card */}
            <div className="relative border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
              <div className="w-full bg-gradient-to-br from-purple-100 to-purple-50 p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ToyotaFortunerIcon className="w-48 h-48 text-black" />
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-2">Toyota Fortuner</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>• 2.8L Diesel Engine</p>
                      <p>• 7-Seater Luxury SUV</p>
                      <p>• 4x4 Available</p>
                    </div>
                    <div className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">
                      On-Road Price: ₹35,00,000
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Down Payment Section */}
            <div className="bg-white p-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold">Your Down Payment</span>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">Target:</span>
                  <span className="text-2xl font-mono bg-purple-100 px-4 py-2 rounded-lg border-2 border-purple-200 font-bold text-purple-600">
                    {(amount/100000).toFixed(1)}L
                  </span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="range"
                    min={1000000}
                    max={3500000}
                    step={100000}
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="w-full h-3 appearance-none bg-gray-200 rounded-full cursor-pointer 
                              focus:outline-none focus:ring-2 focus:ring-purple-600"
                    style={{
                      backgroundImage: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${((amount - 1000000) / 2500000) * 100}%, #E5E7EB ${((amount - 1000000) / 2500000) * 100}%, #E5E7EB 100%)`,
                    }}
                  />
                  <div className="flex justify-between mt-4 text-sm font-medium">
                    <div className="text-center">
                      <div className="text-gray-500">Min Down Payment</div>
                      <div className="text-lg font-bold">₹10L</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500">Full Amount</div>
                      <div className="text-lg font-bold">₹35L</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Car Price</div>
                      <div className="text-lg font-bold">₹35,00,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Your Down Payment</div>
                      <div className="text-lg font-bold text-purple-600">₹{(amount/100000).toFixed(1)}L</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Loan Amount</div>
                      <div className="text-lg font-bold text-gray-700">₹{((3500000 - amount)/100000).toFixed(1)}L</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <NeopopButton onClick={nextScreen} primary className="mb-4">
              Let's check my spending! <ChevronRight className="ml-2" />
            </NeopopButton>
            <p className="text-gray-600 text-center">
              We'll help you save for the down payment through smart investments
            </p>
          </div>
        </div>
      </div>
    </div>,

    // Screen 4: Transaction Analysis
    <div className="flex flex-col h-full justify-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center">Let's see where your money goes... 🕵️</h2>
        
        <div className="relative border-4 border-black p-6 rounded-xl bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
          {analyzeStep < 3 ? (
            <div className="flex flex-col">
              {/* Initial loading state - skeletons immediately */}
              {analyzeStep === 0 && (
                <div className="transition-opacity duration-500 opacity-100">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold">Your Recent Spending</h3>
                    <div className="animate-pulse flex items-center">
                      <RefreshCw size={14} className="mr-2" />
                      <span className="text-sm">Connecting...</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200">
                    {[...Array(5)].map((_, index) => (
                      <div 
                        key={index}
                        className="py-3 px-2 border-b border-gray-200 flex justify-between animate-pulse"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Transactions loaded, analyzing patterns */}
              {analyzeStep >= 1 && (
                <div className={`transition-opacity duration-500 ${analyzeStep === 1 ? 'opacity-100' : analyzeStep === 2 ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold">Your Recent Spending</h3>
                    <div className="flex items-center">
                      {analyzeStep === 1 ? (
                        <div className="flex items-center text-purple-600">
                          <RefreshCw size={14} className="mr-2 animate-spin" />
                          <span className="text-sm">Finding patterns...</span>
                        </div>
                      ) : analyzeStep === 2 ? (
                        <div className="flex items-center text-purple-600">
                          <RefreshCw size={14} className="mr-2" />
                          <span className="text-sm">Analyzing frequency...</span>
                        </div>
                      ) : (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">COMPLETED</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200">
                    {transactions.map((tx, index) => {
                      const isHighlighted = analyzeStep >= 2 && tx.highlight;
                      const isFaded = analyzeStep >= 2 && !tx.highlight;
                      
                      return (
                        <div 
                          key={tx.id}
                          className={`py-3 px-2 border-b border-gray-200 flex justify-between transition-all duration-500 ${
                            isHighlighted ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                          } ${
                            isFaded ? 'opacity-30' : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors duration-500 ${
                              isHighlighted ? 'bg-purple-100' : 'bg-gray-100'
                            }`}>
                              {isHighlighted ? 
                                <FoodIcon size={16} className="text-purple-600 transition-all duration-500" /> : 
                                <span className="text-xs text-gray-500">{tx.category.charAt(0)}</span>
                              }
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {tx.desc}
                                {isHighlighted && analyzeStep >= 2 && (
                                  <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded transition-opacity duration-500">
                                    FREQUENT
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <Calendar size={10} className="mr-1" />
                                {tx.date}
                              </div>
                            </div>
                          </div>
                          <div className={`font-mono font-medium text-sm ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {analyzeStep === 2 && (
                    <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg transition-opacity duration-500">
                      <div className="flex items-center">
                        <RefreshCw size={14} className="mr-2 text-purple-600 animate-spin" />
                        <p className="text-sm text-purple-600 font-medium">Isolating Swiggy transactions and calculating totals...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Final insight */}
              {analyzeStep === 3 && (
                <div className="transition-opacity duration-500 opacity-100">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold">I found something interesting! 💡</h3>
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">INSIGHT</span>
                  </div>
                  
                  <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-lg mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full mr-4 flex-shrink-0">
                        <FoodIcon size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">You spend ₹200 daily on Swiggy!</p>
                        <p className="text-base text-gray-600 mb-3">That adds up to a whopping ₹73,000/year</p>
                        <div className="bg-white rounded p-3 border border-purple-200">
                          <p className="font-medium text-sm">What if you made one meal at home each day?</p>
                          <p className="text-lg font-bold text-purple-600 mt-1">
                            You'd save ₹100/day (₹3,000/month)!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <NeopopButton onClick={nextScreen} primary>
                      Show me how it grows! <ChevronRight className="ml-2" />
                    </NeopopButton>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold">I found something interesting! 💡</h3>
                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">INSIGHT</span>
              </div>
              
              <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full mr-4 flex-shrink-0">
                    <FoodIcon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">You spend ₹200 daily on Swiggy!</p>
                    <p className="text-base text-gray-600 mb-3">That adds up to a whopping ₹73,000/year</p>
                    <div className="bg-white rounded p-3 border border-purple-200">
                      <p className="font-medium text-sm">What if you made one meal at home each day?</p>
                      <p className="text-lg font-bold text-purple-600 mt-1">
                        You'd save ₹100/day (₹3,000/month)!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <NeopopButton onClick={nextScreen} primary>
                  Show me how it grows! <ChevronRight className="ml-2" />
                </NeopopButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,

    // Screen 5: Investment Growth Visualization
    <div className="min-h-[calc(100vh-2rem)]">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <h2 className="text-4xl font-bold mb-10 text-center">Your Path to the Toyota Fortuner 🚙</h2>
          
          {/* Interactive Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border-4 border-black rounded-xl bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">Daily Savings</p>
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => setInvestmentAmount(Math.max(100, investmentAmount - 50))}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[100px]">₹{investmentAmount}</span>
                  <button 
                    onClick={() => setInvestmentAmount(Math.min(500, investmentAmount + 50))}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">Instead of ordering out</p>
              </div>
            </div>
            
            <div className="p-6 border-4 border-black rounded-xl bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">Investment Period</p>
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => setYears(Math.max(1, years - 1))}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[100px]">{years} yrs</span>
                  <button 
                    onClick={() => setYears(Math.min(10, years + 1))}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">Time to reach your goal</p>
              </div>
            </div>
            
            <div className="p-6 border-4 border-black rounded-xl bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">Expected Returns</p>
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => setInterestRate(Math.max(8, interestRate - 1))}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[100px]">{interestRate}%</span>
                  <button 
                    onClick={() => setInterestRate(Math.min(15, interestRate + 1))}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">Annual return rate</p>
              </div>
            </div>
          </div>
          
          {/* Graph and Stats */}
          <div className="border-4 border-black rounded-xl bg-white p-6 mb-8 shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-medium">
                Target Amount: <span className="font-bold text-purple-600">{formatCurrency(amount)}</span>
              </div>
              <div className="text-lg font-medium">
                Time to Goal: <span className="font-bold text-purple-600">{years} years</span>
              </div>
            </div>
            
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={growthData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(value) => `Year ${value}`}
                    contentStyle={{ fontSize: 14 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#7C3AED" 
                    strokeWidth={3} 
                    dot={{ stroke: '#7C3AED', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Total Value"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="invested" 
                    stroke="#9CA3AF" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={{ stroke: '#9CA3AF', strokeWidth: 2, r: 3 }}
                    name="Amount Invested"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-purple-600 mr-3"></div>
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-lg font-bold">{formatCurrency(growthData[growthData.length-1].total)}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-gray-400 mr-3"></div>
                <div>
                  <p className="text-sm text-gray-600">Amount Invested</p>
                  <p className="text-lg font-bold">{formatCurrency(growthData[growthData.length-1].invested)}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                <div>
                  <p className="text-sm text-gray-600">Returns Earned</p>
                  <p className="text-lg font-bold">{formatCurrency(growthData[growthData.length-1].interest)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black text-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">Progress towards Down Payment</span>
                <span className="text-xl font-bold">{Math.min(100, Math.round((growthData[growthData.length-1].total/amount) * 100))}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (growthData[growthData.length-1].total/amount) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Learning CTA Section */}
          <div className="border-4 border-black rounded-xl bg-gradient-to-br from-purple-50 to-white p-8 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
            <h3 className="text-4xl font-bold mb-4">Ready to make this a reality? 🎯</h3>
            <p className="text-xl text-gray-600 mb-8">
              Your daily savings could grow into your dream car's down payment. Let's learn how to make it happen!
            </p>
            <div className="flex flex-col items-center space-y-4">
              <NeopopButton 
                onClick={() => navigate('/learn')} 
                primary
                className="w-full max-w-md py-6 px-8 text-xl"
              >
                Start Learning Now <ArrowRight className="ml-2 w-6 h-6" />
              </NeopopButton>
              <p className="text-sm text-gray-500">
                Free learning modules • No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ];

  return (
    <div className="font-sans bg-gray-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Step indicator */}
      <div className="fixed top-4 left-4 z-50">
        <div className="flex items-center bg-white py-1 px-3 rounded-full border border-black shadow-[1px_1px_0px_rgba(0,0,0,0.8)]">
          <span className="font-bold text-purple-600 text-sm">{currentScreen + 1}</span>
          <span className="mx-1 text-xs">/</span>
          <span className="font-bold text-sm">{totalScreens}</span>
        </div>
      </div>
      
      {/* Main content area with padding for fixed header */}
      <div className="pt-8">
        {/* Current screen with transition */}
        <div 
          className={`transition-all duration-360 transform ${
            isTransitioning 
              ? transitionDirection === 'next' 
                ? 'opacity-0 translate-x-10' 
                : 'opacity-0 -translate-x-10'
              : 'opacity-100 translate-x-0'
          }`}
        >
          {screens[currentScreen]}
        </div>
      </div>
    </div>
  );
};

// Custom food icon component
const FoodIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 9V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h6m5-1h2a3 3 0 0 0 3-3v-2"/>
    <circle cx="11.5" cy="11.5" r="2.5"/>
    <path d="M11.5 14v4"/>
    <rect x="8" y="18" width="7" height="2" rx="1"/>
  </svg>
);

// Update the style element
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  
  #root {
    min-height: 100vh;
  }
  
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid black;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 0 0 3px #7C3AED;
  }
  
  .screen-transition-enter {
    opacity: 0;
    transform: translateX(10px);
  }
  
  .screen-transition-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 360ms, transform 360ms;
  }
  
  .screen-transition-exit {
    opacity: 1;
    transform: translateX(0);
  }
  
  .screen-transition-exit-active {
    opacity: 0;
    transform: translateX(-10px);
    transition: opacity 360ms, transform 360ms;
  }
  
  .duration-360 {
    transition-duration: 360ms;
  }
`;
document.head.appendChild(style);

export default StockwiseOnboarding; 