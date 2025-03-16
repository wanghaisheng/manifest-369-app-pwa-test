'use client';

import Link from "next/link";
import { useIsAuthenticated, signOut } from "@/lib/auth/auth-client";

/**
 * 应用程序顶部导航栏
 */
export default function Header() {
  const { isAuthenticated, user, isLoading } = useIsAuthenticated();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-purple-600">369 显化</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-purple-500 border-r-transparent" />
            ) : isAuthenticated ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-purple-600">
                  {user?.name || user?.email?.split('@')[0] || '个人中心'}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  退出
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  登录
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3 py-1.5 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-md"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
