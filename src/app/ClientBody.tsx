"use client";

import { useEffect, useState } from 'react';
import { initDatabase } from '@/lib/database';
import { DataProvider } from '@/contexts/DataContext';

export default function ClientBody({ children }: { children: React.ReactNode }) {
  // Add state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
    
    // 初始化数据库
    const initDb = async () => {
      try {
        await initDatabase();
        console.log('Database initialized');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    
    initDb();
    
    // 清理函数
    return () => {
      // 可以在这里添加关闭数据库的逻辑
    };
  }, []);

  // Only render children after component is mounted on the client
  // This prevents hydration errors by skipping the initial render
  if (!isMounted) {
    return null; // Return empty during SSR and first client render
  }

  return (
    <DataProvider>
      {children}
    </DataProvider>
  );
}
