"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/auth/auth-client";

// 引导步骤
const STEPS = [
  {
    id: "welcome",
    title: "欢迎使用369显化",
    description: "369显化法则是一种通过重复肯定语来帮助你吸引愿望成真的方法。让我们一起开始这段旅程！"
  },
  {
    id: "method",
    title: "369法则说明",
    description: "每天早上写下你的愿望3次，下午写下6次，晚上写下9次。持续这个过程，直到你的愿望实现。"
  },
  {
    id: "practice",
    title: "坚持练习",
    description: "坚持21天是形成一个新习惯的关键。我们会帮助你坚持下去，直到你看到显化的效果。"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 处理下一步
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      handleComplete();
    }
  };

  // 处理上一步
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  // 完成引导
  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const result = await completeOnboarding();
      if (result.ok) {
        router.push("/");
      } else {
        console.error("Failed to complete onboarding:", result.error);
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 当前步骤
  const step = STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-md">
        {/* 进度指示器 */}
        <div className="flex justify-between mb-8">
          {STEPS.map((s, index) => (
            <div
              key={s.id}
              className="flex flex-col items-center"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`h-0.5 w-16 mt-4 ${
                  index < currentStep ? "bg-purple-600" : "bg-gray-200"
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
          <p className="text-gray-600 mb-8">{step.description}</p>

          {/* 根据步骤显示不同内容 */}
          {step.id === "welcome" && (
            <div className="text-center mb-6">
              <div className="text-purple-600 text-5xl mb-4">369</div>
              <p className="text-sm text-gray-500">
                通过重复和专注，你可以重新编程你的潜意识，吸引你想要的一切。
              </p>
            </div>
          )}

          {step.id === "method" && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center p-3 bg-purple-50 rounded-md">
                <div className="bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3">3</div>
                <div>早晨写下3次</div>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-md">
                <div className="bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3">6</div>
                <div>下午写下6次</div>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-md">
                <div className="bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3">9</div>
                <div>晚上写下9次</div>
              </div>
            </div>
          )}

          {step.id === "practice" && (
            <div className="mb-6 text-center">
              <div className="inline-block p-4 bg-purple-50 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">
                你将在接下来的21天内，每天收到提醒和鼓励，帮助你坚持显化练习。
              </p>
            </div>
          )}
        </div>

        {/* 按钮区域 */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep || isLoading}
            className={`px-4 py-2 rounded-md ${
              isFirstStep
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            上一步
          </button>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            {isLoading
              ? "处理中..."
              : isLastStep
                ? "开始体验"
                : "下一步"
            }
          </button>
        </div>
      </div>
    </div>
  );
}
