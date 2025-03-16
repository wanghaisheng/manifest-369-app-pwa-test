"use client";

import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
  };
  selectedLanguage: 'en' | 'zh';
  handleLanguageChange: (language: 'en' | 'zh') => void;
  t: any;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  selectedLanguage, 
  handleLanguageChange, 
  t 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{t.settings}</h2>
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
            {/* Settings Form */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">{t.accountSettings}</h3>

              <div className="card">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.displayName}</label>
                  <input type="text" className="input-field" defaultValue={user.name} />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                  <input type="email" className="input-field" defaultValue={user.email} />
                </div>

                <button className="primary-button w-full">{t.saveChanges}</button>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">{t.preferences}</h3>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-800">{t.dailyReminders}</p>
                    <p className="text-xs text-gray-600">{t.notificationsDesc}</p>
                  </div>
                  <div>
                    <div className="w-12 h-6 bg-purple-600 rounded-full p-1 flex items-center">
                      <div className="w-4 h-4 bg-white rounded-full transform translate-x-6"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-800">{t.darkMode}</p>
                    <p className="text-xs text-gray-600">{t.darkModeDesc}</p>
                  </div>
                  <div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-800">{t.soundEffects}</p>
                    <p className="text-xs text-gray-600">{t.soundEffectsDesc}</p>
                  </div>
                  <div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Language Selection */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{t.language}</p>
                    <p className="text-xs text-gray-600">{t.languageDesc}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className={`px-2 py-1 text-xs rounded-full ${selectedLanguage === 'en' ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-600'}`}
                      onClick={() => handleLanguageChange('en')}
                    >
                      {t.english}
                    </button>
                    <button
                      className={`px-2 py-1 text-xs rounded-full ${selectedLanguage === 'zh' ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-600'}`}
                      onClick={() => handleLanguageChange('zh')}
                    >
                      {t.chinese}
                    </button>
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

export default SettingsModal;