import React, { useState } from 'react';
import { Heart, Activity, Award, TrendingUp, CheckCircle, AlertCircle, Moon, Droplet } from 'lucide-react';

export default function HealthCompassDesigns() {
  const [activeTab, setActiveTab] = useState('landing');

  // Landing Page Hero
  const LandingHero = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">HealthCompass</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Features</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">Login</button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                Sign Up
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Personal <span className="text-blue-600">Health</span> Partner
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your fitness, analyze symptoms with AI, and earn rewards for staying healthy
          </p>
          <button className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition shadow-lg">
            Get Started Free
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Symptom Checker</h3>
            <p className="text-gray-600">Get instant analysis of your symptoms with AI-powered recommendations</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fitness Tracker</h3>
            <p className="text-gray-600">Monitor your daily activities, sleep, and hydration levels</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Rewards System</h3>
            <p className="text-gray-600">Earn points for healthy habits and unlock achievements</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Login Page
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to continue your health journey</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md">
            Login
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button className="mt-4 w-full py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Login with Google</span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );

  // Dashboard
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HealthCompass</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Hello, User</span>
            <button className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input type="text" placeholder="Full Name" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="number" placeholder="Age" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="number" placeholder="Height (cm)" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="number" placeholder="Weight (kg)" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Save Profile
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-500">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Symptom Checker</h3>
            <p className="text-gray-600 mb-4">Analyze your symptoms with AI</p>
            <button className="text-blue-600 font-medium hover:text-blue-700">Open →</button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fitness Tracker</h3>
            <p className="text-gray-600 mb-4">Track your daily activities</p>
            <button className="text-green-600 font-medium hover:text-green-700">Open →</button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-purple-500">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Rewards System</h3>
            <p className="text-gray-600 mb-4">View your earned points</p>
            <button className="text-purple-600 font-medium hover:text-purple-700">Open →</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Symptom Checker
  const SymptomChecker = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">AI Symptom Checker</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Describe Your Symptoms</label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows="4"
                placeholder="e.g., I have a headache, fever, and sore throat..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Treatment</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="treatment" className="w-4 h-4 text-blue-600" />
                  <span>Allopathy</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="treatment" className="w-4 h-4 text-blue-600" />
                  <span>Ayurveda</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="treatment" className="w-4 h-4 text-blue-600" />
                  <span>Homeopathy</span>
                </label>
              </div>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md">
              Analyze Symptoms
            </button>
          </div>

          {/* Sample Result */}
          <div className="mt-8 border-t pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Analysis Result</h3>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Medium Risk
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Confidence</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              Based on your symptoms, you may be experiencing a common cold or flu. Rest, hydration, and over-the-counter medications may help.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  <strong>Medical Disclaimer:</strong> This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Fitness Tracker
  const FitnessTracker = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Fitness Tracker</h2>
          
          {/* Fitness Score */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Today's Fitness Score</p>
              <div className="text-6xl font-bold text-green-600 mb-2">85</div>
              <p className="text-sm text-gray-600">Great job! Keep it up!</p>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Activity className="w-4 h-4 inline mr-1" />
                Steps Today
              </label>
              <input 
                type="number" 
                placeholder="8000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Moon className="w-4 h-4 inline mr-1" />
                Sleep (hours)
              </label>
              <input 
                type="number" 
                placeholder="7.5"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Droplet className="w-4 h-4 inline mr-1" />
                Water (litres)
              </label>
              <input 
                type="number" 
                placeholder="2.5"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md">
            Save Today's Data
          </button>

          {/* History */}
          <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { date: 'Jan 17, 2026', score: 85, steps: 8500, sleep: 7.5, water: 2.5 },
                { date: 'Jan 16, 2026', score: 72, steps: 6200, sleep: 6, water: 2.0 },
                { date: 'Jan 15, 2026', score: 90, steps: 10000, sleep: 8, water: 3.0 },
              ].map((day, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{day.date}</span>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>{day.steps} steps</span>
                    <span>{day.sleep}h sleep</span>
                    <span>{day.water}L water</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      Score: {day.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Rewards Page
  const RewardsPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Rewards & Achievements</h2>
          
          {/* Total Points */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 mb-8 text-center">
            <Award className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Total Reward Points</p>
            <div className="text-5xl font-bold text-purple-600">1,250</div>
          </div>

          {/* Reward History */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Rewards</h3>
          <div className="space-y-3">
            {[
              { date: 'Jan 17, 2026', points: 50, activity: 'Completed daily fitness goal' },
              { date: 'Jan 16, 2026', points: 30, activity: '8000+ steps achieved' },
              { date: 'Jan 15, 2026', points: 100, activity: 'Perfect fitness score (90+)' },
              { date: 'Jan 14, 2026', points: 25, activity: 'Good hydration maintained' },
            ].map((reward, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{reward.activity}</p>
                  <p className="text-sm text-gray-600">{reward.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-purple-600">+{reward.points}</span>
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Tab Navigation */}
      <div className="bg-gray-900 text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {[
            { id: 'landing', name: 'Landing Page' },
            { id: 'login', name: 'Login' },
            { id: 'dashboard', name: 'Dashboard' },
            { id: 'symptom', name: 'Symptom Checker' },
            { id: 'fitness', name: 'Fitness' },
            { id: 'rewards', name: 'Rewards' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'landing' && <LandingHero />}
        {activeTab === 'login' && <LoginPage />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'symptom' && <SymptomChecker />}
        {activeTab === 'fitness' && <FitnessTracker />}
        {activeTab === 'rewards' && <RewardsPage />}
      </div>
    </div>
  );
}