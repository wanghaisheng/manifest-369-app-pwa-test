"use client";

import Link from "next/link";

export default function VerifyRequest() {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">请查看您的邮箱</h2>

        <p className="mb-6">
          一封包含登录链接的邮件已发送到您的邮箱。
          请点击邮件中的链接完成登录。
        </p>

        <p className="text-sm text-gray-500 mb-6">
          如果您没有收到邮件，请检查垃圾邮件文件夹，或稍后再试。
        </p>

        <Link
          href="/auth/signin"
          className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-center"
        >
          返回登录
        </Link>
      </div>
    </div>
  );
}
