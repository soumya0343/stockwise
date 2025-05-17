import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, CheckCircle, Star, TrendingUp, BookOpen, BarChart, Award, Gift, User, Mail, Lock } from 'lucide-react';
import { api } from './utils/api';

// Constants
const CHARACTERS = [
  { id: 1, name: 'Alex', type: 'Cautious Investor', emoji: '🧠' },
  { id: 2, name: 'Jamie', type: 'Growth Seeker', emoji: '🚀' },
  { id: 3, name: 'Taylor', type: 'Risk Taker', emoji: '🔥' }
];

const LEARNING_GOALS = [
  { id: 1, text: 'Learn stock market basics', icon: <TrendingUp className="h-6 w-6" />, description: 'Master the fundamentals of stock trading' },
  { id: 2, text: 'Understand mutual funds', icon: <BarChart className="h-6 w-6" />, description: 'Learn about mutual fund investments' },
  { id: 3, text: 'Master cryptocurrency investing', icon: <Star className="h-6 w-6" />, description: 'Explore the world of digital assets' },
  { id: 4, text: 'Build a retirement strategy', icon: <Award className="h-6 w-6" />, description: 'Plan for your financial future' },
  { id: 5, text: 'Learn about real estate investing', icon: <BookOpen className="h-6 w-6" />, description: 'Understand property investments' }
];

const INVESTMENT_LEVELS = [
  { level: 'beginner', label: 'Beginner', desc: "I'm new to investing", icon: '🌱' },
  { level: 'intermediate', label: 'Intermediate', desc: "I know the basics", icon: '🌿' },
  { level: 'advanced', label: 'Advanced', desc: "I've invested before", icon: '🌳' },
  { level: 'expert', label: 'Expert', desc: "I trade regularly", icon: '🌲' }
];

const REWARDS = [
  { id: 1, text: '🏆 Beginner Badge', description: 'Earn your first achievement' },
  { id: 2, text: '🎁 Free E-Book: "Investing 101"', description: 'Comprehensive guide to get started' },
  { id: 3, text: '💰 100 XP Bonus', description: 'Jumpstart your learning journey' },
  { id: 4, text: '🔓 Unlock: Stock Simulator', description: 'Practice with virtual money' }
];

// Components
const ProgressBar = ({ step, totalSteps, xp, streak }) => (
  <div className="w-full max-w-md mb-6">
    <div className="flex items-center justify-between mb-2">
      <div className="text-sm font-medium">
        Step {step} of {totalSteps}
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-indigo-600 font-medium text-sm flex items-center">
          <Star className="h-4 w-4 mr-1" />
          {xp} XP
        </div>
        <div className="flex items-center text-amber-500 text-sm">
          <span className="mr-1">🔥</span>
          <span>{streak}</span>
        </div>
      </div>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
        style={{ width: `${(step / totalSteps) * 100}%` }}
      ></div>
    </div>
  </div>
);

const Confetti = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fall {
        0% { transform: translateY(-10%) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
      }
      .animate-confetti {
        animation: fall 3s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex justify-center overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="animate-confetti"
          style={{
            position: 'absolute',
            top: '-10%',
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF69B4'][Math.floor(Math.random() * 5)],
            borderRadius: '50%',
            animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
            opacity: 0
          }}
        />
      ))}
    </div>
  );
};

const Button = ({ onClick, children, disabled, variant = 'primary', className = '' }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    text: 'text-indigo-600 hover:text-indigo-800'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Additional Components
const InputField = ({ label, icon, type, value, onChange, placeholder, error }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-3 text-gray-400">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    investmentLevel: null,
    riskTolerance: null,
    goals: [],
    characterSelected: null
  });
  const [stats, setStats] = useState({
    xp: 0,
    streak: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const addXp = useCallback((amount) => {
    setStats(prev => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const showConfettiEffect = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }, []);

  const goToNextStep = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setStep(prev => prev + 1);
      addXp(20);
      setLoading(false);
    }, 500);
  }, [addXp]);

  const goToPrevStep = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setStep(prev => prev - 1);
      setLoading(false);
    }, 500);
  }, []);

  const toggleGoal = useCallback((goalId) => {
    setFormData(prev => {
      const newGoals = prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId];
      
      if (newGoals.length > prev.goals.length) {
        addXp(10);
        showConfettiEffect();
      }
      
      return { ...prev, goals: newGoals };
    });
  }, [addXp, showConfettiEffect]);

  const selectCharacter = useCallback((id) => {
    updateFormData('characterSelected', id);
    setStats(prev => ({ ...prev, streak: prev.streak + 1 }));
    addXp(15);
    showConfettiEffect();
  }, [updateFormData, addXp, showConfettiEffect]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (validateForm()) {
    setFormSubmitted(true);
    try {
      const response = await api.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        investmentLevel: formData.investmentLevel,
        riskTolerance: formData.riskTolerance,
        characterSelected: formData.characterSelected,
        goals: formData.goals
      });
      
      // Store auth token
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update application state
      setStats({
        xp: response.user.stats.xp,
        streak: response.user.stats.streak
      });

      // Navigate to next step
      goToNextStep();
    } catch (error) {
      setErrors({
        ...errors,
        submit: error.message || 'Registration failed'
      });
      setFormSubmitted(false);
    }
  }
};

// Add navigation guard
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // If user is already logged in, redirect to dashboard
    setStep(8);
  }
}, []);

// Update the final step to handle proper navigation
const handleStartLearning = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    setStep(7); // Go to login if not authenticated
  } else {
    window.location.href = '/dashboard'; // Navigate to dashboard if authenticated
  }
};

  const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setErrors({ submit: 'Please fill in all fields' });
            return;
        }

        setLoading(true);
        try {
            const response = await api.auth.login(formData.email, formData.password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setStep(8); // Go to dashboard
        } catch (error) {
            setErrors({
                ...errors,
                submit: error.message || 'Login failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await api.auth.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            goToNextStep();
        } catch (error) {
            setErrors({
                ...errors,
                submit: error.message || 'Registration failed. Please try again.'
            });
        } finally {
            setLoading(false);
            setFormSubmitted(false);
        }
    };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col items-center space-y-8">
            <div className="text-4xl font-bold text-center text-indigo-600 animate-fade-in">
              InvestEdu
            </div>
            <h2 className="text-2xl font-semibold text-center animate-slide-up">
              Begin Your Investment Journey
            </h2>
            <div className="flex gap-6">
              <Button
                onClick={() => goToNextStep()}
                className="transform hover:scale-105"
              >
                Start Learning
              </Button>
            </div>
            <div className="mt-8 text-center text-gray-600">
              <p>
                Already have an account?{' '}
                <Button variant="text" onClick={() => setStep(7)}>
                  Log in
                </Button>
              </p>
            </div>
            <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-100">
              <div className="flex items-center gap-2">
                <Gift className="text-amber-500" />
                <span className="text-amber-800">Complete signup to unlock 4 special rewards!</span>
              </div>
            </Card>
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-semibold text-center">Create Your Account</h2>
            <p className="text-gray-600 text-center">Join thousands of students learning to invest</p>
            <div className="w-full max-w-md space-y-4">
              <InputField
                label="Name"
                icon={<User className="h-5 w-5" />}
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Your name"
                error={errors.name}
              />
              <InputField
                label="Email"
                icon={<Mail className="h-5 w-5" />}
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="Your email"
                error={errors.email}
              />
              <InputField
                label="Password"
                icon={<Lock className="h-5 w-5" />}
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="Create a password"
                error={errors.password}
              />
            </div>
            <div className="flex justify-between w-full max-w-md mt-6">
              <Button variant="secondary" onClick={goToPrevStep}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.email || !formData.password || !formData.name}
                className={formSubmitted ? 'animate-pulse' : ''}
              >
                {formSubmitted ? 'Creating Account...' : 'Continue'}
              </Button>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Secure & encrypted
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold">Choose your investor character</h2>
              <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">+15 XP</div>
            </div>
            <p className="text-gray-600 text-center">This will personalize your learning journey</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {CHARACTERS.map(character => (
                <div
                  key={character.id}
                  onClick={() => selectCharacter(character.id)}
                  className={`border p-4 rounded-xl cursor-pointer transition transform hover:scale-105 ${formData.characterSelected === character.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200'}`}
                >
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">{character.emoji}</span>
                  </div>
                  <h3 className="font-medium text-lg text-center">{character.name}</h3>
                  <p className="text-sm text-center text-gray-600">{character.type}</p>
                  {formData.characterSelected === character.id && (
                    <div className="mt-2 flex justify-center">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between w-full max-w-md mt-6">
              <button
                onClick={() => goToPrevStep()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => goToNextStep()}
                disabled={!formData.characterSelected}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${!formData.characterSelected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold">What's your investment experience?</h2>
              <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">+20 XP</div>
            </div>
            <p className="text-gray-600 text-center">We'll customize your learning path accordingly</p>
            <div className="w-full max-w-lg space-y-3">
              {INVESTMENT_LEVELS.map(item => (
                <div
                  key={item.level}
                  onClick={() => updateFormData('investmentLevel', item.level)}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${formData.investmentLevel === item.level ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${formData.investmentLevel === item.level ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                    {formData.investmentLevel === item.level && <div className="h-2 w-2 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between w-full max-w-md mt-6">
              <button
                onClick={() => goToPrevStep()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => goToNextStep()}
                disabled={!formData.investmentLevel}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${!formData.investmentLevel ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold">What's your risk tolerance?</h2>
              <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">+20 XP</div>
            </div>
            <p className="text-gray-600 text-center">This helps us recommend suitable investment strategies</p>
            <div className="w-full max-w-lg">
              <div className="relative pt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium">Conservative</span>
                  <span className="text-xs font-medium">Aggressive</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: `${formData.riskTolerance ? (formData.riskTolerance * 25) : 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => updateFormData('riskTolerance', value)}
                      className={`h-8 w-8 rounded-full border flex items-center justify-center -mt-3 transition ${formData.riskTolerance === value ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg text-blue-800">What this means:</h3>
                {formData.riskTolerance === 1 && <p className="text-blue-700">You prefer safer investments with stable, modest returns.</p>}
                {formData.riskTolerance === 2 && <p className="text-blue-700">You prefer mostly safe investments with some growth opportunity.</p>}
                {formData.riskTolerance === 3 && <p className="text-blue-700">You seek a balance between stability and growth potential.</p>}
                {formData.riskTolerance === 4 && <p className="text-blue-700">You're comfortable with volatility for potentially higher returns.</p>}
                {formData.riskTolerance === 5 && <p className="text-blue-700">You're open to high-risk investments that may yield significant returns.</p>}
                {!formData.riskTolerance && <p className="text-blue-700">Select your risk tolerance level above.</p>}
              </div>
            </div>
            <div className="flex justify-between w-full max-w-md mt-6">
              <button
                onClick={() => goToPrevStep()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => goToNextStep()}
                disabled={!formData.riskTolerance}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${!formData.riskTolerance ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold">Select your learning goals</h2>
              <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">+10 XP each</div>
            </div>
            <p className="text-gray-600 text-center">Choose at least 2 topics you'd like to master (Select to earn XP!)</p>
            <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-3">
              {LEARNING_GOALS.map(goal => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition hover:shadow-md ${formData.goals.includes(goal.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                >
                  <div className={`mr-3 text-xl ${formData.goals.includes(goal.id) ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{goal.text}</h3>
                  </div>
                  {formData.goals.includes(goal.id) && (
                    <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between w-full max-w-md mt-6">
              <button
                onClick={() => goToPrevStep()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => goToNextStep()}
                disabled={formData.goals.length < 2}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${formData.goals.length < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
              >
                Continue {formData.goals.length < 2 && `(Select ${2 - formData.goals.length} more)`}
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col items-center space-y-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl">
              🎉
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-center">You're all set!</h2>
              <p className="text-gray-600 text-center mt-2">Your personalized investment learning path is ready</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{formData.name || 'Investor'}</h3>
                    <div className="text-sm text-gray-500">
                      {formData.investmentLevel === 'beginner' ? 'Beginner Investor' :
                       formData.investmentLevel === 'intermediate' ? 'Intermediate Investor' :
                       formData.investmentLevel === 'advanced' ? 'Advanced Investor' :
                       'Expert Investor'}
                    </div>
                  </div>
                </div>
                <div className="text-indigo-600 font-bold text-xl">{stats.xp} XP</div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">UNLOCKED REWARDS</h4>
                <div className="space-y-2">
                  {REWARDS.map((reward, index) => (
                    <div key={index} className="flex items-center bg-white p-2 rounded-lg">
                      <div className="mr-2">{reward.text.slice(0, 2)}</div>
                      <div className="text-sm">{reward.text.slice(3)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">YOUR LEARNING PATH</h4>
                <div className="bg-white p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Daily Streak</div>
                    <div className="flex items-center text-amber-500">
                      <span className="mr-1">🔥</span>
                      <span>{stats.streak} days</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 text-right">Level 1: 8% complete</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(8)} // Dashboard
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 flex items-center"
            >
              Start Learning <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        );

      case 7: // Login
        return (
            <div className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Welcome back!</h2>
                <p className="text-gray-600 text-center">Log in to continue your investment journey</p>
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }} 
                    className="w-full max-w-md space-y-4"
                >
                    <InputField
                        label="Email"
                        icon={<Mail className="h-5 w-5" />}
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="Your email"
                        error={errors.email}
                    />
                    <InputField
                        label="Password"
                        icon={<Lock className="h-5 w-5" />}
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        placeholder="Your password"
                        error={errors.password}
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>
                        <button 
                            type="button"
                            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {errors.submit && (
                        <div className="w-full bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading || !formData.email || !formData.password}
                        className="w-full py-3 bg-amber-600 hover:bg-amber-700"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Logging in...
                            </div>
                        ) : (
                            'Log In'
                        )}
                    </Button>
                </form>

                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 w-full max-w-md">
                    <div className="flex items-center gap-2">
                        <Gift className="text-amber-500" />
                        <span className="text-amber-800">First time here?</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Create an account to start your investment journey and unlock special rewards.
                    </p>
                    <Button
                        variant="secondary"
                        onClick={() => setStep(1)}
                        className="mt-3 w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                    >
                        Sign up now
                    </Button>
                </Card>
            </div>
        );

      case 8: // Dashboard preview
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-indigo-600 w-full py-6 px-4 rounded-lg text-white">
              <h2 className="text-2xl font-semibold text-center">Welcome to InvestEdu!</h2>
              <p className="text-center opacity-80 mt-1">Your personalized dashboard is ready</p>
              <div className="flex justify-center gap-4 mt-4">
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <div className="text-xs opacity-70">XP</div>
                  <div className="font-semibold">{stats.xp}</div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <div className="text-xs opacity-70">Streak</div>
                  <div className="font-semibold">{stats.streak} days</div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <div className="text-xs opacity-70">Level</div>
                  <div className="font-semibold">1</div>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg w-full">
              <h3 className="font-medium flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-amber-500" />
                Today's Lesson
              </h3>
              <p className="text-sm text-gray-700 mt-1">Understanding Risk vs. Reward</p>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">5 min to complete</div>
                <button className="px-3 py-1 bg-amber-500 text-white text-sm rounded-lg">Start</button>
              </div>
            </div>
            <div className="w-full">
              <h3 className="font-medium mb-2">Your Learning Path</h3>
              <div className="space-y-2">
                {formData.goals.map(goalId => {
                  const goal = LEARNING_GOALS.find(g => g.id === goalId);
                  return goal ? (
                    <div key={goal.id} className="flex items-center p-3 border rounded-lg">
                      <div className="mr-3 text-indigo-600">
                        {goal.icon}
                      </div>
                      <div>
                        <h4>{goal.text}</h4>
                        <div className="mt-1 h-1.5 bg-gray-100 rounded-full w-32">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                      <button className="ml-auto px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">Start</button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="flex justify-center w-full mt-4">
              <button
                onClick={() => setStep(0)} // Reset to start
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800"
              >
                Restart Demo
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
      {showConfetti && <Confetti />}
      {step > 0 && step < 7 && (
        <ProgressBar step={step} totalSteps={6} xp={stats.xp} streak={stats.streak} />
      )}
      <div
        className={`w-full max-w-2xl bg-white p-6 rounded-xl shadow-sm transition-all duration-300 ${
          loading ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingPage; 
