"use client";

import { useState } from 'react';
import { useAppData, DailyTask, PracticeMethod } from '@/contexts/DataContext';
// 导入拆分后的模态组件
import StatsModal from './components/StatsModal';
import TasksModal from './components/TasksModal';
import SettingsModal from './components/SettingsModal';

export default function ProfilePage() {
  const [activeModal, setActiveModal] = useState<'stats' | 'tasks' | 'settings' | null>(null);
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
      close: "Close",
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
      close: "关闭",
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

  // 删除重复的状态声明
  // const [activeModal, setActiveModal] = useState<'stats' | 'tasks' | 'settings' | null>(null);

  // 模态框组件 - 移动到单独的文件
  const Modal = ({ title, isOpen, onClose, children }: { 
    title: string, 
    isOpen: boolean, 
    onClose: () => void, 
    children: React.ReactNode 
  }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
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
            {children}
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

      {/* 快速统计摘要 */}
      <div className="grid grid-cols-3 gap-3 mt-6">
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

      {/* 操作按钮 */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <button 
          className="card p-4 flex flex-col items-center justify-center"
          onClick={() => setActiveModal('stats')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-medium text-gray-800">{t.stats}</span>
        </button>
        
        <button 
          className="card p-4 flex flex-col items-center justify-center"
          onClick={() => setActiveModal('tasks')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-sm font-medium text-gray-800">{t.tasks}</span>
        </button>
        
        <button 
          className="card p-4 flex flex-col items-center justify-center"
          onClick={() => setActiveModal('settings')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-800">{t.settings}</span>
        </button>
      </div>

      {/* 使用拆分后的模态组件 */}
      {activeModal === 'stats' && (
        <StatsModal 
          isOpen={true}
          onClose={() => setActiveModal(null)}
          user={user}
          t={t}
          selectedLanguage={selectedLanguage}
        />
      )}

      {activeModal === 'tasks' && (
        <TasksModal 
          isOpen={true}
          onClose={() => setActiveModal(null)}
          sortedTasks={sortedTasks}
          getAffirmationById={getAffirmationById}
          handleMethodChange={handleMethodChange}
          handleMoveTask={handleMoveTask}
          removeDailyTask={removeDailyTask}
          t={t}
          selectedLanguage={selectedLanguage}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal 
          isOpen={true}
          onClose={() => setActiveModal(null)}
          user={user}
          selectedLanguage={selectedLanguage}
          handleLanguageChange={handleLanguageChange}
          t={t}
        />
      )}
    </div>
  );
}
