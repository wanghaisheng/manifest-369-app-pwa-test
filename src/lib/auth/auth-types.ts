/**
 * 认证相关类型定义
 */
import { User, Session } from './auth-client';

export type { User, Session };

// 认证提供者
export enum AuthProvider {
  CREDENTIALS = 'credentials',
  EMAIL = 'email',
  GOOGLE = 'google',
  GITHUB = 'github',
  PASSKEY = 'passkey'
}

// 签名选项
export interface SignInOptions {
  callbackUrl?: string;
  redirect?: boolean;
  [key: string]: any;
}

// 注册选项
export interface RegisterOptions {
  name: string;
  email: string;
  password: string;
  callbackUrl?: string;
}

// 魔术链接选项
export interface MagicLinkOptions {
  callbackUrl?: string;
}

// 认证结果
export interface AuthResult {
  ok: boolean;
  error: string | null;
  url?: string;
}
