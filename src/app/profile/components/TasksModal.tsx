"use client";

import React from 'react';
import { DailyTask, PracticeMethod } from '@/contexts/DataContext';

interface TasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortedTasks: DailyTask[];
  getAffirmationById: (id: string) => any;
  handleMethodChange: (taskId: string, method: PracticeMethod) => void;
  handleMoveTask: (taskId: string, direction: 'up' | 'down') => void;
  removeDailyTask: (taskId: string) => void;
  t: any;
  selectedLanguage: 'en' | 'zh';
}

const TasksModal: React.FC<TasksModalProps> = ({ 
  isOpen, 
  onClose, 
  sortedTasks, 
  getAffirmationById, 
  handleMethodChange, 
  handleMoveTask, 
  removeDailyTask, 
  t, 
  selectedLanguage 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{t.dailyTasksManagement}</h2>
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
            {sortedTasks.length > 0 ? (
              <div className="space-y-3">
                {sortedTasks.map((task, index) => {
                  const affirmation = getAffirmationById(task.affirmationId);
                  if (!affirmation) return null;

                  return (
                    <div key={task.id} className="card">
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
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          #{task.order}
                        </span>
                      </div>

                      <p className="text-gray-800 mb-4">"{affirmation.text}"</p>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.practiceMethod}</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            className={`px-2 py-1 text-xs rounded-md ${
                              task.method === 'Handwriting' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                            onClick={() => handleMethodChange(task.id, 'Handwriting')}
                          >
                            {t.handwriting}
                          </button>
                          <button
                            className={`px-2 py-1 text-xs rounded-md ${
                              task.method === 'Typing' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                            onClick={() => handleMethodChange(task.id, 'Typing')}
                          >
                            {t.typing}
                          </button>
                          <button
                            className={`px-2 py-1 text-xs rounded-md ${
                              task.method === 'Voice' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                            onClick={() => handleMethodChange(task.id, 'Voice')}
                          >
                            {t.voice}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <button
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                            onClick={() => handleMoveTask(task.id, 'up')}
                            disabled={index === 0}
                          >
                            {t.moveUp}
                          </button>
                          <button
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                            onClick={() => handleMoveTask(task.id, 'down')}
                            disabled={index === sortedTasks.length - 1}
                          >
                            {t.moveDown}
                          </button>
                        </div>
                        <button
                          className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-md"
                          onClick={() => removeDailyTask(task.id)}
                        >
                          {t.remove}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card text-center py-8">
                <p className="text-gray-500">{t.noTasks}</p>
              </div>
            )}
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

export default TasksModal;