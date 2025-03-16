/**
 * 测试账号API
 * 仅在开发环境中可用
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 只在开发环境中可用
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Only available in development mode' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: '这些是测试账号，仅用于开发环境',
    accounts: [
      {
        type: '普通用户',
        email: 'test@example.com',
        password: 'password123',
        name: '测试账号'
      },
      {
        type: '管理员',
        email: 'admin@example.com',
        password: 'admin123',
        name: '管理员'
      }
    ]
  });
}

export const runtime = 'edge';
