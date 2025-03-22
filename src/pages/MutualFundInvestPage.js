import React from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MutualFundInvestPage = () => {
  const navigate = useNavigate();

  const mutualFundOptions = [
    {
      id: 1,
      name: "HDFC Mid-Cap Opportunities Fund",
      description: "Focuses on mid-sized companies with high growth potential",
      returns: "15.8% (5Y)",
      expense: "1.75%",
      minSIP: "₹500",
      rating: "5★"
    },
    {
      id: 2,
      name: "Axis Bluechip Fund",
      description: "Invests in large-cap companies with stable returns",
      returns: "14.2% (5Y)",
      expense: "1.65%",
      minSIP: "₹500",
      rating: "4★"
    },
    {
      id: 3,
      name: "SBI Small Cap Fund",
      description: "Focuses on emerging small-cap companies",
      returns: "16.5% (5Y)",
      expense: "1.85%",
      minSIP: "₹1000",
      rating: "5★"
    },
    {
      id: 4,
      name: "Mirae Asset Large Cap Fund",
      description: "Invests in top 100 companies by market cap",
      returns: "13.9% (5Y)",
      expense: "1.70%",
      minSIP: "₹1000",
      rating: "4★"
    },
    {
      id: 5,
      name: "ICICI Prudential Technology Fund",
      description: "Focuses on technology sector companies",
      returns: "18.2% (5Y)",
      expense: "1.80%",
      minSIP: "₹1000",
      rating: "5★"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-6 mb-12">
          <button
            onClick={() => navigate('/invest')}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Back to Investment Options</span>
          </button>
          <h1 className="text-4xl font-bold">Mutual Fund Options</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mutualFundOptions.map((option) => (
            <div 
              key={option.id}
              className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{option.name}</h3>
                <span className="bg-green-100 text-green-600 font-bold px-3 py-1 rounded-full">
                  {option.rating}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{option.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Returns:</span>
                  <span className="font-bold text-green-600">{option.returns}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expense Ratio:</span>
                  <span className="font-bold">{option.expense}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Min SIP Amount:</span>
                  <span className="font-bold">{option.minSIP}</span>
                </div>
              </div>
              
              <button
                onClick={() => alert('This would connect to a payment gateway in production!')}
                className="w-full py-3 px-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all duration-200"
              >
                Start SIP
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MutualFundInvestPage; 