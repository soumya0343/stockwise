import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, ChevronRight, Clock, BarChart2, BookOpen, TrendingUp, PieChart, DollarSign, Briefcase, Shield } from 'lucide-react';

const LearnPage = () => {
  const [selectedModule, setSelectedModule] = useState(null);

  const modules = [
    {
      id: 1,
      title: "Introduction to Stock Markets",
      icon: <BookOpen className="w-6 h-6" />,
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
      icon: <TrendingUp className="w-6 h-6" />,
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
      icon: <BarChart2 className="w-6 h-6" />,
      duration: "10-12 hours",
      chapters: [
        "The IPO Markets",
        "Understanding Annual Reports",
        "Financial Ratios",
        "Equity Research",
        "Company Analysis"
      ],
      color: "green"
    },
    {
      id: 4,
      title: "Portfolio Management",
      icon: <PieChart className="w-6 h-6" />,
      duration: "6-8 hours",
      chapters: [
        "Asset Allocation",
        "Risk Assessment",
        "Portfolio Strategies",
        "Rebalancing Techniques",
        "Performance Tracking"
      ],
      color: "orange"
    },
    {
      id: 5,
      title: "Options Trading",
      icon: <DollarSign className="w-6 h-6" />,
      duration: "12-15 hours",
      chapters: [
        "Options Basics",
        "Option Pricing",
        "Greeks",
        "Options Strategies",
        "Risk Management"
      ],
      color: "red"
    },
    {
      id: 6,
      title: "Personal Finance",
      icon: <Briefcase className="w-6 h-6" />,
      duration: "5-6 hours",
      chapters: [
        "Financial Planning",
        "Emergency Fund",
        "Insurance Planning",
        "Tax Planning",
        "Retirement Planning"
      ],
      color: "teal"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200",
      red: "bg-red-100 text-red-600 border-red-200",
      teal: "bg-teal-100 text-teal-600 border-teal-200"
    };
    return colorMap[color] || colorMap.purple;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">stockwise varsity</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive guide to financial markets. Learn at your own pace with our structured modules.
          </p>
        </div>
      </div>

      {/* Learning Modules */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <motion.div
              key={module.id}
              variants={itemVariants}
              className="bg-white rounded-xl border-4 border-black p-6 transform transition hover:translate-y-1 hover:shadow-neo cursor-pointer"
              onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
            >
              {/* Module Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(module.color)}`}>
                  {module.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{module.title}</h3>
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{module.duration}</span>
                  </div>
                </div>
              </div>

              {/* Chapters */}
              <div className={`space-y-3 transition-all duration-300 ${selectedModule === module.id ? 'block' : 'hidden'}`}>
                {module.chapters.map((chapter, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <Book className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{chapter}</span>
                  </div>
                ))}
                <button className="w-full mt-4 px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition">
                  <span>Start Learning</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress Tracker */}
      <div className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Track Your Progress</h2>
              <p className="text-gray-400">Complete modules to earn certificates</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">0/6</div>
                <div className="text-sm text-gray-400">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">0/30</div>
                <div className="text-sm text-gray-400">Chapters</div>
              </div>
              <Shield className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add shadow styles
const style = document.createElement('style');
style.textContent = `
  .shadow-neo {
    box-shadow: 4px 4px 0px rgba(0,0,0,0.9);
  }
`;
document.head.appendChild(style);

export default LearnPage; 