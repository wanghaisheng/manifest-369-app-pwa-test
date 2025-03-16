/**
 * 认证API处理程序
 */
import { NextRequest, NextResponse } from 'next/server';

// 处理认证请求
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Auth API is online',
    status: 'ok'
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      message: 'Auth request received',
      data: body
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}

export const runtime = 'edge';
