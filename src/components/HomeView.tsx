// @ts-nocheck
import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginPage from './Login'; 
import SignupPage from './SignUp';
import { useNavigate } from 'react-router-dom';

const HomeView = () => {
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleLoginSuccess = (user, token) => {
    // In a real app, you would store this in state management
    console.log('Login successful:', user, token);
    // Navigate to dashboard
    closeModal();
    navigate('/dashboard'); 
  };

  const handleSignupSuccess = () => {
    // Switch to login modal after successful signup
    setActiveModal('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 text-gray-200">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-gray-700/95 backdrop-blur-sm border-b border-gray-600 shadow-lg">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center text-xl font-bold text-gray-200">
            <span className="text-2xl text-emerald-400 mr-2">⚡</span>
            Smart Energy Monitor
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => openModal('login')}
              className="px-6 py-3 border-2 border-gray-600 text-gray-200 rounded-full font-semibold hover:bg-gray-600 hover:border-emerald-400 hover:text-emerald-400 transition-all duration-300 transform hover:-translate-y-1"
            >
              Login
            </button>
            <button
              onClick={() => openModal('signup')}
              // onClick={() => e.preventDefault()}

              className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-gray-900 rounded-full font-semibold shadow-lg hover:shadow-emerald-400/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-8 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg animate-fade-in-up">
            Home Energy Management Made Simple
          </h1>
          <p className="text-xl mb-8 opacity-90 animate-fade-in-up delay-200">
            Monitor, analyze, and optimize your energy consumption with our intelligent IoT-powered platform. 
            Take control of your energy costs and reduce your environmental footprint.
          </p>
          <button
            onClick={() => openModal('signup')}
            className="px-8 py-4 text-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-gray-900 rounded-full font-semibold shadow-lg hover:shadow-emerald-400/40 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up delay-400"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-700">
            Powerful Features for Complete Energy Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Real-time Monitoring",
                description: "Track your energy consumption in real-time with detailed analytics. Monitor voltage, current, and power usage across all your devices instantly."
              },
              {
                icon: "🚨",
                title: "Smart Alerts",
                description: "Receive intelligent notifications about unusual energy patterns, potential issues, and optimization opportunities before they impact your bills."
              },
              {
                icon: "📱",
                title: "IoT Device Management",
                description: "Seamlessly connect and manage all your smart meters and energy devices from a single, intuitive dashboard interface."
              },
              {
                icon: "💡",
                title: "Energy Optimization",
                description: "Get personalized recommendations and automated insights to reduce energy waste and lower your electricity bills significantly."
              },
              {
                icon: "📈",
                title: "Advanced Analytics",
                description: "Access comprehensive reports, usage trends, and predictive analytics to make informed decisions about your energy consumption."
              },
              {
                icon: "🔒",
                title: "Secure & Reliable",
                description: "Enterprise-grade security ensures your data is protected while our reliable infrastructure guarantees 99.9% uptime for continuous monitoring."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl text-center border border-gray-200 hover:transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <span className="text-5xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-gray-700 to-gray-600 text-white py-16 px-8 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { stat: "25%", label: "Average Energy Savings" },
              { stat: "10K+", label: "Devices Monitored" },
              { stat: "99.9%", label: "System Uptime" },
              { stat: "24/7", label: "Real-time Monitoring" }
            ].map((item, index) => (
              <div key={index}>
                <h3 className="text-5xl font-bold mb-2 text-emerald-400">{item.stat}</h3>
                <p className="text-lg opacity-90">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-8 text-center">
        <p>&copy; 2025 Energy Monitor. All rights reserved. | Empowering smart energy management worldwide.</p>
      </footer>

      {/* Login Modal */}
      {activeModal === 'login' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md relative">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <LoginPage 
              isModal={true}
              onSwitchToSignup={() => setActiveModal('signup')}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {activeModal === 'signup' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <SignupPage 
              isModal={true}
              onSwitchToLogin={() => setActiveModal('login')}
              onSignupSuccess={handleSignupSuccess}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default HomeView;