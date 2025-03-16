import { NextRequest, NextResponse } from 'next/server';

// 不需要登录的页面
const publicPaths = [
  '/auth/signin',
  '/auth/signup',
  '/auth/verify-request',
  '/auth/error',
  '/api/auth'
];

// 无需完成引导的页面
const skipOnboardingPaths = [
  '/onboarding',
  '/api',
  '/auth'
];

// 无需完成付费墙的页面
const skipPaywallPaths = [
  '/onboarding',
  '/paywall',
  '/api',
  '/auth'
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是公开路径
  const isPublicPath = publicPaths.some(path =>
    pathname === path ||
    pathname.startsWith(path + '/')
  );

  // 获取会话状态 - 在真实应用中应该检查有效的session cookie
  const authCookie = request.cookies.get('auth.session')?.value;
  const isAuthenticated = !!authCookie; // 简单判断是否已认证

  // 检查用户是否完成引导（这里用cookie模拟存储）
  const onboardingCompletedCookie = request.cookies.get('onboarding.completed')?.value;
  const isOnboardingCompleted = !!onboardingCompletedCookie;
  
  // 检查用户是否完成付费墙
  const paywallCompletedCookie = request.cookies.get('paywall.completed')?.value;
  const isPaywallCompleted = !!paywallCompletedCookie;

  // 是否跳过引导检查
  const shouldSkipOnboardingCheck = skipOnboardingPaths.some(path =>
    pathname === path ||
    pathname.startsWith(path + '/')
  );
  
  // 是否跳过付费墙检查
  const shouldSkipPaywallCheck = skipPaywallPaths.some(path =>
    pathname === path ||
    pathname.startsWith(path + '/')
  );

  // 根路径处理 - 如果未登录，重定向到登录页
  if (pathname === '/') {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // 如果已登录但未完成引导，重定向到引导页
    if (isAuthenticated && !isOnboardingCompleted && !shouldSkipOnboardingCheck) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    
    // 如果已完成引导但未完成付费墙，重定向到付费墙页面
    if (isAuthenticated && isOnboardingCompleted && !isPaywallCompleted && !shouldSkipPaywallCheck) {
      return NextResponse.redirect(new URL('/paywall', request.url));
    }
  }

  // 认证路由保护逻辑
  if (!isAuthenticated && !isPublicPath) {
    // 未认证且不是公开页面，重定向到登录页
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, request.url));
  } else if (isAuthenticated && pathname.startsWith('/auth/')) {
    // 已认证但访问认证页面，重定向到首页
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 引导页面流程
  if (isAuthenticated && !isOnboardingCompleted && !shouldSkipOnboardingCheck) {
    // 已认证但未完成引导，且不在引导相关页面，重定向到引导页
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
  
  // 付费墙流程
  if (isAuthenticated && isOnboardingCompleted && !isPaywallCompleted && !shouldSkipPaywallCheck) {
    // 已认证且已完成引导，但未完成付费墙，且不在付费墙相关页面，重定向到付费墙页面
    return NextResponse.redirect(new URL('/paywall', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|uploads).*)',
  ],
};
