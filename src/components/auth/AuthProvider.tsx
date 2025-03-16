'use client';

import { PropsWithChildren } from 'react';

interface AuthProviderProps extends PropsWithChildren {
  // 可以根据需要添加属性
}

/**
 * 认证提供者组件
 * 为应用程序提供认证上下文
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // 暂时只返回子元素，后面可以集成better-auth的provider
  return <>{children}</>;
}
