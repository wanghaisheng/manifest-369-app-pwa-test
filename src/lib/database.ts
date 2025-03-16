import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite';

// 数据库连接实例
let db: SQLiteDBConnection | null = null;
const sqliteConnection = new SQLiteConnection(CapacitorSQLite);

// 初始化数据库
export async function initDatabase() {
  // 检查平台
  const platform = Capacitor.getPlatform();
  const isNative = platform === 'ios' || platform === 'android';
  
  try {
    if (isNative) {
      // 在原生平台上使用 Capacitor SQLite
      await sqliteConnection.checkConnectionsConsistency();
      const isConn = await sqliteConnection.isConnection('369-db');
      
      if (isConn.result) {
        db = await sqliteConnection.retrieveConnection('369-db');
      } else {
        db = await sqliteConnection.createConnection(
          '369-db',
          false,
          'no-encryption',
          1,
          false
        );
      }
      
      await db.open();
      
      // 运行迁移脚本
      // 这里可以添加你的迁移脚本
      
    } else {
      // 在 Web 平台上使用现有的 SQLite 方案
      // 这里可以保留你现有的 Web SQLite 实现
      console.log('Using web database implementation');
    }
    
    console.log('Database initialized successfully');
    return true;
  } catch (err) {
    console.error('Error initializing database:', err);
    return false;
  }
}

// 执行查询
export async function executeQuery(query: string, params: any[] = []) {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    return await db.query(query, params);
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  }
}

// 关闭数据库连接
export async function closeDatabase() {
  if (db) {
    await sqliteConnection.closeConnection('369-db');
    db = null;
  }
}