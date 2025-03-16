/**
 * 数据库连接工具
 * 提供与Cloudflare D1数据库的连接
 */

import { D1Database } from '@cloudflare/d1';

export interface Database {
  db: D1Database;
}

export interface CloudflareEnv {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  EMAIL_SERVER_HOST: string;
  EMAIL_SERVER_PORT: string;
  EMAIL_SERVER_USER: string;
  EMAIL_SERVER_PASSWORD: string;
  EMAIL_FROM: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  APP_NAME: string;
}

/**
 * 获取数据库连接
 * @param env Cloudflare环境对象
 * @returns Database对象
 */
export function getDatabase(env: CloudflareEnv): Database {
  return { db: env.DB };
}

/**
 * 根据环境获取数据库连接
 * 用于Next.js应用中获取数据库连接
 */
export function getDB(): Database | null {
  if (typeof process === 'undefined') {
    // 在客户端环境中，返回null
    return null;
  }

  // 在服务器端环境中
  if (process.env.NODE_ENV === 'development') {
    // 开发环境 - 使用D1本地模拟
    return { db: (globalThis as any).DB };
  } else {
    // 生产环境 - 使用Cloudflare D1
    return { db: (globalThis as any).DB };
  }
}
