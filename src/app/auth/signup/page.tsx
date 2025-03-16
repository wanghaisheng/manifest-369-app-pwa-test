"use client";

import { useState } from "react";
import { register } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 验证密码
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      setIsLoading(false);
      return;
    }

    // 密码强度验证
    if (password.length < 8) {
      setError("密码长度至少需要8个字符");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        name,
        email,
        password,
        callbackUrl
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setRegistered(true);
      }
    } catch (err: any) {
      setError(err.message || "注册失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">注册成功</h2>
          <p className="text-center mb-4">
            我们已向 {email} 发送了一封验证邮件，请点击邮件中的链接完成注册。
          </p>
          <Link
            href="/auth/signin"
            className="block w-full bg-purple-600 text-white py-2 px-4 rounded-md text-center"
          >
            返回登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">注册账户</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              昵称
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
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
          <div className="mb-4">
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
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">密码至少8个字符</p>
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              确认密码
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-md hover:bg-purple-700"
          >
            {isLoading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="text-center text-sm">
          已有账户？{" "}
          <Link
            href={{
              pathname: "/auth/signin",
              search: callbackUrl !== "/" ? `?callbackUrl=${callbackUrl}` : "",
            }}
            className="text-purple-600 hover:underline"
          >
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}
