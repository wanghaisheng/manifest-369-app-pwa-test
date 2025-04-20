/**
 * 测试登录流程脚本
 * 这个脚本模拟登录过程并记录所有相关状态
 */

// 模拟浏览器环境
const mockBrowser = {
  localStorage: {},
  cookies: {},
  location: {
    href: 'http://localhost:3000/auth/signin'
  },
  history: {
    pushState: (state, title, url) => {
      console.log(`[History] pushState to ${url}`);
      mockBrowser.location.href = url;
    }
  }
};

// 模拟localStorage
global.localStorage = {
  getItem: (key) => {
    console.log(`[localStorage] Getting ${key}: ${mockBrowser.localStorage[key] || 'null'}`);
    return mockBrowser.localStorage[key] || null;
  },
  setItem: (key, value) => {
    console.log(`[localStorage] Setting ${key}: ${value}`);
    mockBrowser.localStorage[key] = value;
  },
  removeItem: (key) => {
    console.log(`[localStorage] Removing ${key}`);
    delete mockBrowser.localStorage[key];
  }
};

// 模拟document.cookie
Object.defineProperty(global, 'document', {
  value: {
    cookie: {
      get: () => mockBrowser.cookies,
      set: (cookie) => {
        const [keyValue] = cookie.split(';');
        const [key, value] = keyValue.split('=');
        console.log(`[Cookie] Setting ${key}=${value}`);
        mockBrowser.cookies[key] = value;
      }
    }
  },
  writable: true
});

// 模拟window
global.window = {
  location: mockBrowser.location,
  history: mockBrowser.history
};

// 模拟测试用户
const TEST_USERS = [
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

// 模拟登录过程
async function simulateLogin(email, password) {
  console.log(`\n=== 模拟登录过程 ===`);
  console.log(`用户: ${email}, 密码: ${password}`);

  // 1. 查找用户
  const user = TEST_USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    console.log('用户不存在或密码错误');
    return { ok: false, error: '邮箱或密码错误' };
  }

  // 2. 创建会话
  const session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted
    },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
  };

  console.log('创建会话:', JSON.stringify(session, null, 2));

  // 3. 保存会话
  localStorage.setItem('auth.session', JSON.stringify(session));

  // 4. 设置cookie
  const expires = new Date(session.expires);
  document.cookie.set(`auth.session=true; expires=${expires.toUTCString()}; path=/;`);

  if (session.user.onboardingCompleted) {
    document.cookie.set(`onboarding.completed=true; expires=${expires.toUTCString()}; path=/;`);
  }

  // 5. 确定重定向URL
  const redirectUrl = !user.onboardingCompleted ? '/onboarding' : '/';
  console.log(`应该重定向到: ${redirectUrl}`);

  // 6. 模拟Next.js路由器重定向
  console.log(`[Router] 使用Next.js路由器重定向到 ${redirectUrl}`);

  // 7. 检查认证状态
  console.log('\n=== 验证认证状态 ===');
  const savedSession = JSON.parse(localStorage.getItem('auth.session'));
  console.log('认证状态:', {
    isAuthenticated: !!savedSession?.user,
    isOnboardingCompleted: !!savedSession?.user?.onboardingCompleted,
    user: savedSession?.user
  });

  return {
    ok: true,
    session,
    redirectUrl
  };
}

// 测试已完成引导的用户
console.log('===== 测试已完成引导的用户 =====');
simulateLogin('test@example.com', 'password123').then(result => {
  console.log('\n登录结果:', result);
  console.log('\n最终状态:');
  console.log('localStorage:', mockBrowser.localStorage);
  console.log('cookies:', mockBrowser.cookies);
  console.log('location:', mockBrowser.location.href);
});

// 延迟2秒后测试未完成引导的用户
setTimeout(() => {
  console.log('\n\n===== 测试未完成引导的用户 =====');
  simulateLogin('admin@example.com', 'admin123').then(result => {
    console.log('\n登录结果:', result);
    console.log('\n最终状态:');
    console.log('localStorage:', mockBrowser.localStorage);
    console.log('cookies:', mockBrowser.cookies);
    console.log('location:', mockBrowser.location.href);
  });
}, 2000);
