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
  paywallCompleted?: boolean;
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
    onboardingCompleted: true,
    paywallCompleted: true
  },
  {
    id: 'user2',
    email: 'admin@example.com',
    password: 'admin123',
    name: '管理员',
    onboardingCompleted: false,
    paywallCompleted: false
  }
];

// 用于存储会话的localStorage键
const SESSION_STORAGE_KEY = 'auth.session';
const ONBOARDING_COMPLETED_KEY = 'onboarding.completed';
const PAYWALL_COMPLETED_KEY = 'paywall.completed';

// 获取存储的会话
function getSavedSession(): Session | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    // 确保过期日期是Date对象
    if (parsed && parsed.expires) {
      parsed.expires = new Date(parsed.expires);

      // 检查会话是否过期
      if (parsed.expires < new Date()) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
    }

    return parsed;
  } catch (error) {
    console.error('Failed to parse saved session', error);
    return null;
  }
}

// 保存会话到localStorage
function saveSession(session: Session | null) {
  if (typeof window === 'undefined') return;

  if (session === null) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    document.cookie = `auth.session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `onboarding.completed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `paywall.completed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } else {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    // 设置cookie，用于中间件检测登录状态
    const expires = new Date(session.expires);
    document.cookie = `auth.session=true; expires=${expires.toUTCString()}; path=/;`;

    // 如果用户已完成引导，设置引导完成cookie
    if (session.user.onboardingCompleted) {
      document.cookie = `onboarding.completed=true; expires=${expires.toUTCString()}; path=/;`;
    }
    
    // 如果用户已完成付费墙，设置付费墙完成cookie
    if (session.user.paywallCompleted) {
      document.cookie = `paywall.completed=true; expires=${expires.toUTCString()}; path=/;`;
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
    isOnboardingCompleted: false,
    isPaywallCompleted: false
  });

  useEffect(() => {
    // 在客户端加载保存的会话
    const savedSession = getSavedSession();

    setState({
      isAuthenticated: !!savedSession?.user,
      isLoading: false,
      user: savedSession?.user || null,
      session: savedSession,
      isOnboardingCompleted: !!savedSession?.user?.onboardingCompleted,
      isPaywallCompleted: !!savedSession?.user?.paywallCompleted
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
    console.log(`Signing in with ${provider}`, options);

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 凭证登录模拟
    if (provider === 'credentials') {
      const { email, password } = options || {};

      // 验证必须提供邮箱和密码
      if (!email || !password) {
        return { ok: false, error: '请提供邮箱和密码' };
      }

      // 查找测试用户
      const user = TEST_USERS.find(
        u => u.email === email && u.password === password
      );

      if (!user) {
        return { ok: false, error: '邮箱或密码错误' };
      }

      // 创建会话
      const session: Session = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          onboardingCompleted: user.onboardingCompleted,
          paywallCompleted: user.paywallCompleted
        },
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
      };

      // 保存会话
      saveSession(session);

      if (options?.redirect !== false) {
        // 如果未完成引导流程，重定向到引导页面
        // 如果完成引导但未完成付费墙，重定向到付费墙页面
        // 否则重定向到回调URL或首页
        let redirectUrl = '/';
        if (!user.onboardingCompleted) {
          redirectUrl = '/onboarding';
        } else if (!user.paywallCompleted) {
          redirectUrl = '/paywall';
        } else {
          redirectUrl = options?.callbackUrl || '/';
        }

        window.location.href = redirectUrl;
        return { ok: true };
      }

      return { ok: true, session };
    }

    // 社交登录模拟
    if (['google', 'github'].includes(provider)) {
      // 使用第一个测试用户模拟
      const user = TEST_USERS[0];

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

      // 保存会话
      saveSession(session);

      // 如果未完成引导流程，重定向到引导页面，否则重定向到回调URL或首页
      const redirectUrl = !user.onboardingCompleted
        ? '/onboarding'
        : (options?.callbackUrl || '/');

      window.location.href = redirectUrl;
      return { ok: true };
    }

    // 魔术链接登录 - 通常通过链接参数验证，这里仅为模拟
    if (provider === 'email') {
      return { ok: true, error: null };
    }

    // 默认行为
    return { ok: false, error: `不支持的登录方式: ${provider}` };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || '登录失败'
    };
  }
}

/**
 * 注册函数
 * @param userData 用户数据
 */
export async function register(userData: any) {
  try {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Registering user', userData);

    // 验证邮箱是否被使用
    if (TEST_USERS.find(user => user.email === userData.email)) {
      return { ok: false, error: '该邮箱已被注册' };
    }

    // 模拟成功注册 - 在真实应用中会写入数据库
    return { ok: true, error: null };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || '注册失败'
    };
  }
}

/**
 * 发送魔术链接函数
 * @param email 邮箱
 * @param options 选项
 */
export async function requestMagicLink(email: string, options?: any) {
  try {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`Sending magic link to ${email}`, options);

    // 验证邮箱存在
    if (!TEST_USERS.find(user => user.email === email)) {
      // 不要在真实应用中透露用户是否存在，这里仅为测试目的
      console.log('User not found, but we pretend to send the link anyway');
    }

    // 模拟成功发送
    return { ok: true, error: null };
  } catch (error: any) {
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
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Signing out', options);

    // 清除会话
    saveSession(null);

    if (options?.callbackUrl) {
      window.location.href = options.callbackUrl;
      return { ok: true };
    }

    return { ok: true, error: null };
  } catch (error: any) {
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
    const session = getSavedSession();

    if (!session) {
      return { ok: false, error: '用户未登录' };
    }

    // 更新用户的引导状态
    session.user.onboardingCompleted = true;

    // 保存更新后的会话
    saveSession(session);

    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || '更新引导状态失败'
    };
  }
}

/**
 * 更新付费墙完成状态
 */
export async function completePaywall() {
  try {
    const session = getSavedSession();

    if (!session) {
      return { ok: false, error: '用户未登录' };
    }

    // 更新用户的付费墙状态
    session.user.paywallCompleted = true;

    // 保存更新后的会话
    saveSession(session);

    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || '更新付费墙状态失败'
    };
  }
}
