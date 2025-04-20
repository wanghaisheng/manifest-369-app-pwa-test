/**
 * 测试登录API脚本
 * 这个脚本会模拟登录流程，验证本地存储和Cookie的设置
 */

// 测试账号信息
const TEST_ACCOUNTS = [
  {
    id: 'user1',
    email: 'test@example.com',
    password: 'password123',
    name: '测试账号',
    onboardingCompleted: true
  },
  {
    id: 'user2',
    email: 'admin@example.com',
    password: 'admin123',
    name: '管理员',
    onboardingCompleted: false
  }
];

// 创建会话并模拟存储
function simulateLogin(userIndex) {
  const user = TEST_ACCOUNTS[userIndex];
  console.log(`模拟登录: ${user.email}`);

  // 创建会话对象
  const session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted
    },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
  };

  // 打印会话信息
  console.log('会话信息:', JSON.stringify(session, null, 2));

  // 模拟localStorage存储
  console.log('localStorage设置:', {
    key: 'auth.session',
    value: JSON.stringify(session)
  });

  // 模拟Cookie设置
  const expires = new Date(session.expires);
  console.log('Cookie设置:', {
    'auth.session': `auth.session=true; expires=${expires.toUTCString()}; path=/;`
  });

  if (session.user.onboardingCompleted) {
    console.log('引导完成Cookie设置:', {
      'onboarding.completed': `onboarding.completed=true; expires=${expires.toUTCString()}; path=/;`
    });
  }

  // 确定重定向URL
  const redirectUrl = !user.onboardingCompleted
    ? '/onboarding'
    : '/';

  console.log('应该重定向到:', redirectUrl);

  return { session, redirectUrl };
}

// 测试两个账号
console.log('=== 测试账号1（已完成引导） ===');
const result1 = simulateLogin(0);

console.log('\n=== 测试账号2（未完成引导） ===');
const result2 = simulateLogin(1);

// 模拟会话获取
console.log('\n=== 模拟获取会话 ===');
console.log('从localStorage获取会话:', `localStorage.getItem('auth.session')`);
console.log('解析获取到的会话');
console.log('检查会话是否过期');
console.log('返回会话对象或null');

// 模拟认证状态钩子
console.log('\n=== 模拟useIsAuthenticated钩子 ===');
console.log('初始状态: { isAuthenticated: false, isLoading: true }');
console.log('加载完成后: { isAuthenticated: true, isLoading: false, user: {...}, isOnboardingCompleted: true/false }');

// 模拟登出
console.log('\n=== 模拟登出 ===');
console.log('清除localStorage: localStorage.removeItem("auth.session")');
console.log('清除Cookie: auth.session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');
console.log('清除Cookie: onboarding.completed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');
