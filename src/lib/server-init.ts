/**
 * 服务器初始化，在应用启动时运行
 */

import { initDatabase } from './kysely-db';

// 初始化日志
console.log('🚀 Server initializing...');

// 执行初始化任务
export async function initialize() {
  // 在开发模式下初始化数据库
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Initializing SQLite database...');
    try {
      await initDatabase();
      console.log('✅ Database initialized successfully.');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
    }
  }
}

// 导出一个空模块，触发 initialize 函数的执行
export const serverInit = initialize();
