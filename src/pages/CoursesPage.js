import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';

const CoursesPage = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showChapterContent, setShowChapterContent] = useState(false);

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
      duration: "2.5 hours",
      color: "bg-green-100",
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
      color: "bg-purple-100",
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
      color: "bg-pink-100",
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
      duration: "4 hours",
      color: "bg-orange-100",
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
      duration: "4 hours",
      color: "bg-yellow-100",
      chapters: [
        "Futures Basics",
        "Futures Pricing",
        "Futures Strategies",
        "Hedging with Futures",
        "Futures Trading Examples"
      ]
    }
  ];

  const chapterContent = {
    "The Need to Invest": {
      content: `<div class="space-y-4">
        <p>Understanding why investment is crucial for financial growth and long-term wealth creation.</p>
        <h3 class="font-bold">Key Points:</h3>
        <ul class="list-disc pl-5">
          <li>Power of Compounding</li>
          <li>Beating Inflation</li>
          <li>Creating Passive Income</li>
          <li>Building Long-term Wealth</li>
        </ul>
      </div>`,
      quiz: [
        {
          question: "What is the primary benefit of compound interest?",
          options: ["Earning interest on interest", "Fixed returns", "No risk", "Immediate profits"],
          correct: 0
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50 p-8">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200 hover:bg-gray-50 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">Back to Home</span>
      </Link>

      {/* Learning Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`${module.color} p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200`}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{module.title}</h2>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="text-sm text-gray-500 mb-4">{module.duration}</div>
            <div className="space-y-2">
              {module.chapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedModule(module.id);
                    setSelectedChapter(chapter);
                    setShowChapterContent(true);
                  }}
                  className="w-full text-left p-3 rounded-lg bg-white bg-opacity-50 hover:bg-opacity-75 transition-all duration-200"
                >
                  {chapter}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Chapter Content Modal */}
      {showChapterContent && selectedChapter && chapterContent[selectedChapter] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{selectedChapter}</h2>
              <button 
                onClick={() => setShowChapterContent(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div 
              dangerouslySetInnerHTML={{ __html: chapterContent[selectedChapter].content }}
              className="prose max-w-none mb-8"
            />
            <div className="space-y-6">
              {chapterContent[selectedChapter].quiz.map((quizItem, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-4">{quizItem.question}</p>
                  <div className="space-y-2">
                    {quizItem.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        className="w-full text-left p-3 rounded-lg bg-white hover:bg-gray-50 border transition-colors duration-200"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage; 