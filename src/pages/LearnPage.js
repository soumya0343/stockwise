import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import FinanceChatbot from '../components/FinanceChatbot';

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
    }
  };

  const modules = [
    {
      id: 1,
      title: "Introduction to Stock Markets",
      duration: "4-5 hours",
      chapters: [
        "The Need to Invest",
        "Regulators & Participants",
        "Stock Markets Index",
        "Trading & Settlement",
        "Risk Management & Trading Psychology"
      ],
      color: "purple"
    },
    {
      id: 2,
      title: "Technical Analysis",
      duration: "8-10 hours",
      chapters: [
        "Candlesticks Patterns",
        "Support & Resistance",
        "Moving Averages",
        "Indicators & Oscillators",
        "Chart Patterns"
      ],
      color: "blue"
    },
    {
      id: 3,
      title: "Fundamental Analysis",
      duration: "10-12 hours",
      chapters: [
        "The IPO Markets",
        "Understanding Annual Reports",
        "Financial Ratios",
        "Equity Research",
        "Company Analysis"
      ],
      color: "green"
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
      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-black">stockwise varsity</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Your comprehensive guide to financial markets. Learn at your own pace with our structured modules.
          </p>
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
                  style={{ width: `${(completedChapters.size / 15) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>{completedChapters.size} chapters completed</span>
                <span>{15 - completedChapters.size} remaining</span>
              </div>
            </div>
            <div className="flex items-center space-x-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">
                  {Math.round((completedChapters.size / 15) * 100)}%
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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