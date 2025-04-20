"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIsAuthenticated } from "@/lib/auth/auth-client";

interface AuthGuardProps {
  children: React.ReactNode;
}

// 需要认证的路径前缀
const PROTECTED_PATHS = ["/practice", "/wishes", "/profile"];

// 不需要认证的路径前缀
const PUBLIC_PATHS = ["/", "/auth"];

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, isOnboardingCompleted } = useIsAuthenticated();
  const [isClient, setIsClient] = useState(false);

  // 确保在客户端执行
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // 只在客户端和认证状态加载完成后执行
    if (!isClient || isLoading) return;

    console.log("Auth state:", { isAuthenticated, pathname, isOnboardingCompleted });

    // 检查是否是需要认证的路径
    const isProtectedPath = PROTECTED_PATHS.some(path => pathname?.startsWith(path));

    // 未认证且访问受保护路径 -> 重定向到登录页
    if (!isAuthenticated && isProtectedPath) {
      console.log(`Unauthenticated access to protected path: ${pathname}, redirecting to login`);
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    // 已认证但访问认证相关页面 -> 重定向到首页
    if (isAuthenticated && pathname?.startsWith("/auth")) {
      console.log(`Authenticated user accessing auth page: ${pathname}, redirecting to home`);
      router.push("/");
      return;
    }

    // 已认证但未完成引导且非引导页面 -> 重定向到引导页
    if (isAuthenticated && !isOnboardingCompleted && !pathname?.startsWith("/onboarding") && !pathname?.startsWith("/auth")) {
      console.log(`User needs onboarding, redirecting from ${pathname} to onboarding`);
      router.push("/onboarding");
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router, isClient, isOnboardingCompleted]);

  // 当认证状态加载中或不在客户端时，显示加载状态
  if (isLoading || !isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // 检查是否是需要认证的路径
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname?.startsWith(path));

  // 如果是需要认证的路径但未认证，则不渲染子内容
  if (isProtectedPath && !isAuthenticated) {
    return null;
  }

  // 认证状态符合要求，渲染子内容
  return <>{children}</>;
}
