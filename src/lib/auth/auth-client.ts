'use client';

/**
 * 认证客户端工具
 * 提供登录、注册、会话管理等功能
 */

import { useState, useEffect } from 'react';

// 用户类型
export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  onboardingCompleted?: boolean;
};

// 会话类型
export type Session = {
  user: User;
  expires: Date;
};

// 测试用户 - 开发环境使用
const TEST_USERS = [
  {
    id: 'user1',
    email: 'test@example.com',
    password: 'password123',
    name: '测试账号',
    onboardingCompleted: true
  },
  {
    id: 'user2',
    email: 'admin@example.com',
    password: 'admin123',
    name: '管理员',
    onboardingCompleted: false
  }
];

// 用于存储会话的localStorage键
const SESSION_STORAGE_KEY = 'auth.session';
const ONBOARDING_COMPLETED_KEY = 'onboarding.completed';

// 启用详细日志
const ENABLE_DEBUG_LOGS = true;

// 日志助手函数
function logDebug(message: string, data?: any) {
  if (!ENABLE_DEBUG_LOGS) return;

  if (data) {
    console.log(`[Auth Debug] ${message}`, data);
  } else {
    console.log(`[Auth Debug] ${message}`);
  }
}

// 获取存储的会话
function getSavedSession(): Session | null {
  if (typeof window === 'undefined') {
    logDebug('getSavedSession called on server, returning null');
    return null;
  }

  try {
    logDebug('Getting saved session from localStorage');
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!saved) {
      logDebug('No saved session found');
      return null;
    }

    logDebug('Parsing saved session');
    const parsed = JSON.parse(saved);

    // 确保过期日期是Date对象
    if (parsed && parsed.expires) {
      parsed.expires = new Date(parsed.expires);
      logDebug('Session expires at', parsed.expires);

      // 检查会话是否过期
      if (parsed.expires < new Date()) {
        logDebug('Session has expired, removing');
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
    }

    logDebug('Returning valid session', parsed);
    return parsed;
  } catch (error) {
    console.error('[Auth Error] Failed to parse saved session', error);
    return null;
  }
}

// 保存会话到localStorage和cookies
function saveSession(session: Session | null) {
  if (typeof window === 'undefined') {
    logDebug('saveSession called on server, ignoring');
    return;
  }

  if (session === null) {
    logDebug('Clearing session');
    localStorage.removeItem(SESSION_STORAGE_KEY);
    document.cookie = `auth.session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `onboarding.completed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } else {
    logDebug('Saving session to localStorage', session);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    // 设置cookie，用于中间件检测登录状态
    const expires = new Date(session.expires);
    const authCookie = `auth.session=true; expires=${expires.toUTCString()}; path=/;`;
    logDebug('Setting auth cookie', authCookie);
    document.cookie = authCookie;

    // 如果用户已完成引导，设置引导完成cookie
    if (session.user.onboardingCompleted) {
      const onboardingCookie = `onboarding.completed=true; expires=${expires.toUTCString()}; path=/;`;
      logDebug('Setting onboarding cookie', onboardingCookie);
      document.cookie = onboardingCookie;
    }
  }
}

/**
 * 用于获取用户认证状态的 Hook
 */
export function useIsAuthenticated() {
  const [state, setState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null as User | null,
    session: null as Session | null,
    isOnboardingCompleted: false
  });

  useEffect(() => {
    // 在客户端加载保存的会话
    logDebug('useIsAuthenticated hook initialized');
    const savedSession = getSavedSession();

    // 检查 onboarding 状态
    const isOnboardingCompleted = !!savedSession?.user?.onboardingCompleted;
    logDebug('Onboarding completed status:', isOnboardingCompleted);

    // 将 onboardingCompleted 保存到 state
    const newState = {
      isAuthenticated: !!savedSession?.user,
      isLoading: false,
      user: savedSession?.user || null,
      session: savedSession,
      isOnboardingCompleted
    };

    logDebug('Setting auth state', newState);
    setState(newState);

    console.log('Auth state loaded:', {
      isAuthenticated: !!savedSession?.user,
      isOnboardingCompleted,
      user: savedSession?.user
    });
  }, []);

  return state;
}

/**
 * 登录函数
 * @param provider 提供商
 * @param options 选项
 */
export async function signIn(provider: string, options?: any) {
  try {
    logDebug(`signIn called with provider: ${provider}`, options);

    // 模拟延迟
    logDebug('Simulating network delay (500ms)');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 凭证登录模拟
    if (provider === 'credentials') {
      const { email, password } = options || {};
      logDebug(`Credentials sign-in attempt for email: ${email}`);

      // 验证必须提供邮箱和密码
      if (!email || !password) {
        logDebug('Missing email or password');
        return { ok: false, error: '请提供邮箱和密码' };
      }

      // 查找测试用户
      logDebug('Looking for matching test user');
      const user = TEST_USERS.find(
        u => u.email === email && u.password === password
      );

      if (!user) {
        logDebug('No matching user found');
        return { ok: false, error: '邮箱或密码错误' };
      }

      logDebug('User found', user);

      // 创建会话
      const session: Session = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          onboardingCompleted: user.onboardingCompleted
        },
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
      };

      logDebug('Created session', session);

      // 保存会话
      saveSession(session);
      logDebug('Session saved');

      // 确定重定向URL
      const redirectUrl = !user.onboardingCompleted
        ? '/onboarding'
        : (options?.callbackUrl || '/');

      logDebug('Login successful, should redirect to:', redirectUrl);

      // 如果不需要手动控制重定向，尝试使用window重定向
      if (options?.redirect !== false) {
        try {
          logDebug('Auto redirect mode, redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
          return { ok: true };
        } catch (e) {
          logDebug('Auto redirect failed, returning for manual handling', e);
        }
      }

      // 返回成功状态和会话信息，让调用方处理重定向
      return {
        ok: true,
        session,
        redirectUrl
      };
    }

    // 社交登录模拟
    if (['google', 'github'].includes(provider)) {
      logDebug(`Social sign-in with ${provider}`);

      // 使用第一个测试用户模拟
      const user = TEST_USERS[0];
      logDebug('Using test user for social login', user);

      const session: Session = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: provider === 'github'
            ? 'https://github.com/github.png'
            : 'https://lh3.googleusercontent.com/a/default-user',
          onboardingCompleted: user.onboardingCompleted
        },
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
      };

      logDebug('Created session for social login', session);

      // 保存会话
      saveSession(session);
      logDebug('Session saved for social login');

      // 确定重定向URL
      const redirectUrl = !user.onboardingCompleted
        ? '/onboarding'
        : (options?.callbackUrl || '/');

      logDebug('Social login successful, should redirect to:', redirectUrl);

      // 如果不需要手动控制重定向，尝试使用window重定向
      if (options?.redirect !== false) {
        try {
          logDebug('Auto redirect mode for social login, redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
          return { ok: true };
        } catch (e) {
          logDebug('Auto redirect failed for social login, returning for manual handling', e);
        }
      }

      // 返回成功状态和会话信息，让调用方处理重定向
      return {
        ok: true,
        session,
        redirectUrl
      };
    }

    // 魔术链接登录 - 通常通过链接参数验证，这里仅为模拟
    if (provider === 'email') {
      logDebug('Magic link login, returning success');
      return { ok: true, error: null };
    }

    // Passkey登录模拟
    if (provider === 'passkey') {
      logDebug('Passkey sign-in attempt');
      // 使用第一个测试用户模拟
      const user = TEST_USERS[0];
      logDebug('Using test user for passkey login', user);

      const session: Session = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          onboardingCompleted: user.onboardingCompleted
        },
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
      };

      logDebug('Created session for passkey login', session);

      // 保存会话
      saveSession(session);
      logDebug('Session saved for passkey login');

      // 确定重定向URL
      const redirectUrl = !user.onboardingCompleted
        ? '/onboarding'
        : (options?.callbackUrl || '/');

      logDebug('Passkey login successful, should redirect to:', redirectUrl);

      // 如果不需要手动控制重定向，尝试使用window重定向
      if (options?.redirect !== false) {
        try {
          logDebug('Auto redirect mode for passkey login, redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
          return { ok: true };
        } catch (e) {
          logDebug('Auto redirect failed for passkey login, returning for manual handling', e);
        }
      }

      // 返回成功状态和会话信息
      return {
        ok: true,
        session,
        redirectUrl
      };
    }

    // 不支持的提供商
    logDebug(`Unsupported provider: ${provider}`);
    return { ok: false, error: `不支持的登录方式: ${provider}` };
  } catch (error: any) {
    console.error('[Auth Error] Login error:', error);
    return { ok: false, error: error.message || '登录失败' };
  }
}

/**
 * 请求魔术链接
 * @param email 邮箱
 * @param options 选项
 */
export async function requestMagicLink(email: string, options?: any) {
  try {
    logDebug(`requestMagicLink called for email: ${email}`, options);

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 验证邮箱存在
    const userExists = !!TEST_USERS.find(user => user.email === email);
    logDebug(`User exists check: ${userExists}`);

    if (!userExists) {
      // 不要在真实应用中透露用户是否存在，这里仅为测试目的
      logDebug('User not found, but we pretend to send the link anyway');
    }

    // 模拟成功发送
    logDebug('Magic link request successful');
    return { ok: true, error: null };
  } catch (error: any) {
    console.error('[Auth Error] Magic link request failed:', error);
    return {
      ok: false,
      error: error.message || '发送魔术链接失败'
    };
  }
}

/**
 * 登出函数
 * @param options 选项
 */
export async function signOut(options?: any) {
  try {
    logDebug('signOut called', options);

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 清除会话
    logDebug('Clearing session');
    saveSession(null);

    if (options?.callbackUrl) {
      logDebug(`Redirecting to ${options.callbackUrl}`);
      window.location.href = options.callbackUrl;
      return { ok: true };
    }

    logDebug('Sign out successful');
    return { ok: true, error: null };
  } catch (error: any) {
    console.error('[Auth Error] Sign out error:', error);
    return {
      ok: false,
      error: error.message || '登出失败'
    };
  }
}

/**
 * 更新引导完成状态
 */
export async function completeOnboarding() {
  try {
    logDebug('completeOnboarding called');
    const session = getSavedSession();

    if (!session) {
      logDebug('No active session found');
      return { ok: false, error: '用户未登录' };
    }

    // 更新用户的引导状态
    logDebug('Updating onboarding status to completed');
    session.user.onboardingCompleted = true;

    // 保存更新后的会话
    saveSession(session);
    logDebug('Updated session saved');

    return { ok: true };
  } catch (error: any) {
    console.error('[Auth Error] Complete onboarding error:', error);
    return {
      ok: false,
      error: error.message || '更新引导状态失败'
    };
  }
}
