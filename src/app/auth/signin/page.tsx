"use client";

import { useState, useEffect } from "react";
import { signIn, requestMagicLink } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const [testAccounts, setTestAccounts] = useState<any[]>([]);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  // 获取测试账号
  useEffect(() => {
    // 只在开发环境中获取测试账号
    if (process.env.NODE_ENV === 'development') {
      fetch('/api/auth/test-accounts')
        .then(res => res.json())
        .then(data => {
          if (data.accounts) {
            setTestAccounts(data.accounts);
          }
        })
        .catch(err => console.error('Failed to fetch test accounts:', err));
    }
  }, []);

  // 处理凭证登录
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || "登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 填充测试账号
  const fillTestAccount = (account: any) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  // 处理魔术链接登录
  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("请输入电子邮箱");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await requestMagicLink(email, {
        callbackUrl,
      });
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message || "发送链接失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 处理社交登录
  const handleSocialSignIn = (provider: string) => {
    signIn(provider, {
      callbackUrl,
    });
  };

  // 处理Passkey登录
  const handlePasskeySignIn = () => {
    signIn("passkey", {
      callbackUrl,
    });
  };

  if (magicLinkSent) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">邮件已发送</h2>
          <p className="text-center mb-4">
            我们已向 {email} 发送了一封邮件，请点击邮件中的链接登录。
          </p>
          <button
            onClick={() => setMagicLinkSent(false)}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md mb-4"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">登录</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* 测试账号提示 - 仅在开发环境显示 */}
        {testAccounts.length > 0 && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowTestAccounts(!showTestAccounts)}
              className="text-purple-600 text-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 mr-1 transition-transform ${showTestAccounts ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              显示测试账号
            </button>

            {showTestAccounts && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                <p className="text-gray-500 mb-2">开发环境测试账号：</p>
                <div className="space-y-2">
                  {testAccounts.map((account, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <div>{account.type}: {account.email}</div>
                        <div className="text-gray-400">密码: {account.password}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => fillTestAccount(account)}
                        className="text-xs text-purple-600 underline"
                      >
                        使用
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 密码登录表单 */}
        <form onSubmit={handleCredentialsSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              电子邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-md hover:bg-purple-700"
          >
            {isLoading ? "登录中..." : "登录"}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">或使用</span>
          </div>
        </div>

        {/* 无密码登录选项 */}
        <div className="space-y-3 mb-6">
          {/* 魔术链接登录 */}
          <form onSubmit={handleMagicLinkSubmit}>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center"
            >
              <span>魔术链接登录</span>
            </button>
          </form>

          {/* Passkey 登录 */}
          <button
            onClick={handlePasskeySignIn}
            disabled={isLoading}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center"
          >
            <span>Passkey 登录</span>
          </button>

          {/* Google 登录 */}
          <button
            onClick={() => handleSocialSignIn("google")}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google 登录
          </button>

          {/* GitHub 登录 */}
          <button
            onClick={() => handleSocialSignIn("github")}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="#ffffff"
              />
            </svg>
            GitHub 登录
          </button>
        </div>

        <p className="text-center text-sm">
          还没有账户？{" "}
          <Link
            href={{
              pathname: "/auth/signup",
              search: callbackUrl !== "/" ? `?callbackUrl=${callbackUrl}` : "",
            }}
            className="text-purple-600 hover:underline"
          >
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}
