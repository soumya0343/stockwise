import React from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StockInvestPage = () => {
  const navigate = useNavigate();

  const stockOptions = [
    {
      id: 1,
      name: "Reliance Industries",
      sector: "Oil & Gas",
      price: "₹2,450",
      change: "+1.5%",
      marketCap: "16.5L Cr",
      pe: "22.5"
    },
    {
      id: 2,
      name: "HDFC Bank",
      sector: "Banking",
      price: "₹1,650",
      change: "+0.8%",
      marketCap: "12.2L Cr",
      pe: "20.1"
    },
    {
      id: 3,
      name: "Infosys",
      sector: "IT",
      price: "₹1,420",
      change: "-0.5%",
      marketCap: "6.8L Cr",
      pe: "25.3"
    },
    {
      id: 4,
      name: "TCS",
      sector: "IT",
      price: "₹3,250",
      change: "+0.3%",
      marketCap: "11.5L Cr",
      pe: "27.8"
    },
    {
      id: 5,
      name: "ICICI Bank",
      sector: "Banking",
      price: "₹950",
      change: "+1.2%",
      marketCap: "7.2L Cr",
      pe: "18.5"
    },
    {
      id: 6,
      name: "HUL",
      sector: "FMCG",
      price: "₹2,580",
      change: "-0.2%",
      marketCap: "5.8L Cr",
      pe: "65.2"
    },
    {
      id: 7,
      name: "ITC",
      sector: "FMCG",
      price: "₹420",
      change: "+2.1%",
      marketCap: "5.2L Cr",
      pe: "25.6"
    },
    {
      id: 8,
      name: "Bharti Airtel",
      sector: "Telecom",
      price: "₹850",
      change: "+0.9%",
      marketCap: "4.8L Cr",
      pe: "32.4"
    },
    {
      id: 9,
      name: "L&T",
      sector: "Engineering",
      price: "₹2,780",
      change: "+1.8%",
      marketCap: "3.9L Cr",
      pe: "28.7"
    },
    {
      id: 10,
      name: "Axis Bank",
      sector: "Banking",
      price: "₹980",
      change: "+0.6%",
      marketCap: "3.2L Cr",
      pe: "16.9"
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
          <h1 className="text-4xl font-bold">Top 10 Nifty 50 Stocks</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stockOptions.map((stock) => (
            <div 
              key={stock.id}
              className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{stock.name}</h3>
                <span className="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-full">
                  {stock.sector}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Price:</span>
                  <span className="font-bold">{stock.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Today's Change:</span>
                  <span className={`font-bold ${stock.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Market Cap:</span>
                  <span className="font-bold">{stock.marketCap}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">P/E Ratio:</span>
                  <span className="font-bold">{stock.pe}</span>
                </div>
              </div>
              
              <button
                onClick={() => alert('This would connect to a payment gateway in production!')}
                className="w-full py-3 px-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all duration-200"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockInvestPage; 