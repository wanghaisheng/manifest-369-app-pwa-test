"use client";

import React from 'react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    streak: number;
    completedWishes: number;
    totalSessions: number;
  };
  t: any;
  selectedLanguage: 'en' | 'zh';
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, user, t, selectedLanguage }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{t.stats}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">{t.currentStreak}</p>
                <p className="text-xl font-bold text-purple-700">{user.streak}</p>
                <p className="text-xs text-gray-500">{t.days}</p>
              </div>
              <div className="card p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">{t.completed}</p>
                <p className="text-xl font-bold text-green-600">{user.completedWishes}</p>
                <p className="text-xs text-gray-500">{t.wishes}</p>
              </div>
              <div className="card p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">{t.totalSessions}</p>
                <p className="text-xl font-bold text-blue-600">{user.totalSessions}</p>
                <p className="text-xs text-gray-500">{t.practices}</p>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">{t.achievements}</h3>

              <div className="card">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">First Manifestation</p>
                    <p className="text-xs text-gray-600">Completed your first 33-day practice</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Earned</span>
                  </div>
                </div>
              </div>

              <div className="card mt-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">10-Day Streak</p>
                    <p className="text-xs text-gray-600">Practiced for 10 consecutive days</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Earned</span>
                  </div>
                </div>
              </div>

              <div className="card mt-3 opacity-60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">5 Manifestations</p>
                    <p className="text-xs text-gray-600">Complete 5 different manifestation practices</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-full">4/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t p-4">
          <button 
            onClick={onClose}
            className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            {selectedLanguage === 'en' ? 'Close' : '关闭'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;