"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completePaywall } from "@/lib/auth/auth-client";

export default function Paywall() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 处理付费订阅
  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // 这里应该集成实际的支付处理逻辑
      // 模拟支付成功
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await completePaywall();
      if (result.ok) {
        router.push("/");
      } else {
        console.error("Failed to complete payment:", result.error);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理跳过付费
  const handleSkip = async () => {
    setIsLoading(true);
    try {
      const result = await completePaywall();
      if (result.ok) {
        router.push("/");
      } else {
        console.error("Failed to skip paywall:", result.error);
      }
    } catch (error) {
      console.error("Error skipping paywall:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">升级到高级版</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">解锁全部功能</h2>
          
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>无限量的肯定语创建</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>高级语音识别功能</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>详细的进度分析和报告</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>专属社区支持</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-center mb-2">
            <span className="text-2xl font-bold text-purple-800">¥39.99</span>
            <span className="text-gray-500 ml-1">/月</span>
          </div>
          <p className="text-center text-sm text-gray-500">或 ¥399.99/年 (节省 17%)</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-200 flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "立即订阅"
            )}
          </button>
          
          <button
            onClick={handleSkip}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-transparent hover:bg-gray-100 text-gray-700 font-medium rounded-lg border border-gray-300 transition duration-200"
          >
            稍后再说
          </button>
        </div>
        
        <p className="mt-6 text-xs text-center text-gray-500">
          订阅后，您将获得30天的免费试用期。您可以随时取消订阅。
        </p>
      </div>
    </div>
  );
}