import React, { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  BarChart2,
  PieChart,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InvestPage = () => {
  const navigate = useNavigate();
  const [selectedGoal] = useState(() => {
    // Get the selected goal from localStorage
    return localStorage.getItem("selectedGoal") || "car";
  });
  const [amount] = useState(() => {
    // Get the target amount from localStorage
    return localStorage.getItem("targetAmount") || "3500000";
  });

  // Get completed chapters from localStorage
  const getCompletedChapters = () => {
    const saved = localStorage.getItem("completedChapters");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  };

  // Check if a module is completed by verifying all its chapters are completed
  const isModuleCompleted = (moduleChapters) => {
    const completedChapters = getCompletedChapters();
    return moduleChapters.every((chapter) => completedChapters.has(chapter));
  };

  // Define module chapters
  const stockMarketChapters = [
    "The Need to Invest",
    "Regulators & Participants",
    "Stock Markets Index",
    "Trading & Settlement",
    "Risk Management & Trading Psychology",
  ];

  const mutualFundsChapters = [
    "Introduction to Mutual Funds",
    "Types of Mutual Funds",
    "Understanding SIP",
    "Fund Selection & Analysis",
    "Taxation & Regulations",
  ];

  const technicalAnalysisChapters = [
    "Introduction to Technical Analysis",
    "Chart Types and Patterns",
    "Technical Indicators",
    "Volume Analysis",
    "Trading Strategies",
  ];

  const fundamentalAnalysisChapters = [
    "Introduction to Fundamental Analysis",
    "Financial Statements",
    "Ratio Analysis",
    "Industry Analysis",
    "Company Valuation",
  ];

  const investmentOptions = [
    {
      id: 1,
      title: "Stock Market Investment",
      description: "Direct investment in stocks for potentially higher returns",
      risk: "High",
      minInvestment: "₹500",
      expectedReturns: "12-15% p.a.",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      requiredCourses: "all",
    },
    {
      id: 2,
      title: "Mutual Funds SIP",
      description: "Systematic Investment Plan in diversified mutual funds",
      risk: "Medium",
      minInvestment: "₹100",
      expectedReturns: "10-12% p.a.",
      icon: <BarChart2 className="w-8 h-8" />,
      color: "bg-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      requiredChapters: mutualFundsChapters,
    },
    {
      id: 3,
      title: "Index Funds",
      description: "Low-cost funds that track market indices",
      risk: "Medium-Low",
      minInvestment: "₹100",
      expectedReturns: "8-10% p.a.",
      icon: <PieChart className="w-8 h-8" />,
      color: "bg-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
      requiredChapters: stockMarketChapters,
    },
  ];

  const handleInvestClick = (option) => {
    if (option.requiredCourses === "all") {
      const isStockMarketCompleted = isModuleCompleted(stockMarketChapters);
      const isMutualFundsCompleted = isModuleCompleted(mutualFundsChapters);
      const isTechnicalAnalysisCompleted = isModuleCompleted(
        technicalAnalysisChapters
      );
      const isFundamentalAnalysisCompleted = isModuleCompleted(
        fundamentalAnalysisChapters
      );

      if (
        !isStockMarketCompleted ||
        !isMutualFundsCompleted ||
        !isTechnicalAnalysisCompleted ||
        !isFundamentalAnalysisCompleted
      ) {
        toast.warning(
          "Please complete all courses (Stock Market, Mutual Funds, Technical Analysis, and Fundamental Analysis) before investing in stocks directly."
        );
        return;
      }
      navigate("/invest/stocks");
    } else if (option.requiredChapters) {
      if (!isModuleCompleted(option.requiredChapters)) {
        toast.warning(
          `Please complete the ${option.title} course before investing in this option.`
        );
        return;
      }

      // Navigate to appropriate page based on investment type
      if (option.title === "Mutual Funds SIP") {
        navigate("/invest/mutual-funds");
      } else if (option.title === "Index Funds") {
        navigate("/invest/index");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate("/learn")}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Back to Learn</span>
            </button>
            <h1 className="text-4xl font-bold">Investment Options</h1>
          </div>
        </div>

        {/* Goal Summary */}
        <div className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Your {selectedGoal === "car" ? "Dream Car" : "Dream Vacation"}{" "}
                Goal
              </h2>
              <p className="text-gray-600">
                Target Amount: ₹{(amount / 100000).toFixed(1)}L
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-orange-600" />
          </div>
        </div>

        {/* Investment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {investmentOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${option.color} p-3 rounded-lg ${option.borderColor}`}
                >
                  {option.icon}
                </div>
                <span
                  className={`${option.textColor} font-bold px-3 py-1 rounded-full ${option.color}`}
                >
                  {option.risk} Risk
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-4">{option.description}</p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Min Investment:</span>
                  <span className="font-bold">{option.minInvestment}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expected Returns:</span>
                  <span className="font-bold">{option.expectedReturns}</span>
                </div>
              </div>

              <button
                onClick={() => handleInvestClick(option)}
                className="w-full py-3 px-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center"
              >
                Start Investing
              </button>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-orange-800 mb-2">
                Important Notice
              </h3>
              <p className="text-orange-700 text-sm">
                Investment in securities market are subject to market risks.
                Read all the related documents carefully before investing. Past
                performance is not indicative of future returns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestPage;
