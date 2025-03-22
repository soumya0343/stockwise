import React, { useState, useEffect } from 'react';
import { ChevronRight, Car, ArrowRight, Calendar, RefreshCw, TrendingUp, Shield } from 'lucide-react';
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
  const [interestRate, setInterestRate] = useState(20);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('next');
  const [selectedGoal, setSelectedGoal] = useState('car');
  
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
  const [growthData, setGrowthData] = useState(calculateGrowth(investmentAmount * 30, years, interestRate));

  // Update growth data when parameters change
  useEffect(() => {
    const newData = calculateGrowth(investmentAmount * 30, years, interestRate);
    setGrowthData(newData);
  }, [investmentAmount, years, interestRate]);

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
      const timer2 = setTimeout(() => setAnalyzeStep(2), 7520);
      // Final insight generation
      const timer3 = setTimeout(() => setAnalyzeStep(3), 11560);
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
    const primaryClasses = primary ? "bg-orange-600 text-white" : "bg-black text-white";
    
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

  // Back Button Component
  const BackButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 flex items-center space-x-2 text-gray-800 hover:text-orange-600 transition-colors z-50 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border-2 border-gray-200"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      <span className="font-medium">Back</span>
    </button>
  );

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
          <h1 className="text-7xl font-bold mb-10">stock<span className="text-orange-600">wise</span></h1>
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
            {/* Dream Car Option */}
            <div 
              className={`relative overflow-hidden rounded-2xl border-4 ${hoverState === 'car' ? 'border-orange-500' : 'border-black'} transition-all duration-300 cursor-pointer`}
              onMouseEnter={() => setHoverState('car')}
              onMouseLeave={() => setHoverState(null)}
              onClick={() => {
                setAmount(3500000);
                setSelectedGoal('car');
                nextScreen();
              }}
            >
              <div className="bg-white p-8">
                <div className="flex items-center justify-between mb-6">
                  <Car className="w-12 h-12" />
                  <ArrowRight className={`w-6 h-6 transform transition-transform duration-300 ${hoverState === 'car' ? 'translate-x-2' : ''}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Dream Car</h3>
                <p className="text-gray-600">Start your journey towards owning your dream car through smart investments.</p>
              </div>
            </div>

            {/* Dream Vacation Option */}
            <div 
              className={`relative overflow-hidden rounded-2xl border-4 ${hoverState === 'vacation' ? 'border-orange-500' : 'border-black'} transition-all duration-300 cursor-pointer`}
              onMouseEnter={() => setHoverState('vacation')}
              onMouseLeave={() => setHoverState(null)}
              onClick={() => {
                setAmount(500000);
                setSelectedGoal('vacation');
                nextScreen();
              }}
            >
              <div className="bg-white p-8">
                <div className="flex items-center justify-between mb-6">
                  <Calendar className="w-12 h-12" />
                  <ArrowRight className={`w-6 h-6 transform transition-transform duration-300 ${hoverState === 'vacation' ? 'translate-x-2' : ''}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Dream Vacation</h3>
                <p className="text-gray-600">Plan your perfect getaway through strategic investment planning.</p>
              </div>
            </div>

            {/* Coming Soon Option */}
            <div className="relative overflow-hidden rounded-2xl border-4 border-gray-300 opacity-60 cursor-not-allowed">
              <div className="bg-white p-8">
                <div className="flex items-center justify-between mb-6">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
                <p className="text-gray-600">More exciting investment goals are on the way!</p>
              </div>
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
          <h2 className="text-4xl font-bold mb-10 text-center">
            {selectedGoal === 'car' ? 'Your Dream Car Details 🚙' : 'Your Dream Vacation Details ✈️'}
          </h2>
          
          <div className="grid gap-8 mb-12">
            {/* Details Card */}
            <div className="relative border-4 border-gray-800 rounded-xl overflow-hidden shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
              <div className="w-full bg-gradient-to-br from-orange-100 to-orange-50 p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {selectedGoal === 'car' ? (
                    <Car className="w-48 h-48 text-gray-800" />
                  ) : (
                    <Calendar className="w-48 h-48 text-gray-800" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-2">{selectedGoal === 'car' ? 'Dream Car' : 'Dream Vacation'}</h3>
                    <div className="space-y-2 text-gray-600">
                      {selectedGoal === 'car' ? (
                        <>
                          <p>• Powerful Engine</p>
                          <p>• Luxury Features</p>
                          <p>• Premium Experience</p>
                        </>
                      ) : (
                        <>
                          <p>• Exotic Destinations</p>
                          <p>• Luxury Accommodations</p>
                          <p>• Unforgettable Experiences</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Price Selection Section */}
            <div className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold">
                  {selectedGoal === 'car' ? 'Set Your Dream Car Price' : 'Set Your Dream Vacation Budget'}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">Target:</span>
                  <span className="text-2xl font-mono bg-orange-100 px-4 py-2 rounded-lg border-2 border-orange-200 font-bold text-orange-600">
                    {(amount/100000).toFixed(1)}L
                  </span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="range"
                    min={selectedGoal === 'car' ? 500000 : 100000}
                    max={selectedGoal === 'car' ? 25000000 : 2000000}
                    step={selectedGoal === 'car' ? 100000 : 50000}
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="w-full h-3 appearance-none bg-gray-200 rounded-full cursor-pointer 
                              focus:outline-none focus:ring-2 focus:ring-orange-600"
                    style={{
                      backgroundImage: `linear-gradient(to right, #F97316 0%, #F97316 ${((amount - (selectedGoal === 'car' ? 500000 : 100000)) / (selectedGoal === 'car' ? 24500000 : 1900000)) * 100}%, #E5E7EB ${((amount - (selectedGoal === 'car' ? 500000 : 100000)) / (selectedGoal === 'car' ? 24500000 : 1900000)) * 100}%, #E5E7EB 100%)`,
                    }}
                  />
                  <div className="flex justify-between mt-4 text-sm font-medium">
                    <div className="text-center">
                      <div className="text-gray-500">Min {selectedGoal === 'car' ? 'Price' : 'Budget'}</div>
                      <div className="text-lg font-bold">{selectedGoal === 'car' ? '₹5L' : '₹1L'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500">Max {selectedGoal === 'car' ? 'Price' : 'Budget'}</div>
                      <div className="text-lg font-bold">{selectedGoal === 'car' ? '₹2.5Cr' : '₹20L'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">
                        {selectedGoal === 'car' ? 'Your Dream Car Price' : 'Your Dream Vacation Budget'}
                      </div>
                      <div className="text-lg font-bold text-orange-600">₹{(amount/100000).toFixed(1)}L</div>
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
              We'll help you save for your {selectedGoal === 'car' ? 'dream car' : 'dream vacation'} through smart investments
            </p>
          </div>
        </div>
      </div>
    </div>,

    // Screen 4: Transaction Analysis
    <div className="flex flex-col h-full justify-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center">Let's see where your money goes... 🕵️</h2>
        
        <div className="relative border-4 border-gray-800 p-6 rounded-xl bg-white shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
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
                        <div className="flex items-center text-orange-600">
                          <RefreshCw size={14} className="mr-2 animate-spin" />
                          <span className="text-sm">Finding patterns...</span>
                        </div>
                      ) : analyzeStep === 2 ? (
                        <div className="flex items-center text-orange-600">
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
                            isHighlighted ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                          } ${
                            isFaded ? 'opacity-30' : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors duration-500 ${
                              isHighlighted ? 'bg-orange-100' : 'bg-gray-100'
                            }`}>
                              {isHighlighted ? 
                                <FoodIcon size={16} className="text-orange-600 transition-all duration-500" /> : 
                                <span className="text-xs text-gray-500">{tx.category.charAt(0)}</span>
                              }
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {tx.desc}
                                {isHighlighted && analyzeStep >= 2 && (
                                  <span className="ml-2 text-xs bg-orange-600 text-white px-2 py-0.5 rounded transition-opacity duration-500">
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
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg transition-opacity duration-500">
                      <div className="flex items-center">
                        <RefreshCw size={14} className="mr-2 text-orange-600 animate-spin" />
                        <p className="text-sm text-orange-600 font-medium">Isolating Swiggy transactions and calculating totals...</p>
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
                    <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">INSIGHT</span>
                  </div>
                  
                  <div className="p-5 bg-orange-50 border-2 border-orange-200 rounded-lg mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full mr-4 flex-shrink-0">
                        <FoodIcon size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">You spend ₹200 daily on Swiggy!</p>
                        <p className="text-base text-gray-600 mb-3">That adds up to a whopping ₹73,000/year</p>
                        <div className="bg-white rounded p-3 border border-orange-200">
                          <p className="font-medium text-sm">What if you made one meal at home each day?</p>
                          <p className="text-lg font-bold text-orange-600 mt-1">
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
                <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">INSIGHT</span>
              </div>
              
              <div className="p-5 bg-orange-50 border-2 border-orange-200 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full mr-4 flex-shrink-0">
                    <FoodIcon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">You spend ₹200 daily on Swiggy!</p>
                    <p className="text-base text-gray-600 mb-3">That adds up to a whopping ₹73,000/year</p>
                    <div className="bg-white rounded p-3 border border-orange-200">
                      <p className="font-medium text-sm">What if you made one meal at home each day?</p>
                      <p className="text-lg font-bold text-orange-600 mt-1">
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
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold">
              {selectedGoal === 'car' ? 'Your Path to the Dream Car 🎯' : 'Your Path to the Dream Vacation ✈️'}
            </h2>
            <NeopopButton 
              onClick={() => navigate('/learn')} 
              primary
              className="py-4 px-6 text-lg"
            >
              Start Investing <ArrowRight className="ml-2 w-5 h-5" />
            </NeopopButton>
          </div>
          
          {/* Interactive Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border-4 border-gray-800 rounded-xl bg-white shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
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
                <p className="text-sm text-gray-500 mt-4">
                  {selectedGoal === 'car' ? 'Instead of ordering out' : 'From daily expenses'}
                </p>
              </div>
            </div>
            
            <div className="p-6 border-4 border-gray-800 rounded-xl bg-white shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">Investment Period</p>
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => {
                      const newYears = Math.max(1, years - 1);
                      setYears(newYears);
                      const newData = calculateGrowth(investmentAmount * 30, newYears, interestRate);
                      setGrowthData(newData);
                    }}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[100px]">{years} yrs</span>
                  <button 
                    onClick={() => {
                      const newYears = Math.min(30, years + 1);
                      setYears(newYears);
                      const newData = calculateGrowth(investmentAmount * 30, newYears, interestRate);
                      setGrowthData(newData);
                    }}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">Time to reach your goal</p>
              </div>
            </div>

            <div className="p-6 border-4 border-gray-800 rounded-xl bg-white shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">Expected Returns</p>
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => {
                      const newRate = Math.max(0, interestRate - 20);
                      setInterestRate(newRate);
                      const newData = calculateGrowth(investmentAmount * 30, years, newRate);
                      setGrowthData(newData);
                    }}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[100px]">{interestRate}%</span>
                  <button 
                    onClick={() => {
                      const newRate = Math.min(100, interestRate + 20);
                      setInterestRate(newRate);
                      const newData = calculateGrowth(investmentAmount * 30, years, newRate);
                      setGrowthData(newData);
                    }}
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
          <div className="border-4 border-gray-800 rounded-xl bg-white p-6 mb-8 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-medium">
                Target Amount: <span className="font-bold text-orange-600">{formatCurrency(amount)}</span>
              </div>
              <div className="text-lg font-medium">
                Time to Goal: <span className="font-bold text-orange-600">{years} years</span>
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
                    stroke="#F97316" 
                    strokeWidth={3} 
                    dot={{ stroke: '#F97316', strokeWidth: 2, r: 4 }}
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
              <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-orange-600 mr-3"></div>
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

            <div className="bg-gray-800 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">Progress towards Goal</span>
                <span className="text-xl font-bold">{Math.min(100, Math.round((growthData[growthData.length-1].total/amount) * 100))}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (growthData[growthData.length-1].total/amount) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Learning CTA Section */}
          <div className="border-4 border-gray-800 rounded-xl bg-gradient-to-br from-orange-50 to-white p-8 text-center shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
            <h3 className="text-4xl font-bold mb-4">Ready to make this a reality? 🎯</h3>
            <p className="text-xl text-gray-600 mb-8">
              Your daily savings could grow into your {selectedGoal === 'car' ? 'dream car' : 'dream vacation'}. Let's learn how to make it happen!
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
    </div>,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50">
      {currentScreen > 0 && <BackButton onClick={prevScreen} />}
      <div className="h-screen flex">
        {/* Progress Steps - Moved to left side */}
        <div className="fixed left-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
          {screens.map((screen, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentScreen === index ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < screens.length - 1 && (
                <div className={`h-24 w-1 ml-4 ${
                  currentScreen > index ? 'bg-orange-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            {screens[currentScreen]}
          </div>
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
    border: 2px solid #1F2937;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 0 0 3px #F97316;
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