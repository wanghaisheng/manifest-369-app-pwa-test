"use client";

/**
 * 首页组件
 */
import { useEffect } from "react";
import Link from "next/link";
import { useIsAuthenticated } from "@/lib/auth/auth-client";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useIsAuthenticated();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          欢迎使用 369 显化
        </h1>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : isAuthenticated ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              欢迎回来，{user?.name || "朋友"}
            </h2>
            <p className="text-gray-600 mb-6">
              选择一个操作继续你的显化之旅。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/practice"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-md py-3 px-4 text-center"
              >
                开始今日练习
              </Link>
              <Link
                href="/wishes"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md py-3 px-4 text-center"
              >
                查看我的心愿
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">开始你的显化之旅</h2>
            <p className="text-gray-600 mb-6">
              登录或注册账号，开始使用 369 法则改变你的生活。
            </p>
            <div className="flex space-x-4 justify-center">
              <Link
                href="/auth/signin"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md py-2 px-4"
              >
                登录
              </Link>
              <Link
                href="/auth/signup"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 px-4"
              >
                注册
              </Link>
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            什么是 369 显化法则?
          </h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              369 显化法则是基于尼古拉·特斯拉的发现："如果你知道宇宙的壮丽，就从数字 3、6、9 开始。"
            </p>
            <p className="text-gray-600 mb-4">
              使用这个方法：
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>早晨写下你的愿望 3 次</li>
              <li>下午写下你的愿望 6 次</li>
              <li>晚上写下你的愿望 9 次</li>
            </ul>
            <p className="text-gray-600">
              通过坚持重复，你正在向宇宙传递清晰的信号，帮助你吸引愿望成真。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
