import React from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const IndexInvestPage = () => {
  const navigate = useNavigate();

  const indexOptions = [
    {
      id: 1,
      name: "Nifty 50 Index Fund",
      description: "Tracks the performance of India's top 50 companies",
      returns: "12.5% (3Y)",
      expense: "0.10%",
      minInvestment: "₹500",
      fundHouse: "SBI Mutual Fund",
    },
    {
      id: 2,
      name: "Sensex Index Fund",
      description: "Tracks the performance of BSE Sensex 30 companies",
      returns: "11.8% (3Y)",
      expense: "0.12%",
      minInvestment: "₹500",
      fundHouse: "HDFC Mutual Fund",
    },
    {
      id: 3,
      name: "Nifty Next 50 Index Fund",
      description: "Tracks the next 50 largest companies after Nifty 50",
      returns: "13.2% (3Y)",
      expense: "0.15%",
      minInvestment: "₹1000",
      fundHouse: "UTI Mutual Fund",
    },
    {
      id: 4,
      name: "Bank Nifty Index Fund",
      description: "Tracks the performance of major banking stocks",
      returns: "14.5% (3Y)",
      expense: "0.20%",
      minInvestment: "₹1000",
      fundHouse: "ICICI Prudential",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-6 mb-12">
          <button
            onClick={() => navigate("/invest")}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Back to Investment Options</span>
          </button>
          <h1 className="text-4xl font-bold">Index Fund Options</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {indexOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{option.name}</h3>
                <span className="bg-purple-100 text-purple-600 font-bold px-3 py-1 rounded-full">
                  {option.fundHouse}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{option.description}</p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Returns:</span>
                  <span className="font-bold text-green-600">
                    {option.returns}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expense Ratio:</span>
                  <span className="font-bold">{option.expense}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Min Investment:</span>
                  <span className="font-bold">{option.minInvestment}</span>
                </div>
              </div>

              <button
                onClick={() =>
                  toast.info(
                    "This would connect to a payment gateway in production!"
                  )
                }
                className="w-full py-3 px-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all duration-200"
              >
                Invest Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexInvestPage;
