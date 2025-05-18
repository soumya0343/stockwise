import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, TrendingUp, ArrowRight, DollarSign, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FinanceChatbot from '../components/FinanceChatbot';
import { useGamification } from '../contexts/GamificationContext';
import { XPBar, StreakCounter, DailyGoalProgress, AchievementBadge } from '../components/GamificationElements';
import { ACHIEVEMENTS } from '../contexts/GamificationContext';
import StreakDisplay from '../components/StreakDisplay';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LearnPage = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [showChapterContent, setShowChapterContent] = useState(false);
  const [chapterProgress, setChapterProgress] = useState({});
  const [totalTokens, setTotalTokens] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState({});
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const { user, logout } = useAuth();

  const { 
    addXP, 
    unlockAchievement, 
    completeChapter,
    achievements 
  } = useGamification();

  // Load user progress from database
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const response = await axios.get('/api/user/progress');
        const { completedChapters, chapterProgress, totalTokens } = response.data;
        setCompletedChapters(new Set(completedChapters));
        setChapterProgress(chapterProgress);
        setTotalTokens(totalTokens);
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    fetchUserProgress();
  }, []);

  // Save progress to database whenever completedChapters changes
  useEffect(() => {
    const saveProgress = async () => {
      try {
        await axios.post('/api/user/progress', {
          completedChapters: Array.from(completedChapters),
          chapterProgress,
          totalTokens
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };

    if (completedChapters.size > 0) {
      saveProgress();
    }
  }, [completedChapters, chapterProgress, totalTokens]);

  // Update streak in database
  useEffect(() => {
    const updateStreak = async () => {
      try {
        const response = await axios.get('/api/user/stats');
        const currentStreak = response.data.streak || 0;
        
        if (currentStreak !== 6) {
          await axios.post('/api/user/update-streak', { streak: 6 });
          // Add 50 tokens for the streak
          const streakTokens = 50;
          setTotalTokens(prev => prev + streakTokens);
        }
      } catch (error) {
        console.error('Error updating streak:', error);
      }
    };

    updateStreak();
  }, []);

  // Check achievements
  useEffect(() => {
    const checkAchievements = async () => {
      try {
        // Check First Lesson Achievement
        if (completedChapters.size > 0) {
          await unlockAchievement('FIRST_LESSON');
        }

        // Check Perfect Quiz Achievement
        const hasCompletedPerfectQuiz = Object.values(chapterProgress).some(progress => progress === 100);
        if (hasCompletedPerfectQuiz) {
          await unlockAchievement('PERFECT_QUIZ');
        }

        // Check Token Master Achievement
        if (totalTokens >= 1000) {
          await unlockAchievement('TOKEN_MASTER');
        }

        // Check Week Streak Achievement
        const response = await axios.get('/api/user/stats');
        const currentStreak = response.data.streak || 0;
        if (currentStreak >= 7) {
          await unlockAchievement('WEEK_STREAK');
        }
      } catch (error) {
        console.error('Error checking achievements:', error);
      }
    };

    checkAchievements();
  }, [completedChapters, chapterProgress, totalTokens, unlockAchievement]);

  // Add this function to check for milestones
  const checkMilestone = (progress) => {
    const milestones = [0, 20, 40, 60, 80];
    const newMilestone = milestones.find(m => progress >= m && progress < m + 20);
    
    console.log('Progress:', progress);
    console.log('Current Milestone:', currentMilestone);
    console.log('New Milestone:', newMilestone);
    
    if (newMilestone !== undefined && newMilestone !== currentMilestone) {
      console.log('Setting new milestone:', newMilestone);
      setCurrentMilestone(newMilestone);
      setShowMilestone(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Add this effect to check for milestones when progress changes
  useEffect(() => {
    const progress = Math.round((modules.reduce((acc, module) => 
      acc + module.chapters.filter(chapter => completedChapters.has(chapter)).length, 0
    ) / modules.reduce((acc, module) => acc + module.chapters.length, 0)) * 100);
    
    checkMilestone(progress);
  }, [completedChapters, currentMilestone]);

  // Chapter content mapping
  const chapterContent = {
    "The Need to Invest": {
      introduction: "Understanding why investment is crucial for financial growth",
      sections: [
        {
          title: "Why Invest?",
          content: "Investing is essential for wealth creation and beating inflation. Your money should work for you to achieve long-term financial goals.",
          keyPoints: [
            "Power of Compounding",
            "Beating Inflation",
            "Creating Passive Income",
            "Building Long-term Wealth"
          ]
        },
        {
          title: "Types of Investments",
          content: "Different investment vehicles serve different purposes. Understanding them is key to making informed decisions.",
          keyPoints: [
            "Stocks and Equities",
            "Fixed Income Securities",
            "Mutual Funds",
            "Real Estate"
          ]
        },
        {
          title: "Risk and Return",
          content: "Every investment carries some level of risk. Higher returns typically come with higher risks.",
          keyPoints: [
            "Risk Assessment",
            "Return Expectations",
            "Risk Management",
            "Portfolio Diversification"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the primary benefit of compound interest?",
          options: [
            "Earning interest on interest",
            "Fixed returns",
            "No risk involved",
            "Immediate profits"
          ],
          correct: 0
        }
      ]
    },
    "Regulators & Participants": {
      introduction: "Understanding the key players in the financial markets",
      sections: [
        {
          title: "Market Regulators",
          content: "Financial markets are overseen by regulatory bodies to ensure fair trading and protect investors.",
          keyPoints: [
            "SEBI (Securities and Exchange Board of India)",
            "RBI (Reserve Bank of India)",
            "Stock Exchanges",
            "Regulatory Framework"
          ]
        },
        {
          title: "Market Participants",
          content: "Various entities play different roles in making markets function efficiently.",
          keyPoints: [
            "Investors and Traders",
            "Brokers and Sub-brokers",
            "Market Makers",
            "Institutional Investors"
          ]
        }
      ],
      quiz: [
        {
          question: "Which organization is the primary regulator of Indian stock markets?",
          options: ["SEBI", "RBI", "NSE", "BSE"],
          correct: 0
        }
      ]
    },
    "Stock Markets Index": {
      introduction: "Understanding market indices and their significance",
      sections: [
        {
          title: "What is a Market Index?",
          content: "A market index is a measurement of the value of a section of the stock market, used as a benchmark for market performance.",
          keyPoints: [
            "Index Calculation",
            "Types of Indices",
            "Index Components",
            "Market Representation"
          ]
        },
        {
          title: "Major Indian Indices",
          content: "India has several important market indices tracking different segments of the market.",
          keyPoints: [
            "NIFTY 50",
            "SENSEX",
            "Sector Indices",
            "Market Cap Indices"
          ]
        }
      ],
      quiz: [
        {
          question: "What does NIFTY 50 represent?",
          options: [
            "50 most liquid Indian securities",
            "50 smallest companies",
            "All BSE companies",
            "Only IT companies"
          ],
          correct: 0
        }
      ]
    },
    "Trading & Settlement": {
      introduction: "Understanding the mechanics of trading and settlement in stock markets",
      sections: [
        {
          title: "Trading Mechanisms",
          content: "Modern stock markets use electronic trading systems for efficient and transparent price discovery.",
          keyPoints: [
            "Order Types",
            "Trading Sessions",
            "Price Discovery",
            "Market Depth"
          ]
        },
        {
          title: "Settlement Process",
          content: "The process of completing a trade involves several steps and participants.",
          keyPoints: [
            "T+2 Settlement",
            "Clearing Houses",
            "DEMAT Accounts",
            "Fund Settlement"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the current settlement cycle in Indian stock markets?",
          options: ["T+2", "T+5", "T+1", "T+3"],
          correct: 0
        }
      ]
    },
    "Risk Management & Trading Psychology": {
      introduction: "Understanding risk management principles and the psychology of trading",
      sections: [
        {
          title: "Risk Management",
          content: "Successful trading requires proper risk management techniques and discipline.",
          keyPoints: [
            "Position Sizing",
            "Stop Loss Orders",
            "Risk-Reward Ratio",
            "Portfolio Diversification"
          ]
        },
        {
          title: "Trading Psychology",
          content: "Psychology plays a crucial role in trading success or failure.",
          keyPoints: [
            "Emotional Control",
            "Discipline",
            "Common Biases",
            "Trading Plan"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the recommended risk per trade?",
          options: [
            "1-2% of capital",
            "25% of capital",
            "50% of capital",
            "10-15% of capital"
          ],
          correct: 0
        }
      ]
    },
    "Candlesticks Patterns": {
      introduction: "Understanding candlestick patterns and their significance in technical analysis",
      sections: [
        {
          title: "Basic Candlestick Structure",
          content: "Candlesticks are visual representations of price movements over a specific time period, showing opening, closing, high, and low prices.",
          keyPoints: [
            "Body and Wicks",
            "Bullish vs Bearish Candles",
            "Time Periods",
            "Price Action"
          ]
        },
        {
          title: "Common Patterns",
          content: "Various candlestick patterns provide insights into potential market movements and trend reversals.",
          keyPoints: [
            "Doji",
            "Hammer and Shooting Star",
            "Engulfing Patterns",
            "Morning and Evening Stars"
          ]
        }
      ],
      quiz: [
        {
          question: "What does a doji candlestick pattern typically indicate?",
          options: [
            "Market indecision",
            "Strong uptrend",
            "Strong downtrend",
            "Market closure"
          ],
          correct: 0
        }
      ]
    },
    "Support & Resistance": {
      introduction: "Understanding key price levels that influence market movements",
      sections: [
        {
          title: "Support Levels",
          content: "Support levels are price points where buying pressure is expected to prevent further price declines.",
          keyPoints: [
            "Price Floor",
            "Buying Pressure",
            "Multiple Touches",
            "Breakdown"
          ]
        },
        {
          title: "Resistance Levels",
          content: "Resistance levels are price points where selling pressure is expected to prevent further price increases.",
          keyPoints: [
            "Price Ceiling",
            "Selling Pressure",
            "Multiple Touches",
            "Breakout"
          ]
        }
      ],
      quiz: [
        {
          question: "What happens when a support level is broken?",
          options: [
            "It becomes a resistance level",
            "Price stays at that level",
            "It remains a support level",
            "Market closes"
          ],
          correct: 0
        }
      ]
    },
    "Moving Averages": {
      introduction: "Understanding different types of moving averages and their applications",
      sections: [
        {
          title: "Types of Moving Averages",
          content: "Moving averages help smooth out price data to identify trends and potential support/resistance levels.",
          keyPoints: [
            "Simple Moving Average (SMA)",
            "Exponential Moving Average (EMA)",
            "Weighted Moving Average (WMA)",
            "Moving Average Periods"
          ]
        },
        {
          title: "Moving Average Applications",
          content: "Moving averages can be used to identify trends, generate signals, and determine support/resistance levels.",
          keyPoints: [
            "Trend Identification",
            "Crossover Signals",
            "Support/Resistance",
            "Multiple Timeframes"
          ]
        }
      ],
      quiz: [
        {
          question: "Which moving average is more responsive to recent price changes?",
          options: [
            "Exponential Moving Average",
            "Simple Moving Average",
            "Weighted Moving Average",
            "All are equally responsive"
          ],
          correct: 0
        }
      ]
    },
    "Indicators & Oscillators": {
      introduction: "Understanding technical indicators and oscillators for market analysis",
      sections: [
        {
          title: "Technical Indicators",
          content: "Technical indicators help analyze market trends, momentum, and potential reversals.",
          keyPoints: [
            "MACD",
            "RSI",
            "Bollinger Bands",
            "Volume Indicators"
          ]
        },
        {
          title: "Oscillators",
          content: "Oscillators help identify overbought and oversold conditions in the market.",
          keyPoints: [
            "Stochastic Oscillator",
            "RSI",
            "CCI",
            "Williams %R"
          ]
        }
      ],
      quiz: [
        {
          question: "What does RSI above 70 typically indicate?",
          options: [
            "Overbought condition",
            "Oversold condition",
            "Strong uptrend",
            "Market closure"
          ],
          correct: 0
        }
      ]
    },
    "Chart Patterns": {
      introduction: "Understanding common chart patterns and their implications",
      sections: [
        {
          title: "Continuation Patterns",
          content: "Patterns that suggest the current trend will continue.",
          keyPoints: [
            "Triangles",
            "Flags and Pennants",
            "Wedges",
            "Rectangles"
          ]
        },
        {
          title: "Reversal Patterns",
          content: "Patterns that suggest a potential trend reversal.",
          keyPoints: [
            "Head and Shoulders",
            "Double Tops/Bottoms",
            "Triple Tops/Bottoms",
            "Rounding Patterns"
          ]
        }
      ],
      quiz: [
        {
          question: "What does a head and shoulders pattern typically indicate?",
          options: [
            "Bearish reversal",
            "Bullish continuation",
            "Market consolidation",
            "No specific signal"
          ],
          correct: 0
        }
      ]
    },
    "The IPO Markets": {
      introduction: "Understanding Initial Public Offerings and their significance",
      sections: [
        {
          title: "IPO Process",
          content: "The process through which private companies become publicly traded entities.",
          keyPoints: [
            "Company Preparation",
            "Regulatory Requirements",
            "Underwriting",
            "Pricing and Allocation"
          ]
        },
        {
          title: "IPO Investment",
          content: "Key considerations for investing in IPOs and evaluating new listings.",
          keyPoints: [
            "Prospectus Analysis",
            "Valuation Metrics",
            "Lock-up Periods",
            "Risk Assessment"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the lock-up period in an IPO?",
          options: [
            "Period when insiders cannot sell shares",
            "Time before IPO launch",
            "Trading suspension period",
            "Registration period"
          ],
          correct: 0
        }
      ]
    },
    "Understanding Annual Reports": {
      introduction: "Learning to analyze company financial statements and annual reports",
      sections: [
        {
          title: "Key Financial Statements",
          content: "Understanding the main components of financial reporting.",
          keyPoints: [
            "Balance Sheet",
            "Income Statement",
            "Cash Flow Statement",
            "Notes to Accounts"
          ]
        },
        {
          title: "Management Discussion",
          content: "Analyzing management's perspective on company performance and future outlook.",
          keyPoints: [
            "Business Overview",
            "Performance Analysis",
            "Risk Factors",
            "Future Plans"
          ]
        }
      ],
      quiz: [
        {
          question: "Which financial statement shows a company's assets and liabilities?",
          options: [
            "Balance Sheet",
            "Income Statement",
            "Cash Flow Statement",
            "Notes to Accounts"
          ],
          correct: 0
        }
      ]
    },
    "Financial Ratios": {
      introduction: "Understanding key financial ratios for company analysis",
      sections: [
        {
          title: "Profitability Ratios",
          content: "Ratios that measure a company's ability to generate profits.",
          keyPoints: [
            "ROE",
            "ROA",
            "Profit Margins",
            "Operating Efficiency"
          ]
        },
        {
          title: "Valuation Ratios",
          content: "Ratios used to evaluate a company's stock price relative to its financial performance.",
          keyPoints: [
            "P/E Ratio",
            "P/B Ratio",
            "EV/EBITDA",
            "Dividend Yield"
          ]
        }
      ],
      quiz: [
        {
          question: "What does a high P/E ratio typically indicate?",
          options: [
            "High growth expectations",
            "Poor performance",
            "Low market value",
            "High debt"
          ],
          correct: 0
        }
      ]
    },
    "Equity Research": {
      introduction: "Understanding the process of equity research and analysis",
      sections: [
        {
          title: "Research Process",
          content: "The systematic approach to analyzing stocks and making investment decisions.",
          keyPoints: [
            "Data Collection",
            "Analysis Methods",
            "Report Writing",
            "Recommendations"
          ]
        },
        {
          title: "Research Reports",
          content: "Understanding different types of research reports and their components.",
          keyPoints: [
            "Initiation Reports",
            "Update Reports",
            "Earnings Reviews",
            "Target Price Updates"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the primary purpose of equity research?",
          options: [
            "Provide investment recommendations",
            "Market speculation",
            "Company promotion",
            "Regulatory compliance"
          ],
          correct: 0
        }
      ]
    },
    "Company Analysis": {
      introduction: "Comprehensive analysis of companies for investment decisions",
      sections: [
        {
          title: "Business Analysis",
          content: "Understanding a company's business model and competitive position.",
          keyPoints: [
            "Business Model",
            "Competitive Advantage",
            "Industry Position",
            "Growth Strategy"
          ]
        },
        {
          title: "Risk Analysis",
          content: "Identifying and evaluating various risks associated with the company.",
          keyPoints: [
            "Business Risks",
            "Financial Risks",
            "Regulatory Risks",
            "Market Risks"
          ]
        }
      ],
      quiz: [
        {
          question: "What is a company's competitive advantage?",
          options: [
            "Unique strength over competitors",
            "Market share",
            "Revenue growth",
            "Profit margin"
          ],
          correct: 0
        }
      ]
    },
    "Introduction to Mutual Funds": {
      introduction: "Understanding the basics of mutual funds and their role in investment",
      sections: [
        {
          title: "What are Mutual Funds?",
          content: "Mutual funds are investment vehicles that pool money from multiple investors to invest in a diversified portfolio of securities.",
          keyPoints: [
            "Pooled Investment",
            "Professional Management",
            "Diversification",
            "Regulatory Framework"
          ]
        },
        {
          title: "Benefits of Mutual Funds",
          content: "Mutual funds offer several advantages to investors including diversification, professional management, and liquidity.",
          keyPoints: [
            "Risk Diversification",
            "Professional Management",
            "Liquidity",
            "Affordable Investment"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the primary benefit of investing in mutual funds?",
          options: [
            "Diversification",
            "Guaranteed Returns",
            "No Risk",
            "Instant Liquidity"
          ],
          correct: 0
        }
      ]
    },
    "Types of Mutual Funds": {
      introduction: "Understanding different categories of mutual funds",
      sections: [
        {
          title: "Based on Asset Class",
          content: "Mutual funds can be categorized based on the type of securities they invest in.",
          keyPoints: [
            "Equity Funds",
            "Debt Funds",
            "Balanced Funds",
            "Money Market Funds"
          ]
        },
        {
          title: "Based on Investment Style",
          content: "Funds can also be categorized based on their investment approach and objectives.",
          keyPoints: [
            "Growth Funds",
            "Value Funds",
            "Index Funds",
            "Sector Funds"
          ]
        }
      ],
      quiz: [
        {
          question: "Which type of mutual fund invests primarily in stocks?",
          options: [
            "Equity Fund",
            "Debt Fund",
            "Money Market Fund",
            "Liquid Fund"
          ],
          correct: 0
        }
      ]
    },
    "Understanding SIP": {
      introduction: "Learning about Systematic Investment Plans and their benefits",
      sections: [
        {
          title: "What is SIP?",
          content: "SIP is an investment strategy that allows investors to invest a fixed amount regularly in mutual funds.",
          keyPoints: [
            "Regular Investment",
            "Rupee Cost Averaging",
            "Power of Compounding",
            "Flexibility"
          ]
        },
        {
          title: "Benefits of SIP",
          content: "SIP offers several advantages including disciplined investing, rupee cost averaging, and the power of compounding.",
          keyPoints: [
            "Disciplined Investing",
            "Rupee Cost Averaging",
            "Compounding Benefits",
            "Flexible Investment"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the main advantage of SIP over lump sum investment?",
          options: [
            "Rupee Cost Averaging",
            "Higher Returns",
            "No Risk",
            "Instant Liquidity"
          ],
          correct: 0
        }
      ]
    },
    "Fund Selection & Analysis": {
      introduction: "Learning how to select and analyze mutual funds",
      sections: [
        {
          title: "Fund Selection Criteria",
          content: "Key factors to consider when selecting a mutual fund for investment.",
          keyPoints: [
            "Investment Objective",
            "Past Performance",
            "Fund Manager",
            "Expense Ratio"
          ]
        },
        {
          title: "Fund Analysis Tools",
          content: "Various metrics and tools used to analyze mutual fund performance.",
          keyPoints: [
            "NAV",
            "Returns",
            "Risk Metrics",
            "Portfolio Composition"
          ]
        }
      ],
      quiz: [
        {
          question: "Which factor is most important when selecting a mutual fund?",
          options: [
            "Investment Objective",
            "Past Performance",
            "Fund Size",
            "Marketing Campaign"
          ],
          correct: 0
        }
      ]
    },
    "Taxation & Regulations": {
      introduction: "Understanding tax implications and regulations for mutual fund investments",
      sections: [
        {
          title: "Taxation Rules",
          content: "Tax implications for different types of mutual funds and investment periods.",
          keyPoints: [
            "Equity Fund Taxation",
            "Debt Fund Taxation",
            "STCG vs LTCG",
            "Tax Benefits"
          ]
        },
        {
          title: "Regulatory Framework",
          content: "Regulations governing mutual funds and investor protection.",
          keyPoints: [
            "SEBI Regulations",
            "AMFI Guidelines",
            "Investor Protection",
            "Transparency"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the tax treatment for long-term capital gains in equity funds?",
          options: [
            "10% above 1 lakh",
            "15% above 1 lakh",
            "20% with indexation",
            "No tax"
          ],
          correct: 0
        }
      ]
    },
    "Options Basics": {
      introduction: "Understanding the fundamentals of options trading",
      sections: [
        {
          title: "What are Options?",
          content: "Options are financial derivatives that give the right but not the obligation to buy or sell an asset.",
          keyPoints: [
            "Call Options",
            "Put Options",
            "Strike Price",
            "Expiration Date"
          ]
        },
        {
          title: "Options Terminology",
          content: "Key terms and concepts used in options trading.",
          keyPoints: [
            "Premium",
            "Intrinsic Value",
            "Time Value",
            "In-the-Money"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the maximum loss for an option buyer?",
          options: [
            "Premium paid",
            "Unlimited",
            "Strike price",
            "Stock price"
          ],
          correct: 0
        }
      ]
    },
    "Options Greeks": {
      introduction: "Understanding the Greeks in options trading",
      sections: [
        {
          title: "Key Greeks",
          content: "The Greeks measure different factors that affect option prices.",
          keyPoints: [
            "Delta",
            "Gamma",
            "Theta",
            "Vega"
          ]
        },
        {
          title: "Greek Applications",
          content: "How to use Greeks for options trading decisions.",
          keyPoints: [
            "Risk Assessment",
            "Position Management",
            "Strategy Selection",
            "Portfolio Hedging"
          ]
        }
      ],
      quiz: [
        {
          question: "Which Greek measures the rate of change in option price with respect to time?",
          options: [
            "Theta",
            "Delta",
            "Gamma",
            "Vega"
          ],
          correct: 0
        }
      ]
    },
    "Options Strategies": {
      introduction: "Learning various options trading strategies",
      sections: [
        {
          title: "Basic Strategies",
          content: "Common options trading strategies for different market conditions.",
          keyPoints: [
            "Long Call",
            "Long Put",
            "Covered Call",
            "Protective Put"
          ]
        },
        {
          title: "Advanced Strategies",
          content: "Complex options strategies for experienced traders.",
          keyPoints: [
            "Straddles",
            "Strangles",
            "Butterflies",
            "Iron Condors"
          ]
        }
      ],
      quiz: [
        {
          question: "Which strategy is best for a neutral market outlook?",
          options: [
            "Iron Condor",
            "Long Call",
            "Long Put",
            "Covered Call"
          ],
          correct: 0
        }
      ]
    },
    "Risk Management in Options": {
      introduction: "Understanding risk management in options trading",
      sections: [
        {
          title: "Risk Assessment",
          content: "Identifying and measuring risks in options trading.",
          keyPoints: [
            "Position Sizing",
            "Stop Loss",
            "Risk-Reward Ratio",
            "Portfolio Exposure"
          ]
        },
        {
          title: "Risk Mitigation",
          content: "Strategies to manage and reduce options trading risks.",
          keyPoints: [
            "Diversification",
            "Hedging",
            "Position Limits",
            "Exit Strategies"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the most important aspect of options trading?",
          options: [
            "Risk Management",
            "Strategy Selection",
            "Market Timing",
            "Position Sizing"
          ],
          correct: 0
        }
      ]
    },
    "Options Trading Examples": {
      introduction: "Real-world examples of options trading strategies",
      sections: [
        {
          title: "Basic Strategy Examples",
          content: "Practical examples of basic options trading strategies.",
          keyPoints: [
            "Long Call Example",
            "Long Put Example",
            "Covered Call Example",
            "Protective Put Example"
          ]
        },
        {
          title: "Advanced Strategy Examples",
          content: "Complex options trading strategy examples.",
          keyPoints: [
            "Straddle Example",
            "Strangle Example",
            "Butterfly Example",
            "Iron Condor Example"
          ]
        }
      ],
      quiz: [
        {
          question: "In which market condition is a straddle strategy most effective?",
          options: [
            "High Volatility",
            "Low Volatility",
            "Strong Trend",
            "Sideways Market"
          ],
          correct: 0
        }
      ]
    },
    "Futures Basics": {
      introduction: "Understanding the fundamentals of futures trading",
      sections: [
        {
          title: "What are Futures?",
          content: "Futures are standardized contracts to buy or sell an asset at a predetermined price and date.",
          keyPoints: [
            "Contract Specifications",
            "Margin Requirements",
            "Settlement",
            "Price Discovery"
          ]
        },
        {
          title: "Futures vs Options",
          content: "Key differences between futures and options trading.",
          keyPoints: [
            "Obligation",
            "Risk Profile",
            "Pricing",
            "Trading Mechanics"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the main difference between futures and options?",
          options: [
            "Obligation to trade",
            "Contract size",
            "Trading hours",
            "Settlement process"
          ],
          correct: 0
        }
      ]
    },
    "Futures Pricing": {
      introduction: "Understanding how futures prices are determined",
      sections: [
        {
          title: "Pricing Models",
          content: "Theoretical models for futures pricing.",
          keyPoints: [
            "Cost of Carry",
            "Spot-Futures Parity",
            "Basis",
            "Contango and Backwardation"
          ]
        },
        {
          title: "Price Factors",
          content: "Factors that influence futures prices.",
          keyPoints: [
            "Spot Price",
            "Interest Rates",
            "Storage Costs",
            "Dividends"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the relationship between spot price and futures price?",
          options: [
            "Cost of Carry",
            "Random",
            "Inverse",
            "No relationship"
          ],
          correct: 0
        }
      ]
    },
    "Futures Strategies": {
      introduction: "Learning various futures trading strategies",
      sections: [
        {
          title: "Basic Strategies",
          content: "Common futures trading strategies.",
          keyPoints: [
            "Long Futures",
            "Short Futures",
            "Spread Trading",
            "Hedging"
          ]
        },
        {
          title: "Advanced Strategies",
          content: "Complex futures trading strategies.",
          keyPoints: [
            "Calendar Spreads",
            "Inter-Exchange Spreads",
            "Cross-Commodity Spreads",
            "Arbitrage"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the primary purpose of futures hedging?",
          options: [
            "Risk Management",
            "Speculation",
            "Arbitrage",
            "Market Making"
          ],
          correct: 0
        }
      ]
    },
    "Hedging with Futures": {
      introduction: "Understanding how to use futures for hedging",
      sections: [
        {
          title: "Hedging Concepts",
          content: "Basic concepts of hedging with futures.",
          keyPoints: [
            "Long Hedge",
            "Short Hedge",
            "Cross Hedge",
            "Optimal Hedge Ratio"
          ]
        },
        {
          title: "Hedging Applications",
          content: "Practical applications of futures hedging.",
          keyPoints: [
            "Portfolio Hedging",
            "Commodity Hedging",
            "Currency Hedging",
            "Interest Rate Hedging"
          ]
        }
      ],
      quiz: [
        {
          question: "What is the main purpose of hedging with futures?",
          options: [
            "Risk Reduction",
            "Profit Maximization",
            "Market Timing",
            "Speculation"
          ],
          correct: 0
        }
      ]
    },
    "Futures Trading Examples": {
      introduction: "Real-world examples of futures trading",
      sections: [
        {
          title: "Basic Trading Examples",
          content: "Practical examples of basic futures trading.",
          keyPoints: [
            "Long Position Example",
            "Short Position Example",
            "Spread Trade Example",
            "Hedging Example"
          ]
        },
        {
          title: "Advanced Trading Examples",
          content: "Complex futures trading examples.",
          keyPoints: [
            "Arbitrage Example",
            "Cross-Hedge Example",
            "Calendar Spread Example",
            "Portfolio Hedge Example"
          ]
        }
      ],
      quiz: [
        {
          question: "Which type of futures trade is most suitable for a bullish market outlook?",
          options: [
            "Long Futures",
            "Short Futures",
            "Calendar Spread",
            "Cross Hedge"
          ],
          correct: 0
        }
      ]
    }
  };

  const modules = [
    {
      id: 1,
      title: "Introduction to Stock Markets",
      description: "Learn the basics of stock markets and trading",
      duration: "2 hours",
      color: "bg-blue-100",
      chapters: [
        "The Need to Invest",
        "Regulators & Participants",
        "Stock Markets Index",
        "Trading & Settlement",
        "Risk Management & Trading Psychology"
      ]
    },
    {
      id: 2,
      title: "Mutual Funds & SIP",
      description: "Understanding mutual funds and systematic investment",
      duration: "2 hours",
      color: "bg-yellow-100",
      chapters: [
        "Introduction to Mutual Funds",
        "Types of Mutual Funds",
        "Understanding SIP",
        "Fund Selection & Analysis",
        "Taxation & Regulations"
      ]
    },
    {
      id: 3,
      title: "Technical Analysis",
      description: "Master the art of technical analysis",
      duration: "3 hours",
      color: "bg-green-100",
      chapters: [
        "Candlesticks Patterns",
        "Support & Resistance",
        "Moving Averages",
        "Indicators & Oscillators",
        "Chart Patterns"
      ]
    },
    {
      id: 4,
      title: "Fundamental Analysis",
      description: "Learn to analyze stocks fundamentally",
      duration: "3 hours",
      color: "bg-purple-100",
      chapters: [
        "The IPO Markets",
        "Understanding Annual Reports",
        "Financial Ratios",
        "Equity Research",
        "Company Analysis"
      ]
    },
    {
      id: 5,
      title: "Options Trading",
      description: "Learn about options trading strategies",
      duration: "3 hours",
      color: "bg-red-100",
      chapters: [
        "Options Basics",
        "Options Greeks",
        "Options Strategies",
        "Risk Management in Options",
        "Options Trading Examples"
      ]
    },
    {
      id: 6,
      title: "Futures Trading",
      description: "Understanding futures trading",
      duration: "2 hours",
      color: "bg-indigo-100",
      chapters: [
        "Futures Basics",
        "Futures Pricing",
        "Futures Strategies",
        "Hedging with Futures",
        "Futures Trading Examples"
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200"
    };
    return colorMap[color] || colorMap.purple;
  };

  const handleChapterClick = (moduleId, chapter) => {
    setSelectedChapter(chapter);
    setShowChapterContent(true);
  };

  const handleChapterComplete = (chapter, score, total, tokens) => {
    // Update completed chapters
    setCompletedChapters(prev => {
      const newSet = new Set(prev);
      newSet.add(chapter);
      return newSet;
    });

    // Update chapter progress
    setChapterProgress(prev => ({
      ...prev,
      [chapter]: (score / total) * 100
    }));

    // Update tokens
    const newTotalTokens = totalTokens + tokens;
    setTotalTokens(newTotalTokens);
    
    // Add XP for completing chapter and update daily progress
    const xpEarned = Math.round((score / total) * 100) + 50; // Base XP + performance bonus
    addXP(xpEarned);
    completeChapter(chapter);
    
    // Check and unlock achievements
    const completedCount = completedChapters.size + 1;

    // First Lesson Achievement
    if (completedCount === 1) {
      unlockAchievement('FIRST_LESSON');
    }

    // Perfect Score Achievement
    if (score === total) {
      unlockAchievement('PERFECT_QUIZ');
    }

    // Token Master Achievement
    if (newTotalTokens >= 1000) {
      unlockAchievement('TOKEN_MASTER');
    }

    // Week Streak Achievement - check if streak is 7 or more
    const currentStreak = parseInt(localStorage.getItem('streak') || '0');
    if (currentStreak >= 7) {
      unlockAchievement('WEEK_STREAK');
    }

    // Show completion notification
    showCompletionNotification(chapter, xpEarned, tokens);

    // Close chapter content
    setTimeout(() => {
      setShowChapterContent(false);
      setShowQuiz(false);
      setQuizAnswers({});
      setSubmittedAnswers({});
      setQuizAttempts({});
    }, 2000);
  };

  // Add this new function for showing completion notification
  const showCompletionNotification = (chapter, xp, tokens) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-white p-6 rounded-xl border-4 border-green-500 shadow-lg z-50 animate-slide-in';
    notification.innerHTML = `
      <div class="flex items-center space-x-4">
        <div class="text-4xl">🎉</div>
        <div>
          <h3 class="font-bold text-lg text-green-600">Chapter Completed!</h3>
          <p class="text-gray-600">You earned:</p>
          <div class="flex items-center space-x-4 mt-2">
            <div class="flex items-center">
              <span class="text-yellow-500 font-bold">+${xp}</span>
              <span class="ml-1">XP</span>
            </div>
            <div class="flex items-center">
              <span class="text-purple-500 font-bold">+${tokens}</span>
              <span class="ml-1">Tokens</span>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('animate-slide-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  const isChapterCompleted = (moduleId, chapter) => {
    return completedChapters.has(chapter);
  };

  const getChapterButtonClasses = (moduleId, chapter) => {
    const baseClasses = "w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left";
    const isCompleted = isChapterCompleted(moduleId, chapter);
    const isSelected = selectedChapter === chapter;

    if (isCompleted && isSelected) {
      return `${baseClasses} bg-green-100 border-2 border-green-500 hover:bg-green-200`;
    } else if (isCompleted) {
      return `${baseClasses} bg-green-50 border border-green-200 hover:bg-green-100`;
    } else if (isSelected) {
      return `${baseClasses} bg-purple-100 border-2 border-purple-500 hover:bg-purple-200`;
    } else {
      return `${baseClasses} bg-gray-50 hover:bg-gray-100 hover:shadow-md`;
    }
  };

  const handleAnswerSelect = (questionIndex, selectedOptionIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOptionIndex
    }));
  };

  const handleQuizSubmit = (questionIndex) => {
    const isCorrect = quizAnswers[questionIndex] === chapterContent[selectedChapter].quiz[questionIndex].correct;
    
    setSubmittedAnswers(prev => ({
      ...prev,
      [questionIndex]: true
    }));

    // Track attempts for this question
    setQuizAttempts(prev => ({
      ...prev,
      [questionIndex]: (prev[questionIndex] || 0) + 1
    }));

    // If answer is incorrect, we don't mark it as submitted so it can be retried
    if (!isCorrect) {
      setTimeout(() => {
        setSubmittedAnswers(prev => ({
          ...prev,
          [questionIndex]: false
        }));
        setQuizAnswers(prev => ({
          ...prev,
          [questionIndex]: undefined
        }));
      }, 2000); // Show the incorrect answer feedback for 2 seconds
    }
  };

  const getAnswerButtonClass = (questionIndex, optionIndex, correctIndex) => {
    const baseClasses = "w-full text-left p-3 rounded-lg border transition-all duration-200";
    const isSelected = quizAnswers[questionIndex] === optionIndex;
    const isSubmitted = submittedAnswers[questionIndex];
    const isCorrect = quizAnswers[questionIndex] === correctIndex;

    if (!isSubmitted) {
      return `${baseClasses} ${
        isSelected 
          ? 'bg-purple-100 border-purple-500 text-purple-700' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`;
    }

    if (isSubmitted && isCorrect && isSelected) {
      return `${baseClasses} bg-green-100 border-green-500 text-green-700`;
    }

    if (isSubmitted && !isCorrect && isSelected) {
      return `${baseClasses} bg-red-100 border-red-500 text-red-700`;
    }

    return `${baseClasses} bg-white border-gray-200 ${isSubmitted ? 'opacity-50' : 'hover:bg-gray-50'}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50">
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          .animate-slide-in {
            animation: slideIn 0.5s ease-out forwards;
          }
          .animate-slide-out {
            animation: slideOut 0.5s ease-in forwards;
          }
        `}
      </style>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-screen w-80 bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50 border-l-4 border-gray-800 shadow-lg p-8 flex flex-col">
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome back,</h2>
            <h2 className="text-3xl font-bold text-[#E86A33]">{user?.name || 'Investor'}!</h2>
            <p className="text-gray-600 mt-4 text-lg">How's your learning journey going?</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
              <h3 className="font-bold text-xl text-gray-800 mb-2">Your Progress</h3>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.round((modules.reduce((acc, module) => 
                        acc + module.chapters.filter(chapter => completedChapters.has(chapter)).length, 0
                      ) / modules.reduce((acc, module) => acc + module.chapters.length, 0)) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-right">
                  {Math.round((modules.reduce((acc, module) => 
                    acc + module.chapters.filter(chapter => completedChapters.has(chapter)).length, 0
                  ) / modules.reduce((acc, module) => acc + module.chapters.length, 0)) * 100)}% Complete
                </p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
              <h3 className="font-bold text-xl text-gray-800 mb-2">Tokens Earned</h3>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">🪙</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">{totalTokens}</span>
                <span className="text-gray-600">tokens</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          className="w-full px-6 py-4 bg-[#E86A33] text-white rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] hover:bg-[#d55a23] transition-all duration-200 flex items-center justify-center space-x-3 mt-auto font-bold text-lg"
        >
          <span>Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v3a1 1 0 102 0V9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Main Content - Add right margin to account for sidebar */}
      <div className="mr-80">
        {/* Header */}
        <div className="bg-white border-b-4 border-gray-800 py-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h1 className="text-4xl font-bold">
                  <span className="text-black">stock</span>
                  <span className="text-[#E86A33]">wise</span>
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Your journey to financial wisdom starts here
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/store"
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200 hover:bg-gray-50"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-bold">Redeem Reward Tokens</span>
                </Link>
                <Link
                  to="/invest"
                  className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200 hover:bg-gray-900"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-bold">Invest Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/build-corpus"
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200 hover:from-green-700 hover:to-emerald-700"
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="font-bold">Earn</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Gamification Stats Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-full">
              <XPBar />
            </div>
            <div className="h-full">
              <DailyGoalProgress />
            </div>
            <div className="h-full">
              <StreakDisplay />
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Object.entries(ACHIEVEMENTS).map(([id, achievement]) => (
                <div key={id} className="relative group">
                  <AchievementBadge
                    achievement={achievement}
                    unlocked={achievements.includes(id)}
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {getAchievementProgress(id)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Progress Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-gradient-to-br from-rose-50 via-sky-50 to-emerald-50 p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-300 via-pink-300 to-red-300"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-300 via-blue-300 to-indigo-300"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
                    <div className="absolute inset-0 w-6 h-6 bg-yellow-500 blur-sm -z-10"></div>
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    Course Progress
                  </h2>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 blur-md"></div>
                  <div className="relative w-full bg-white/50 backdrop-blur-sm rounded-full h-6 overflow-hidden border-2 border-gray-800">
                    <div 
                      className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-full transition-all duration-500 relative"
                      style={{ 
                        width: `${(modules.reduce((acc, module) => 
                          acc + module.chapters.filter(chapter => completedChapters.has(chapter)).length, 0
                        ) / modules.reduce((acc, module) => acc + module.chapters.length, 0)) * 100}%` 
                      }}
                    >
                      <div className="absolute inset-0 overflow-hidden opacity-75">
                        <div className="animate-[move-right-to-left_2s_linear_infinite] flex">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-6 w-3 bg-white/20 -skew-x-[40deg] mx-2" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500"
                    style={{ 
                      left: `${Math.min(Math.max((modules.reduce((acc, module) => 
                        acc + module.chapters.filter(chapter => completedChapters.has(chapter)).length, 0
                      ) / modules.reduce((acc, module) => acc + module.chapters.length, 0)) * 100, 0), 96)}%` 
                    }}
                  >
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border-2 border-gray-800 shadow-lg transform -translate-x-1/2">
                      <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent whitespace-nowrap">
                        {Math.round((modules.reduce((acc, module) => 
                          acc + module.chapters.filter(chapter => completedChapters.has(chapter)).length, 0
                        ) / modules.reduce((acc, module) => acc + module.chapters.length, 0)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border-2 border-gray-800">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mr-2"></div>
                    <span className="text-sm font-medium">Completed:</span>
                    <span className="ml-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                      {modules.reduce((acc, module) => 
                        acc + module.chapters.filter(chapter => completedChapters.has(chapter)).length, 0
                      )} chapters
                    </span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border-2 border-gray-800">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mr-2"></div>
                    <span className="text-sm font-medium">Remaining:</span>
                    <span className="ml-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                      {modules.reduce((acc, module) => 
                        acc + module.chapters.filter(chapter => !completedChapters.has(chapter)).length, 0
                      )} chapters
                    </span>
                  </div>
                </div>
              </div>

              {/* Avatar Section */}
              <div className="ml-8">
                <img 
                  src={`/images/${Math.min(Math.floor((modules.reduce((acc, module) => 
                    acc + module.chapters.filter(chapter => completedChapters.has(chapter)).length, 0
                  ) / modules.reduce((acc, module) => acc + module.chapters.length, 0)) * 100 / 20) + 1, 5)}.png`}
                  alt="Progress Avatar"
                  className="w-[200px] h-[200px] object-cover rounded-full border-4 border-gray-800 shadow-lg"
                />
              </div>
            </div>

            <style>
              {`
                @keyframes move-right-to-left {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50px); }
                }
              `}
            </style>
          </div>
        </div>

        {/* Learning Modules */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <motion.div
                key={module.id}
                whileHover={{ scale: 1.02 }}
                className={`${module.color} p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{module.title}</h2>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="ml-1 font-bold">
                      {module.chapters.filter(chapter => isChapterCompleted(module.id, chapter)).length} / {module.chapters.length}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <div className="text-sm text-gray-500 mb-4">{module.duration}</div>
                <div className="space-y-2">
                  {module.chapters.map((chapter, index) => (
                    <button
                      key={index}
                      onClick={() => handleChapterClick(module.id, chapter)}
                      className={getChapterButtonClasses(module.id, chapter)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{chapter}</div>
                        {isChapterCompleted(module.id, chapter) && (
                          <div className="text-sm text-green-600">
                            {chapterProgress[chapter]}% Complete
                          </div>
                        )}
                      </div>
                      {isChapterCompleted(module.id, chapter) && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chapter Content Modal */}
        {showChapterContent && selectedChapter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-black">{selectedChapter}</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setShowChapterContent(false);
                    setShowQuiz(false);
                    setQuizAnswers({});
                    setSubmittedAnswers({});
                    setQuizAttempts({});
                  }}
                >
                  ✕
                </button>
              </div>

              {chapterContent[selectedChapter] && (
                <div className="space-y-8">
                  {!showQuiz ? (
                    <>
                      {/* Introduction */}
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-lg text-gray-700">{chapterContent[selectedChapter].introduction}</p>
                      </div>

                      {/* Sections */}
                      {chapterContent[selectedChapter].sections.map((section, index) => (
                        <div key={index} className="border-b pb-6">
                          <h3 className="text-xl font-semibold mb-4 text-black">{section.title}</h3>
                          <p className="text-gray-700 mb-4">{section.content}</p>
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-black">Key Points:</h4>
                            <ul className="list-disc pl-5 space-y-2">
                              {section.keyPoints.map((point, i) => (
                                <li key={i} className="text-gray-700">{point}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}

                      {/* Start Quiz Button */}
                      <div className="flex justify-center pt-4">
                        <button
                          className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors duration-200 flex items-center space-x-2"
                          onClick={() => setShowQuiz(true)}
                        >
                          <span>Start Knowledge Check</span>
                          <span className="text-xl">📝</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-8">
                      {/* Quiz Header */}
                      <div className="bg-orange-50 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-semibold text-black">Knowledge Check</h3>
                          <button
                            className="text-orange-600 hover:text-orange-800 text-sm flex items-center space-x-2"
                            onClick={() => {
                              if (window.confirm('Going back will reset your quiz progress. Are you sure?')) {
                                setShowQuiz(false);
                                setQuizAnswers({});
                                setSubmittedAnswers({});
                                setQuizAttempts({});
                              }
                            }}
                          >
                            <span>← Back to Material</span>
                          </button>
                        </div>

                        {/* Quiz Questions */}
                        {chapterContent[selectedChapter].quiz.map((quizItem, questionIndex) => (
                          <div key={questionIndex} className="space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-black">{quizItem.question}</p>
                              {quizAttempts[questionIndex] > 0 && (
                                <span className="text-sm text-gray-500">
                                  Attempts: {quizAttempts[questionIndex]}
                                </span>
                              )}
                            </div>
                            <div className="space-y-2">
                              {quizItem.options.map((option, optionIndex) => (
                                <button
                                  key={optionIndex}
                                  className={getAnswerButtonClass(questionIndex, optionIndex, quizItem.correct)}
                                  onClick={() => !submittedAnswers[questionIndex] && handleAnswerSelect(questionIndex, optionIndex)}
                                  disabled={submittedAnswers[questionIndex]}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                            <div className="mt-4">
                              {!submittedAnswers[questionIndex] ? (
                                <button
                                  className={`px-4 py-2 rounded-lg ${
                                    quizAnswers[questionIndex] !== undefined
                                      ? 'bg-black text-white hover:bg-gray-800'
                                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                                  onClick={() => quizAnswers[questionIndex] !== undefined && handleQuizSubmit(questionIndex)}
                                  disabled={quizAnswers[questionIndex] === undefined}
                                >
                                  {quizAttempts[questionIndex] ? 'Try Again' : 'Submit Answer'}
                                </button>
                              ) : (
                                <div className="text-sm">
                                  {quizAnswers[questionIndex] === quizItem.correct ? (
                                    <p className="text-orange-600">✓ Correct! Well done!</p>
                                  ) : (
                                    <div>
                                      <p className="text-red-600 font-medium">✗ Incorrect.</p>
                                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2">
                                        <p className="text-orange-800">Take a moment to:</p>
                                        <ul className="list-disc pl-5 mt-2 space-y-1 text-orange-700">
                                          <li>Review the chapter material carefully</li>
                                          <li>Focus on the key points related to this question</li>
                                          <li>Think about the concepts discussed</li>
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Complete Chapter Button */}
                        <div className="flex justify-end mt-8">
                          <button
                            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                            onClick={() => {
                              const allQuestionsAnswered = chapterContent[selectedChapter].quiz.every(
                                (quiz, index) => submittedAnswers[index] && quizAnswers[index] === quiz.correct
                              );
                              
                              if (allQuestionsAnswered) {
                                const totalAttempts = Object.values(quizAttempts).reduce((a, b) => a + b, 0);
                                const questionsCount = chapterContent[selectedChapter].quiz.length;
                                // Calculate tokens based on attempts (fewer attempts = more tokens)
                                const baseTokens = 50;
                                const tokenMultiplier = Math.max(0.5, 1 - ((totalAttempts - questionsCount) * 0.1));
                                const earnedTokens = Math.round(baseTokens * tokenMultiplier);

                                handleChapterComplete(
                                  selectedChapter,
                                  questionsCount,
                                  questionsCount,
                                  earnedTokens
                                );
                                setShowChapterContent(false);
                                setShowQuiz(false);
                                setQuizAnswers({});
                                setSubmittedAnswers({});
                                setQuizAttempts({});
                              } else {
                                alert('Please answer all questions correctly before completing the chapter.');
                              }
                            }}
                          >
                            Complete Chapter
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Milestone Popup */}
        <AnimatePresence>
          {showMilestone && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowMilestone(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowMilestone(false)}
                >
                  ✕
                </button>
                
                <div className="flex flex-col items-center">
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    src={`/images/${currentMilestone / 20 + 1}.png`}
                    alt={`Milestone ${currentMilestone / 20 + 1}`}
                    className="w-64 h-64 object-contain mb-6"
                  />
                  
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent"
                  >
                    Congratulations! 🎉
                  </motion.h2>
                  
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-center text-gray-600 mb-6"
                  >
                    You've reached {currentMilestone}% of your learning journey!
                  </motion.p>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-orange-50 p-4 rounded-lg text-center"
                  >
                    <p className="text-orange-800 font-medium">
                      Keep up the great work! Your dedication to learning is impressive.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Finance Chatbot */}
        <FinanceChatbot />
      </div>
    </div>
  );
};

// Add this helper function to get achievement progress
const getAchievementProgress = (achievementId) => {
  switch (achievementId) {
    case 'FIRST_LESSON':
      return 'Complete your first lesson';
    case 'PERFECT_QUIZ':
      return 'Get 100% on any quiz';
    case 'TOKEN_MASTER':
      return 'Earn 1000 tokens';
    case 'WEEK_STREAK':
      return 'Maintain a 7-day streak';
    case 'INVESTMENT_START':
      return 'Make your first investment';
    default:
      return 'Keep learning to unlock';
  }
};

export default LearnPage;