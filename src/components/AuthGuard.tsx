"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIsAuthenticated } from "@/lib/auth-client";

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
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  useEffect(() => {
    // 等待认证状态加载完成
    if (isLoading) return;

    // 检查是否是需要认证的路径
    const isProtectedPath = PROTECTED_PATHS.some(path => pathname?.startsWith(path));

    // 检查是否是公开路径
    const isPublicPath = PUBLIC_PATHS.some(path => pathname?.startsWith(path));

    // 未认证且访问受保护路径 -> 重定向到登录页
    if (!isAuthenticated && isProtectedPath) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname || "/")}`);
    }

    // 已认证且访问认证相关页面 -> 重定向到首页
    if (isAuthenticated && pathname?.startsWith("/auth")) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // 当认证状态加载中时，可以返回一个加载状态
  if (isLoading) {
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
