import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ShoppingBag, TrendingUp, ArrowRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import FinanceChatbot from '../components/FinanceChatbot';

const LearnPage = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [completedChapters, setCompletedChapters] = useState(() => {
    // Load completed chapters from localStorage on component mount
    const saved = localStorage.getItem('completedChapters');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showChapterContent, setShowChapterContent] = useState(false);
  const [chapterProgress, setChapterProgress] = useState(() => {
    // Load chapter progress from localStorage on component mount
    const saved = localStorage.getItem('chapterProgress');
    return saved ? JSON.parse(saved) : {};
  });
  const [totalTokens, setTotalTokens] = useState(() => {
    // Load total tokens from localStorage on component mount
    const saved = localStorage.getItem('totalTokens');
    return saved ? parseInt(saved) : 0;
  });
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState({});

  // Save progress whenever completedChapters changes
  useEffect(() => {
    localStorage.setItem('completedChapters', JSON.stringify([...completedChapters]));
  }, [completedChapters]);

  // Save progress whenever chapterProgress changes
  useEffect(() => {
    localStorage.setItem('chapterProgress', JSON.stringify(chapterProgress));
  }, [chapterProgress]);

  // Save progress whenever totalTokens changes
  useEffect(() => {
    localStorage.setItem('totalTokens', totalTokens.toString());
  }, [totalTokens]);

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
    setCompletedChapters(prev => {
      const newSet = new Set(prev);
      newSet.add(chapter);
      return newSet;
    });

    setChapterProgress(prev => ({
      ...prev,
      [chapter]: (score / total) * 100
    }));

    setTotalTokens(prev => prev + tokens);
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
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-800 py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Learn & Earn</h1>
            <div className="flex items-center space-x-4">
              <Link
                to="/store"
                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-bold">Redeem Reward Tokens</span>
              </Link>
              <Link
                to="/invest"
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold">Invest Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/build-corpus"
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
              >
                <DollarSign className="w-5 h-5" />
                <span className="font-bold">Build Corpus</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Progress Tracker */}
      <div className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-8">
              <h2 className="text-2xl font-bold mb-2">Track Your Progress</h2>
              <p className="text-gray-400 mb-4">Complete modules to earn certificates</p>
              <div className="bg-gray-800 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(completedChapters.size / 30) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>{completedChapters.size} chapters completed</span>
                <span>{30 - completedChapters.size} remaining</span>
              </div>
            </div>
            <div className="flex items-center space-x-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">
                  {Math.round((completedChapters.size / 30) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">
                  {totalTokens}
                </div>
                <div className="text-sm text-gray-400">Tokens Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Modules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-16">
        <div className="grid grid-cols-1 gap-8">
          {modules.map((module) => (
            <div 
              key={module.id}
              className="bg-white rounded-xl border-4 border-black p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
            >
              {/* Module Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(module.color)}`}>
                  <span className="text-lg">📚</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 text-black">{module.title}</h3>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm">⏱️ {module.duration}</span>
                  </div>
                </div>
              </div>

              {/* Chapters */}
              <div className={`space-y-3 transition-all duration-300 ${selectedModule === module.id ? 'block' : 'hidden'}`}>
                {module.chapters.map((chapter, index) => (
                  <button
                    key={index}
                    className={getChapterButtonClasses(module.id, chapter)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChapterClick(module.id, chapter);
                    }}
                  >
                    <span className="mr-2">
                      {isChapterCompleted(module.id, chapter) ? '✅' : '📖'}
                    </span>
                    <span className={`${isChapterCompleted(module.id, chapter) ? 'text-orange-700' : 'text-gray-700'}`}>
                      {chapter}
                    </span>
                  </button>
                ))}
                <button className="w-full mt-4 px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition">
                  <span>Start Learning</span>
                  <span>→</span>
                </button>
              </div>
            </div>
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

      {/* Finance Chatbot */}
      <FinanceChatbot />
    </div>
  );
};

export default LearnPage;