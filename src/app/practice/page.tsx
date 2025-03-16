"use client";

import { useState } from 'react';

type TimeOfDay = "Morning" | "Afternoon" | "Evening";
type WritingMethod = "Handwriting" | "Typing";

export default function PracticePage() {
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>("Morning");
  const [writingMethod, setWritingMethod] = useState<WritingMethod>("Handwriting");
  const [typingContent, setTypingContent] = useState("");
  const [completedSession, setCompletedSession] = useState(false);

  // Mock data for current practice sessions
  const progressData = {
    morning: { total: 3, completed: 3 },
    afternoon: { total: 6, completed: 4 },
    evening: { total: 9, completed: 0 }
  };

  // Current affirmation
  const currentAffirmation = {
    text: "I am attracting abundant opportunities in my career that fulfill my purpose and bring me joy.",
    category: "Career"
  };

  const handleTimeSelect = (time: TimeOfDay) => {
    setSelectedTime(time);
    setCompletedSession(false);
  };

  const handleMethodSelect = (method: WritingMethod) => {
    setWritingMethod(method);
    setCompletedSession(false);
  };

  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTypingContent(e.target.value);
  };

  const handleComplete = () => {
    // In a real app, this would update the database
    setCompletedSession(true);
    setTypingContent("");
  };

  // Check if we can complete
  const canComplete = writingMethod === 'Typing' ? typingContent.length >= 10 : true;

  return (
    <div>
      <header className="py-4">
        <h1 className="text-2xl font-bold text-purple-700">Practice Sessions</h1>
        <p className="text-gray-600">Complete your 3-6-9 writing routines</p>
      </header>

      {/* Time Period Selection */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Select Time Period</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${selectedTime === 'Morning' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-400' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => handleTimeSelect("Morning")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm font-medium">Morning</span>
            <span className="text-xs mt-1">{progressData.morning.completed}/{progressData.morning.total}</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${selectedTime === 'Afternoon' ? 'bg-orange-100 text-orange-700 border-2 border-orange-400' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => handleTimeSelect("Afternoon")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span className="text-sm font-medium">Afternoon</span>
            <span className="text-xs mt-1">{progressData.afternoon.completed}/{progressData.afternoon.total}</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${selectedTime === 'Evening' ? 'bg-blue-100 text-blue-700 border-2 border-blue-400' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => handleTimeSelect("Evening")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span className="text-sm font-medium">Evening</span>
            <span className="text-xs mt-1">{progressData.evening.completed}/{progressData.evening.total}</span>
          </button>
        </div>
      </div>

      {/* Current Affirmation */}
      <div className="card mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Current Affirmation</h2>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
            {currentAffirmation.category}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-800">"{currentAffirmation.text}"</p>
        </div>
      </div>

      {completedSession ? (
        // Completion screen
        <div className="card mt-6 text-center">
          <div className="text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Great Job!</h2>
          <p className="text-gray-600 mb-6">Session completed successfully!</p>

          <button
            className="primary-button w-full"
            onClick={() => setCompletedSession(false)}
          >
            Continue {selectedTime} Practice
          </button>

          <button
            className="secondary-button w-full mt-3"
            onClick={() => {
              // In a real app, we would navigate to the home screen
            }}
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Writing Method Selection */}
          <div className="card mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Select Writing Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`flex flex-col items-center justify-center p-4 rounded-lg ${writingMethod === 'Handwriting' ? 'bg-purple-100 text-purple-700 border-2 border-purple-400' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => handleMethodSelect("Handwriting")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="text-sm font-medium">Handwriting</span>
              </button>

              <button
                className={`flex flex-col items-center justify-center p-4 rounded-lg ${writingMethod === 'Typing' ? 'bg-purple-100 text-purple-700 border-2 border-purple-400' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => handleMethodSelect("Typing")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Typing</span>
              </button>
            </div>
          </div>

          {/* Handwriting or Typing Area */}
          {writingMethod === 'Handwriting' ? (
            <div className="card mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Handwriting Area</h2>
              <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <p className="text-sm">Write your affirmation here</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-4 mb-6">
                <button className="w-8 h-8 rounded-full bg-black"></button>
                <button className="w-8 h-8 rounded-full bg-blue-600"></button>
                <button className="w-8 h-8 rounded-full bg-red-600"></button>
                <button className="w-8 h-8 rounded-full bg-green-600"></button>
              </div>

              <button
                className="primary-button w-full"
                onClick={handleComplete}
              >
                Complete Session
              </button>
            </div>
          ) : (
            <div className="card mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Typing Area</h2>

              <textarea
                className="input-field h-48 mb-4"
                placeholder={`Type: "${currentAffirmation.text}"`}
                value={typingContent}
                onChange={handleTypingChange}
              ></textarea>

              <div className="flex items-center mb-4">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${Math.min((typingContent.length / 100) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-gray-600">{typingContent.length}/100</span>
              </div>

              <button
                className={`w-full py-2.5 rounded-lg font-medium ${
                  canComplete ? 'primary-button' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!canComplete}
                onClick={handleComplete}
              >
                Complete Session
              </button>
            </div>
          )}
        </>
      )}

      {/* Tips */}
      <div className="card mt-6 bg-blue-50 border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Tips for Effective Practice</h3>

        <ul className="space-y-2">
          <li className="flex items-start space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700">Write with focused attention and positive emotion</p>
          </li>
          <li className="flex items-start space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700">Visualize your desire as already manifested</p>
          </li>
          <li className="flex items-start space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700">Be consistent and complete all your daily sessions</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
