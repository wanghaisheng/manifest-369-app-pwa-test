"use client";

import { useState } from "react";
import { useAppData } from "@/contexts/DataContext";

export default function WishesPage() {
  const {
    affirmations,
    addAffirmation,
    deleteAffirmation,
    addToDailyTasks,
    dailyTasks
  } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState("Career");
  const [wishText, setWishText] = useState("");
  const [generatedAffirmation, setGeneratedAffirmation] = useState("");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleWishTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWishText(e.target.value);
  };

  const generateAffirmation = () => {
    if (!wishText.trim()) return;

    // Simple template-based generation
    const templates: Record<string, string> = {
      Career: "I am attracting abundant opportunities in my career that fulfill my purpose and bring me joy.",
      Health: "My body is healthy, strong, and full of energy. I take care of myself with love and respect.",
      Relationship: "I am attracting loving and supportive relationships that nurture my growth and bring joy into my life.",
      Finance: "I am a money magnet. Wealth flows to me easily and abundantly from multiple sources.",
      Personal: "I am living my best life, aligned with my true purpose and highest potential."
    };

    setGeneratedAffirmation(templates[selectedCategory]);
  };

  // Check if an affirmation is already in the daily tasks
  const isInDailyTasks = (affirmationId: string) => {
    return dailyTasks.some(task => task.affirmationId === affirmationId);
  };

  // Handle adding to daily tasks
  const handleAddToDailyTasks = (affirmationId: string) => {
    addToDailyTasks(affirmationId);
  };

  // Active and completed affirmations
  const activeAffirmations = affirmations.filter(aff => aff.isActive);
  const completedAffirmations = affirmations.filter(aff => aff.isCompleted);

  return (
    <div>
      <header className="py-4">
        <h1 className="text-2xl font-bold text-purple-700">Create New Wish</h1>
        <p className="text-gray-600">Transform your desires into affirmations</p>
      </header>

      {/* Category Selection */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {["Career", "Health", "Relationship", "Finance", "Personal"].map((category) => (
            <button
              key={category}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label htmlFor="wish-input" className="block text-sm font-medium text-gray-700 mb-2">Enter Your Wish</label>
          <textarea
            id="wish-input"
            className="input-field h-28"
            placeholder="I want to..."
            value={wishText}
            onChange={handleWishTextChange}
          ></textarea>
        </div>

        <button
          className={`primary-button w-full mt-4 ${!wishText.trim() ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={generateAffirmation}
          disabled={!wishText.trim()}
        >
          Generate Affirmation
        </button>
      </div>

      {/* Generated Affirmation */}
      {generatedAffirmation && (
        <div className="card mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Your Affirmation</h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              selectedCategory === 'Career' ? 'bg-purple-100 text-purple-700' :
              selectedCategory === 'Health' ? 'bg-green-100 text-green-700' :
              selectedCategory === 'Relationship' ? 'bg-blue-100 text-blue-700' :
              selectedCategory === 'Finance' ? 'bg-yellow-100 text-yellow-700' :
              'bg-indigo-100 text-indigo-700'
            }`}>
              {selectedCategory}
            </span>
          </div>

          <p className="text-gray-800 p-3 bg-gray-50 rounded-lg mb-4">"{generatedAffirmation}"</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Practice Duration</label>
            <div className="grid grid-cols-2 gap-2">
              <button className="secondary-button">33 Days</button>
              <button className="primary-button">45 Days</button>
            </div>
          </div>

          <button className="primary-button w-full">Start Practice</button>
        </div>
      )}

      {/* Existing Affirmations */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Your Affirmations</h2>
          <div className="flex items-center space-x-2">
            <button className="text-xs text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        {activeAffirmations.length > 0 ? (
          activeAffirmations.map(affirmation => (
            <div key={affirmation.id} className="card mb-3">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  affirmation.category === 'Career' ? 'bg-purple-100 text-purple-700' :
                  affirmation.category === 'Health' ? 'bg-green-100 text-green-700' :
                  affirmation.category === 'Relationship' ? 'bg-blue-100 text-blue-700' :
                  affirmation.category === 'Finance' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {affirmation.category}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Active</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-800">"{affirmation.text}"</p>
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-500">{affirmation.currentDay}/{affirmation.durationDays} <span>days</span></span>
                </div>
                <div className="flex space-x-2">
                  <a href="/practice" className="text-purple-600 text-sm font-medium">Practice</a>
                  {isInDailyTasks(affirmation.id) ? (
                    <span className="text-green-600 text-sm">In Daily Tasks</span>
                  ) : (
                    <button
                      className="text-blue-600 text-sm font-medium"
                      onClick={() => handleAddToDailyTasks(affirmation.id)}
                    >
                      Add to Daily Tasks
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center">
            <p className="text-gray-500">No active affirmations. Create a new one!</p>
          </div>
        )}

        {completedAffirmations.length > 0 && (
          <>
            <h3 className="font-medium text-gray-700 mt-6 mb-3">Completed</h3>

            {completedAffirmations.map(affirmation => (
              <div key={affirmation.id} className="card mb-3 opacity-70">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    affirmation.category === 'Career' ? 'bg-purple-100 text-purple-700' :
                    affirmation.category === 'Health' ? 'bg-green-100 text-green-700' :
                    affirmation.category === 'Relationship' ? 'bg-blue-100 text-blue-700' :
                    affirmation.category === 'Finance' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {affirmation.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Completed</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-800">"{affirmation.text}"</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-gray-500">{affirmation.durationDays}/{affirmation.durationDays} <span>days</span></span>
                  </div>
                  <button
                    className="text-red-500 text-sm font-medium"
                    onClick={() => deleteAffirmation(affirmation.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
