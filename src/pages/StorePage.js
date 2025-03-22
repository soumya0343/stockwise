import React, { useState } from 'react';
import { ShoppingBag, Coffee, Pizza, ShoppingCart, Gift, Ticket, Watch, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StorePage = () => {
  const navigate = useNavigate();
  const [userTokens, setUserTokens] = useState(() => {
    // Load tokens from localStorage on component mount
    const saved = localStorage.getItem('totalTokens');
    return saved ? parseInt(saved) : 0;
  });
  
  // Load redeemed rewards from localStorage
  const [redeemedRewards, setRedeemedRewards] = useState(() => {
    const saved = localStorage.getItem('redeemedRewards');
    return saved ? JSON.parse(saved) : [];
  });

  const rewards = [
    {
      id: 1,
      name: "Starbucks Coffee",
      description: "₹50 off on any Starbucks purchase",
      cost: 100,
      icon: <Coffee className="w-8 h-8" />,
      brand: "Starbucks"
    },
    {
      id: 2,
      name: "Pizza Discount",
      description: "₹100 off on any pizza order",
      cost: 200,
      icon: <Pizza className="w-8 h-8" />,
      brand: "Dominos"
    },
    {
      id: 3,
      name: "BookMyShow Tickets",
      description: "₹200 off on movie tickets",
      cost: 300,
      icon: <Ticket className="w-8 h-8" />,
      brand: "BookMyShow"
    },
    {
      id: 4,
      name: "Fastrack Watches",
      description: "15% off on all Fastrack watches",
      cost: 400,
      icon: <Watch className="w-8 h-8" />,
      brand: "Fastrack"
    },
    {
      id: 5,
      name: "Myntra Fashion",
      description: "₹300 off on minimum purchase of ₹1500",
      cost: 350,
      icon: <ShoppingBag className="w-8 h-8" />,
      brand: "Myntra"
    },
    {
      id: 6,
      name: "Casio Watches",
      description: "₹500 off on Casio watches",
      cost: 600,
      icon: <Clock className="w-8 h-8" />,
      brand: "Casio"
    },
    {
      id: 7,
      name: "Shopping Voucher",
      description: "₹200 off on minimum purchase of ₹1000",
      cost: 400,
      icon: <ShoppingCart className="w-8 h-8" />,
      brand: "Amazon"
    },
    {
      id: 8,
      name: "Gift Card",
      description: "₹500 gift card for any merchant",
      cost: 1000,
      icon: <Gift className="w-8 h-8" />,
      brand: "Multiple"
    }
  ];

  const handleRedeem = (reward) => {
    if (userTokens >= reward.cost) {
      // Update user tokens
      const newTokens = userTokens - reward.cost;
      setUserTokens(newTokens);
      localStorage.setItem('totalTokens', newTokens.toString());

      // Store only the essential reward data without React components
      const rewardData = {
        id: reward.id,
        name: reward.name,
        description: reward.description,
        cost: reward.cost,
        brand: reward.brand,
        iconType: reward.id // We'll use this to determine which icon to show
      };

      // Update redeemed rewards
      const updatedRedeemedRewards = [...redeemedRewards, rewardData];
      setRedeemedRewards(updatedRedeemedRewards);
      localStorage.setItem('redeemedRewards', JSON.stringify(updatedRedeemedRewards));

      alert(`Successfully redeemed ${reward.name}!`);
    } else {
      alert('Not enough tokens! Complete more chapters to earn tokens.');
    }
  };

  // Helper function to get the appropriate icon component
  const getIconComponent = (iconType) => {
    switch (iconType) {
      case 1: return <Coffee className="w-8 h-8" />;
      case 2: return <Pizza className="w-8 h-8" />;
      case 3: return <Ticket className="w-8 h-8" />;
      case 4: return <Watch className="w-8 h-8" />;
      case 5: return <ShoppingBag className="w-8 h-8" />;
      case 6: return <Clock className="w-8 h-8" />;
      case 7: return <ShoppingCart className="w-8 h-8" />;
      case 8: return <Gift className="w-8 h-8" />;
      default: return <ShoppingBag className="w-8 h-8" />;
    }
  };

  // Filter out already redeemed rewards
  const availableRewards = rewards.filter(
    reward => !redeemedRewards.some(r => r.id === reward.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/learn')}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Back to Learn</span>
            </button>
            <h1 className="text-4xl font-bold">stock<span className="text-orange-600">wise</span> Store</h1>
          </div>
          <div className="bg-white p-4 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
              <span className="text-xl font-bold">{userTokens} Reward Tokens</span>
            </div>
          </div>
        </div>

        {/* Available Rewards Grid */}
        {availableRewards.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Available Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRewards.map((reward) => (
                <div 
                  key={reward.id}
                  className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] hover:shadow-[8px_8px_0px_rgba(31,41,55,0.8)] transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        {getIconComponent(reward.id)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{reward.name}</h3>
                        <p className="text-sm text-gray-600">{reward.brand}</p>
                      </div>
                    </div>
                    <div className="bg-orange-100 px-3 py-1 rounded-full">
                      <span className="font-bold text-orange-600">{reward.cost} Tokens</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{reward.description}</p>
                  
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={userTokens < reward.cost}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                      userTokens >= reward.cost
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {userTokens >= reward.cost ? 'Redeem Now' : 'Not Enough Tokens'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Redeemed Rewards Section */}
        {redeemedRewards.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Your Redeemed Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redeemedRewards.map((reward) => (
                <div 
                  key={reward.id}
                  className="bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      {getIconComponent(reward.iconType)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{reward.name}</h3>
                      <p className="text-sm text-gray-600">{reward.brand}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{reward.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Available Rewards Message */}
        {availableRewards.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No Available Rewards</h2>
            <p className="text-gray-600">You've redeemed all available rewards! Complete more chapters to earn tokens and unlock new rewards.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage; 