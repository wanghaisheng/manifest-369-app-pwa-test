/**
 * Kysely 数据库连接和查询构建器
 */

import { Kysely, SqliteDialect } from 'kysely';
import { Database as SqliteDatabase } from 'better-sqlite3';
import Database from 'better-sqlite3';
import { Database } from './db-schema';
import fs from 'fs';
import path from 'path';

// 开发环境 SQLite 数据库文件路径
const DB_PATH = path.join(process.cwd(), '.db/sqlite.db');

// 初始化数据库目录
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 创建 Kysely 实例
export function createKysely() {
  const dialect = new SqliteDialect({
    database: new Database(DB_PATH) as unknown as SqliteDatabase,
  });

  return new Kysely<Database>({
    dialect,
  });
}

// 获取数据库实例（单例模式）
let db: Kysely<Database> | null = null;

export function getKysely(): Kysely<Database> {
  if (!db) {
    db = createKysely();
  }
  return db;
}

// 执行数据库迁移
export async function runMigrations() {
  const db = getKysely();
  const migrationFiles = fs.readdirSync(path.join(process.cwd(), 'migrations'))
    .filter(file => file.endsWith('.sql'))
    .sort(); // 按文件名排序

  for (const file of migrationFiles) {
    const sql = fs.readFileSync(path.join(process.cwd(), 'migrations', file), 'utf8');

    // 分割SQL语句并执行
    const statements = sql.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await db.executeQuery(
            db.getExecutor().raw(statement)
          );
          console.log(`Migration executed: ${file}`);
        } catch (error) {
          console.error(`Error executing migration ${file}:`, error);
          throw error;
        }
      }
    }
  }
}

// 初始化数据库
export async function initDatabase() {
  // 确保sqlite.db文件存在
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '');
  }

  try {
    await runMigrations();
    console.log('Database migrations completed successfully.');
  } catch (error) {
    console.error('Failed to run migrations:', error);
    throw error;
  }
}
