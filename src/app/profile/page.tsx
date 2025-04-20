"use client";

import { useState } from 'react';
import { useAppData, DailyTask, PracticeMethod } from '@/contexts/DataContext';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'tasks' | 'settings'>('stats');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'zh'>('en');
  const {
    dailyTasks,
    removeDailyTask,
    updateDailyTaskOrder,
    updateDailyTaskMethod,
    getAffirmationById
  } = useAppData();

  // Sorted tasks by order
  const sortedTasks = [...dailyTasks].sort((a, b) => a.order - b.order);

  // Translations for UI elements
  const translations = {
    en: {
      profile: "Profile",
      journey: "Your manifestation journey",
      stats: "Statistics",
      tasks: "Daily Tasks",
      settings: "Settings",
      currentStreak: "Current Streak",
      completed: "Completed",
      totalSessions: "Total Sessions",
      days: "days",
      wishes: "wishes",
      practices: "practices",
      achievements: "Achievements",
      accountSettings: "Account Settings",
      displayName: "Display Name",
      email: "Email",
      saveChanges: "Save Changes",
      preferences: "Preferences",
      dailyReminders: "Daily Reminders",
      notificationsDesc: "Get notified for your practice sessions",
      darkMode: "Dark Mode",
      darkModeDesc: "Use dark theme for the app",
      soundEffects: "Sound Effects",
      soundEffectsDesc: "Play sounds when completing tasks",
      language: "Language",
      languageDesc: "Choose your preferred language",
      english: "English",
      chinese: "Chinese",
      dailyTasksManagement: "Daily Tasks Management",
      noTasks: "No daily tasks added yet. Go to Wishes and add some affirmations to your daily tasks.",
      moveUp: "Move Up",
      moveDown: "Move Down",
      remove: "Remove",
      practiceMethod: "Practice Method",
      handwriting: "Handwriting",
      typing: "Typing",
      voice: "Voice",
    },
    zh: {
      profile: "个人资料",
      journey: "您的显化之旅",
      stats: "统计数据",
      tasks: "每日任务",
      settings: "设置",
      currentStreak: "当前连续",
      completed: "已完成",
      totalSessions: "总练习",
      days: "天",
      wishes: "愿望",
      practices: "练习",
      achievements: "成就",
      accountSettings: "账户设置",
      displayName: "显示名称",
      email: "电子邮箱",
      saveChanges: "保存更改",
      preferences: "偏好设置",
      dailyReminders: "每日提醒",
      notificationsDesc: "获取练习会话的通知",
      darkMode: "深色模式",
      darkModeDesc: "使用应用深色主题",
      soundEffects: "音效",
      soundEffectsDesc: "完成任务时播放声音",
      language: "语言",
      languageDesc: "选择您的首选语言",
      english: "英文",
      chinese: "中文",
      dailyTasksManagement: "每日任务管理",
      noTasks: "还没有添加每日任务。前往愿望页面并将一些肯定语添加到每日任务中。",
      moveUp: "上移",
      moveDown: "下移",
      remove: "移除",
      practiceMethod: "练习方法",
      handwriting: "手写",
      typing: "打字",
      voice: "语音",
    }
  };

  // Get current language text
  const t = translations[selectedLanguage];

  // Handle language change
  const handleLanguageChange = (language: 'en' | 'zh') => {
    setSelectedLanguage(language);
  };

  // Handle task movement
  const handleMoveTask = (taskId: string, direction: 'up' | 'down') => {
    const taskIndex = sortedTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    // Can't move first task up or last task down
    if (direction === 'up' && taskIndex === 0) return;
    if (direction === 'down' && taskIndex === sortedTasks.length - 1) return;

    const newOrder = direction === 'up'
      ? sortedTasks[taskIndex - 1].order
      : sortedTasks[taskIndex + 1].order;

    updateDailyTaskOrder(taskId, newOrder);
  };

  // Handle task method change
  const handleMethodChange = (taskId: string, method: PracticeMethod) => {
    updateDailyTaskMethod(taskId, method);
  };

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    joined: "March 2024",
    avatar: "https://web-assets.same.dev/4005708812/337639071.jpeg",
    streak: 15,
    completedWishes: 4,
    totalSessions: 137
  };

  return (
    <div>
      <header className="py-4">
        <h1 className="text-2xl font-bold text-purple-700">{t.profile}</h1>
        <p className="text-gray-600">{t.journey}</p>
      </header>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-600">Joined {user.joined}</p>
            <p className="text-xs text-purple-600 mt-1">Premium Member</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mt-6">
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'stats' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('stats')}
        >
          {t.stats}
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'tasks' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('tasks')}
        >
          {t.tasks}
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'settings' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('settings')}
        >
          {t.settings}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && (
        <div className="mt-6 space-y-6">
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
      )}

      {activeTab === 'tasks' && (
        <div className="mt-6 space-y-6">
          <h3 className="font-bold text-gray-800 mb-3">{t.dailyTasksManagement}</h3>

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
      )}

      {activeTab === 'settings' && (
        <div className="mt-6 space-y-6">
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
      )}
    </div>
  );
}
