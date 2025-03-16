"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppData, PracticeMethod } from "@/contexts/DataContext";

export default function NextTaskPage() {
  const router = useRouter();
  const {
    getNextIncompleteTask,
    getAffirmationById,
    completeDailyTask
  } = useAppData();

  const [currentTask, setCurrentTask] = useState<{
    taskId: string,
    affirmationId: string,
    text: string,
    category: string,
    method: PracticeMethod
  } | null>(null);

  const [typingContent, setTypingContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  // Load the next task
  useEffect(() => {
    const task = getNextIncompleteTask();
    if (task) {
      const affirmation = getAffirmationById(task.affirmationId);
      if (affirmation) {
        setCurrentTask({
          taskId: task.id,
          affirmationId: task.affirmationId,
          text: affirmation.text,
          category: affirmation.category,
          method: task.method
        });
      } else {
        // No valid affirmation found
        router.push("/profile/tasks");
      }
    } else {
      // No tasks found
      router.push("/profile/tasks");
    }
  }, [getNextIncompleteTask, getAffirmationById, router]);

  // Handle typing input change
  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTypingContent(e.target.value);
  };

  // Complete the task
  const handleComplete = () => {
    if (currentTask) {
      completeDailyTask(currentTask.taskId);
      setIsComplete(true);
    }
  };

  // Go to next task or home
  const handleNext = () => {
    const nextTask = getNextIncompleteTask();
    if (nextTask) {
      // Reload the page to get the next task
      window.location.reload();
    } else {
      // No more tasks, go to home
      router.push("/");
    }
  };

  // Check if we can complete the task
  const canComplete =
    currentTask?.method === 'Typing' ? typingContent.length >= 10 : true;

  if (!currentTask) {
    return (
      <div className="py-8 text-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <header className="py-4">
        <h1 className="text-2xl font-bold text-purple-700">Quick Practice</h1>
        <p className="text-gray-600">Complete your daily affirmation</p>
      </header>

      {/* Current Task */}
      <div className="card">
        <div className="flex justify-between items-start mb-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            currentTask.category === 'Career' ? 'bg-purple-100 text-purple-700' :
            currentTask.category === 'Health' ? 'bg-green-100 text-green-700' :
            currentTask.category === 'Relationship' ? 'bg-blue-100 text-blue-700' :
            currentTask.category === 'Finance' ? 'bg-yellow-100 text-yellow-700' :
            'bg-indigo-100 text-indigo-700'
          }`}>
            {currentTask.category}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
            {currentTask.method}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-800">"{currentTask.text}"</p>
        </div>
      </div>

      {isComplete ? (
        <div className="card mt-6 text-center py-6">
          <div className="text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Task Completed!</h2>
          <p className="text-gray-600 mb-6">Great job on completing this practice.</p>

          <button
            className="primary-button w-full"
            onClick={handleNext}
          >
            Continue to Next Task
          </button>
        </div>
      ) : (
        <>
          {/* Practice Area based on method */}
          {currentTask.method === 'Handwriting' ? (
            <div className="card mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Handwriting Practice</h2>

              <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <p className="text-sm">Write your affirmation here</p>
                </div>
              </div>

              <button
                className="primary-button w-full mt-4"
                onClick={handleComplete}
              >
                Complete Task
              </button>
            </div>
          ) : currentTask.method === 'Typing' ? (
            <div className="card mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Typing Practice</h2>

              <textarea
                className="input-field h-48 mb-4"
                placeholder={`Type: "${currentTask.text}"`}
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
                Complete Task
              </button>
            </div>
          ) : (
            <div className="card mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Voice Practice</h2>

              <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <p className="text-sm">Tap to start voice recording</p>
                  <button className="mt-4 px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm">
                    Record
                  </button>
                </div>
              </div>

              <button
                className="primary-button w-full mt-4"
                onClick={handleComplete}
              >
                Complete Task
              </button>
            </div>
          )}

          {/* Tips */}
          <div className="card mt-6 bg-blue-50 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Quick Tips</h3>

            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700">Say your affirmation with emotion and belief</p>
              </li>
              <li className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700">Visualize your desire as already manifested</p>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
