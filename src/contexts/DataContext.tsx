"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define types for our data
export type Category = "Career" | "Health" | "Relationship" | "Finance" | "Personal";
export type PracticeMethod = "Handwriting" | "Typing" | "Voice";

export interface Affirmation {
  id: string;
  text: string;
  category: Category;
  createdAt: string;
  durationDays: number;
  currentDay: number;
  isActive: boolean;
  isCompleted: boolean;
}

export interface DailyTask {
  id: string;
  affirmationId: string;
  order: number;
  method: PracticeMethod;
  isCompleted: boolean;
}

// Define context type
interface DataContextType {
  affirmations: Affirmation[];
  dailyTasks: DailyTask[];
  addAffirmation: (affirmation: Omit<Affirmation, "id" | "createdAt" | "currentDay" | "isActive" | "isCompleted">) => void;
  deleteAffirmation: (id: string) => void;
  addToDailyTasks: (affirmationId: string) => void;
  removeDailyTask: (taskId: string) => void;
  updateDailyTaskOrder: (taskId: string, newOrder: number) => void;
  updateDailyTaskMethod: (taskId: string, method: PracticeMethod) => void;
  completeDailyTask: (taskId: string) => void;
  getAffirmationById: (id: string) => Affirmation | undefined;
  getNextIncompleteTask: () => DailyTask | undefined;
}

// Initial mock data
const mockAffirmations: Affirmation[] = [
  {
    id: "aff-1",
    text: "I am attracting abundant opportunities in my career that fulfill my purpose and bring me joy.",
    category: "Career",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 24).toISOString(),
    durationDays: 45,
    currentDay: 24,
    isActive: true,
    isCompleted: false,
  },
  {
    id: "aff-2",
    text: "My body is healthy, strong, and full of energy. I take care of myself with love and respect.",
    category: "Health",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 15).toISOString(),
    durationDays: 33,
    currentDay: 15,
    isActive: true,
    isCompleted: false,
  }
];

const mockDailyTasks: DailyTask[] = [
  {
    id: "task-1",
    affirmationId: "aff-1",
    order: 1,
    method: "Typing",
    isCompleted: false
  },
  {
    id: "task-2",
    affirmationId: "aff-2",
    order: 2,
    method: "Handwriting",
    isCompleted: false
  }
];

// Create context with default values
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [affirmations, setAffirmations] = useState<Affirmation[]>(mockAffirmations);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(mockDailyTasks);

  // Add a new affirmation
  const addAffirmation = (affirmation: Omit<Affirmation, "id" | "createdAt" | "currentDay" | "isActive" | "isCompleted">) => {
    const newAffirmation: Affirmation = {
      ...affirmation,
      id: `aff-${Date.now()}`,
      createdAt: new Date().toISOString(),
      currentDay: 1,
      isActive: true,
      isCompleted: false,
    };

    setAffirmations(prev => [...prev, newAffirmation]);
  };

  // Delete an affirmation
  const deleteAffirmation = (id: string) => {
    setAffirmations(prev => prev.filter(aff => aff.id !== id));
    setDailyTasks(prev => {
      // Remove any daily tasks associated with this affirmation
      const updatedTasks = prev.filter(task => task.affirmationId !== id);

      // Reorder the remaining tasks
      return updatedTasks.map((task, index) => ({
        ...task,
        order: index + 1
      }));
    });
  };

  // Add affirmation to daily tasks
  const addToDailyTasks = (affirmationId: string) => {
    setDailyTasks(prev => {
      // Check if this affirmation is already in the daily tasks
      const exists = prev.some(task => task.affirmationId === affirmationId);
      if (exists) return prev;

      // Create a new task for this affirmation
      const nextOrder = prev.length + 1;
      const newTask: DailyTask = {
        id: `task-${Date.now()}`,
        affirmationId,
        order: nextOrder,
        method: "Typing", // Default method
        isCompleted: false
      };

      return [...prev, newTask];
    });
  };

  // Remove a task from daily tasks
  const removeDailyTask = (taskId: string) => {
    setDailyTasks(prev => {
      // Remove the task
      const updatedTasks = prev.filter(task => task.id !== taskId);

      // Reorder the remaining tasks
      const reorderedTasks = updatedTasks.map((task, index) => ({
        ...task,
        order: index + 1
      }));

      return reorderedTasks;
    });
  };

  // Update task order
  const updateDailyTaskOrder = (taskId: string, newOrder: number) => {
    setDailyTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;

      const oldOrder = task.order;

      // Update all affected tasks
      const updatedTasks = prev.map(t => {
        if (t.id === taskId) {
          // This is the task we're moving
          return { ...t, order: newOrder };
        } else if (newOrder > oldOrder && t.order > oldOrder && t.order <= newOrder) {
          // Tasks that need to move up (decrease order)
          return { ...t, order: t.order - 1 };
        } else if (newOrder < oldOrder && t.order >= newOrder && t.order < oldOrder) {
          // Tasks that need to move down (increase order)
          return { ...t, order: t.order + 1 };
        }
        return t;
      });

      return updatedTasks;
    });
  };

  // Update task method
  const updateDailyTaskMethod = (taskId: string, method: PracticeMethod) => {
    setDailyTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, method } : task
    ));
  };

  // Mark a daily task as completed
  const completeDailyTask = (taskId: string) => {
    setDailyTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, isCompleted: true } : task
    ));
  };

  // Get an affirmation by ID
  const getAffirmationById = (id: string) => {
    return affirmations.find(aff => aff.id === id);
  };

  // Get the next incomplete task in the task list
  const getNextIncompleteTask = () => {
    return dailyTasks
      .filter(task => !task.isCompleted)
      .sort((a, b) => a.order - b.order)[0];
  };

  const value = {
    affirmations,
    dailyTasks,
    addAffirmation,
    deleteAffirmation,
    addToDailyTasks,
    removeDailyTask,
    updateDailyTaskOrder,
    updateDailyTaskMethod,
    completeDailyTask,
    getAffirmationById,
    getNextIncompleteTask
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to use the data context
export function useAppData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within a DataProvider');
  }
  return context;
}
