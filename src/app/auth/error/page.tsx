"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

// 错误类型映射
const ERROR_MESSAGES: Record<string, string> = {
  "default": "认证过程中出现未知错误",
  "configuration": "服务器端配置错误",
  "accessdenied": "访问被拒绝",
  "verification": "验证失败",
  "not-found": "用户未找到",
  "expired": "链接已过期，请重新请求",
  "signin": "登录失败，请重试",
  "oauthsignin": "使用提供方登录失败",
  "oauthcallback": "提供方回调失败",
  "oauthcreateaccount": "无法使用提供方创建账户",
  "emailcreateaccount": "无法使用邮箱创建账户",
  "callback": "回调处理失败",
  "oauthaccountnotlinked": "该邮箱已存在相关账户，请使用原登录方式",
  "emailsignin": "验证邮件发送失败",
  "credentialssignin": "登录凭据无效",
  "sessionrequired": "需要登录才能访问此页面",
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") || "default";

  // 获取错误信息
  const errorMessage = ERROR_MESSAGES[error] || ERROR_MESSAGES.default;

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-12 h-12 text-red-500 mx-auto mb-4"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2 className="text-2xl font-bold mb-4">认证错误</h2>
          <p className="mb-6 text-gray-700">{errorMessage}</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full bg-purple-600 text-white py-2 px-4 rounded-md text-center"
          >
            返回登录
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-center"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
