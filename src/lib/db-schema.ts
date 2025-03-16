/**
 * Kysely 数据库架构定义
 * 定义了所有表的列和类型
 */

import { Generated } from 'kysely';

// 用户表
export interface UserTable {
  id: string;
  name: string | null;
  email: string | null;
  email_verified: number | null;
  image: string | null;
  created_at: Generated<number>;
  updated_at: Generated<number>;
}

// 会话表
export interface SessionTable {
  id: string;
  user_id: string;
  expires_at: number;
  created_at: Generated<number>;
  updated_at: Generated<number>;
}

// 验证令牌表
export interface VerificationTokenTable {
  identifier: string;
  token: string;
  expires_at: number;
}

// 第三方账户表
export interface AccountTable {
  id: string;
  user_id: string;
  type: string;
  provider: string;
  provider_account_id: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  created_at: Generated<number>;
  updated_at: Generated<number>;
}

// Passkey 表
export interface PasskeyTable {
  id: string;
  user_id: string;
  name: string | null;
  public_key: string;
  counter: number;
  transports: string | null;
  created_at: Generated<number>;
  updated_at: Generated<number>;
}

// 肯定语表
export interface AffirmationTable {
  id: string;
  user_id: string;
  text: string;
  category: string;
  duration_days: number;
  current_day: number;
  is_active: number;
  is_completed: number;
  created_at: Generated<number>;
  updated_at: Generated<number>;
}

// 每日任务表
export interface DailyTaskTable {
  id: string;
  user_id: string;
  affirmation_id: string;
  order: number;
  method: string;
  is_completed: number;
  created_at: Generated<number>;
  updated_at: Generated<number>;
}

// 练习会话表
export interface PracticeSessionTable {
  id: string;
  user_id: string;
  affirmation_id: string;
  session_type: string;
  session_index: number;
  completed_at: Generated<number>;
}

// 数据库架构定义
export interface Database {
  user: UserTable;
  session: SessionTable;
  verification_token: VerificationTokenTable;
  account: AccountTable;
  passkey: PasskeyTable;
  affirmation: AffirmationTable;
  daily_task: DailyTaskTable;
  practice_session: PracticeSessionTable;
}
